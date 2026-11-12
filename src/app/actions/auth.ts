"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, destroySession } from "@/lib/auth";
import { db } from "@/lib/db";
import { parseForm, type FormState } from "@/lib/form";

function safeNext(next: unknown, fallback: string) {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
  next: z.string().optional(),
});

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(loginSchema, formData);
  if (parsed.state) return parsed.state;
  const { email, password, next } = parsed.data;

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return { ok: false, message: "That email and password don't match.", values: { email } };
  }

  await createSession({ uid: user.id, name: user.name, role: user.role });
  redirect(safeNext(next, user.role === "ADMIN" ? "/admin" : "/account"));
}

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Tell us your name").max(120),
    email: z.string().trim().toLowerCase().email("Enter a valid email"),
    phone: z
      .string()
      .trim()
      .regex(/^[0-9+\-\s()]{8,20}$/, "Enter a valid phone number"),
    password: z.string().min(8, "At least 8 characters"),
    confirm: z.string(),
    next: z.string().optional(),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords don't match" });

export async function register(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(registerSchema, formData);
  if (parsed.state) return parsed.state;
  const { name, email, phone, password, next } = parsed.data;

  if (await db.user.findUnique({ where: { email } })) {
    return { ok: false, errors: { email: "An account with this email already exists" }, values: { name, email, phone } };
  }

  const user = await db.user.create({
    data: { name, email, phone, passwordHash: await bcrypt.hash(password, 10) },
  });
  await createSession({ uid: user.id, name: user.name, role: user.role });
  redirect(safeNext(next, "/services"));
}

export async function logout() {
  await destroySession();
  redirect("/");
}
