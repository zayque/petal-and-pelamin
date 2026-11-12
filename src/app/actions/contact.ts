"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { parseForm, type FormState } from "@/lib/form";
import { parseISODate } from "@/lib/format";

const schema = z.object({
  name: z.string().trim().min(2, "Tell us your name").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  phone: z.string().trim().max(30).optional(),
  eventDate: z.string().optional(),
  body: z.string().trim().min(10, "A few more words, please").max(2000),
});

export async function sendMessage(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(schema, formData);
  if (parsed.state) return parsed.state;
  const { eventDate, phone, ...rest } = parsed.data;

  await db.message.create({
    data: { ...rest, phone: phone || null, eventDate: parseISODate(eventDate) },
  });
  return { ok: true, message: "Your message is on its way. A wedding planner will get back to you within one working day." };
}
