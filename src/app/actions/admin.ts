"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import type { BookingStatus, Category } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { parseForm, type FormState } from "@/lib/form";
import { parseISODate, slugify } from "@/lib/format";
import { uploadDir } from "@/lib/uploads";

/* ───────────── Services ───────────── */

const CATEGORY_KEYS = ["HALL", "PACKAGE", "DAIS", "DRESS", "PHOTOBOOTH"] as const satisfies readonly Category[];

const serviceSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(2, "Required").max(160),
  category: z.enum(CATEGORY_KEYS, { message: "Choose a category" }),
  tagline: z.string().trim().min(5, "Required").max(255),
  description: z.string().trim().min(10, "Add a short description"),
  features: z.string().optional(),
  price: z.coerce.number({ message: "Enter a price" }).positive("Must be more than 0").max(10_000_000),
  priceUnit: z.string().trim().min(1).max(40).default("per event"),
  capacity: z.string().optional(),
  location: z.string().trim().max(160).optional(),
  imageUrl: z.string().trim().optional(),
  isActive: z.string().optional(),
  isFeatured: z.string().optional(),
});

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

async function saveUpload(file: File | null): Promise<string | null> {
  if (!file || file.size === 0) return null;
  const ext = ALLOWED_IMAGE_TYPES[file.type];
  if (!ext) throw new Error("Only JPG, PNG or WEBP images are allowed");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be under 5 MB");

  const dir = uploadDir();
  await mkdir(dir, { recursive: true });
  const name = `${Date.now()}-${randomBytes(4).toString("hex")}${ext}`;
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

export async function saveService(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = parseForm(serviceSchema, formData);
  if (parsed.state) return parsed.state;
  const d = parsed.data;
  const id = d.id ? Number(d.id) : undefined;

  let uploaded: string | null = null;
  try {
    uploaded = await saveUpload(formData.get("image") as File | null);
  } catch (e) {
    return { ok: false, errors: { image: (e as Error).message } };
  }
  const imageUrl = uploaded ?? d.imageUrl;
  if (!imageUrl) return { ok: false, errors: { image: "Upload a cover image" } };

  const data = {
    name: d.name,
    category: d.category,
    tagline: d.tagline,
    description: d.description,
    features: (d.features ?? "").split("\n").map((s) => s.trim()).filter(Boolean),
    price: d.price,
    priceUnit: d.priceUnit,
    capacity: d.capacity ? Number(d.capacity) || null : null,
    location: d.location || null,
    imageUrl,
    isActive: d.isActive === "on",
    isFeatured: d.isFeatured === "on",
  };

  if (id) {
    await db.service.update({ where: { id }, data });
  } else {
    let slug = slugify(d.name) || "service";
    if (await db.service.findUnique({ where: { slug } })) slug = `${slug}-${randomBytes(2).toString("hex")}`;
    await db.service.create({ data: { ...data, slug, gallery: [] } });
  }

  revalidatePath("/", "layout");
  redirect("/admin/services?saved=1");
}

export async function toggleService(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const svc = await db.service.findUnique({ where: { id } });
  if (svc) await db.service.update({ where: { id }, data: { isActive: !svc.isActive } });
  revalidatePath("/", "layout");
}

export async function deleteService(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const used = await db.bookingItem.count({ where: { serviceId: id } });
  if (used > 0) {
    // keep booking history intact — hide instead of deleting
    await db.service.update({ where: { id }, data: { isActive: false } });
    redirect("/admin/services?archived=1");
  }
  await db.service.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/admin/services?deleted=1");
}

/* ───────────── Bookings ───────────── */

const STATUSES: BookingStatus[] = ["PENDING_PAYMENT", "PAID", "CONFIRMED", "COMPLETED", "CANCELLED"];

export async function updateBookingStatus(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const status = String(formData.get("status")) as BookingStatus;
  if (!STATUSES.includes(status)) return;
  await db.booking.update({ where: { id }, data: { status } });
  revalidatePath("/admin", "layout");
}

/* ───────────── Calendar ───────────── */

export async function blockDate(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const date = parseISODate(formData.get("date"));
  if (!date) return { ok: false, errors: { date: "Pick a date" } };
  const serviceId = Number(formData.get("serviceId")) || null;
  const reason = String(formData.get("reason") ?? "").trim().slice(0, 160) || null;
  await db.blockedDate.create({ data: { date, serviceId, reason } });
  revalidatePath("/", "layout");
  return { ok: true, message: "Date blocked." };
}

export async function unblockDate(formData: FormData) {
  await requireAdmin();
  await db.blockedDate.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePath("/", "layout");
}

/* ───────────── Messages ───────────── */

export async function toggleMessageRead(formData: FormData) {
  await requireAdmin();
  const id = Number(formData.get("id"));
  const msg = await db.message.findUnique({ where: { id } });
  if (msg) await db.message.update({ where: { id }, data: { isRead: !msg.isRead } });
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(formData: FormData) {
  await requireAdmin();
  await db.message.delete({ where: { id: Number(formData.get("id")) } });
  revalidatePath("/admin", "layout");
}
