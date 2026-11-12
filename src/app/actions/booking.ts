"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSession, requireUser } from "@/lib/auth";
import { isAvailable } from "@/lib/availability";
import { DEPOSIT_RATE, PAYMENT_METHODS } from "@/lib/catalog";
import { db } from "@/lib/db";
import { parseForm, type FormState } from "@/lib/form";
import { eventDate, parseISODate, toNumber } from "@/lib/format";

/* ───────────── Cart ───────────── */

export async function addToCart(_: FormState, formData: FormData): Promise<FormState> {
  const serviceId = Number(formData.get("serviceId"));
  const slug = String(formData.get("slug") ?? "");
  const session = await getSession();
  if (!session) redirect(`/login?next=${encodeURIComponent(`/services/${slug}`)}`);

  const date = parseISODate(formData.get("eventDate"));
  if (!date) return { ok: false, message: "Pick your event date first." };

  const service = await db.service.findFirst({ where: { id: serviceId, isActive: true } });
  if (!service) return { ok: false, message: "This service is no longer available." };

  if (!(await isAvailable(service.id, date))) {
    return { ok: false, message: `Sorry, ${service.name} is already taken on ${eventDate(date)}. Please choose another date.` };
  }

  await db.cartItem.upsert({
    where: { userId_serviceId_eventDate: { userId: session.uid, serviceId: service.id, eventDate: date } },
    update: {},
    create: { userId: session.uid, serviceId: service.id, eventDate: date },
  });
  revalidatePath("/", "layout");
  return { ok: true, message: `${service.name} added for ${eventDate(date)}.` };
}

export async function removeFromCart(formData: FormData) {
  const session = await requireUser("/cart");
  await db.cartItem.deleteMany({ where: { id: Number(formData.get("id")), userId: session.uid } });
  revalidatePath("/", "layout");
}

/* ───────────── Checkout ───────────── */

const checkoutSchema = z.object({
  contactName: z.string().trim().min(2, "Required").max(120),
  contactEmail: z.string().trim().toLowerCase().email("Enter a valid email"),
  contactPhone: z.string().trim().regex(/^[0-9+\-\s()]{8,20}$/, "Enter a valid phone number"),
  address: z.string().trim().min(5, "Required").max(255),
  city: z.string().trim().min(2, "Required").max(80),
  state: z.string().trim().min(2, "Required").max(80),
  notes: z.string().trim().max(1000).optional(),
});

function bookingCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `PP-${s}`;
}

export async function checkout(_: FormState, formData: FormData): Promise<FormState> {
  const session = await requireUser("/checkout");
  const parsed = parseForm(checkoutSchema, formData);
  if (parsed.state) return parsed.state;

  const items = await db.cartItem.findMany({ where: { userId: session.uid }, include: { service: true } });
  if (items.length === 0) return { ok: false, message: "Your wishlist is empty." };

  // Re-check every date right before committing.
  for (const item of items) {
    if (!item.service.isActive || !(await isAvailable(item.serviceId, item.eventDate))) {
      return {
        ok: false,
        message: `${item.service.name} is no longer available on ${eventDate(item.eventDate)}. Please remove it from your wishlist and choose another date.`,
      };
    }
  }

  const subtotal = items.reduce((sum, i) => sum + toNumber(i.service.price), 0);
  const deposit = Math.round(subtotal * DEPOSIT_RATE);

  let code = bookingCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await db.$transaction([
        db.booking.create({
          data: {
            code,
            userId: session.uid,
            ...parsed.data,
            notes: parsed.data.notes || null,
            subtotal,
            deposit,
            total: subtotal,
            items: {
              create: items.map((i) => ({
                serviceId: i.serviceId,
                name: i.service.name,
                category: i.service.category,
                eventDate: i.eventDate,
                price: i.service.price,
              })),
            },
          },
        }),
        db.cartItem.deleteMany({ where: { userId: session.uid } }),
      ]);
      break;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002" && attempt < 4) {
        code = bookingCode();
        continue;
      }
      throw e;
    }
  }

  revalidatePath("/", "layout");
  redirect(`/bookings/${code}/pay`);
}

/* ───────────── Payment (simulated gateway) ───────────── */

export async function payDeposit(formData: FormData) {
  const session = await requireUser();
  const code = String(formData.get("code"));
  const method = String(formData.get("method"));
  if (!PAYMENT_METHODS.includes(method as (typeof PAYMENT_METHODS)[number])) redirect(`/bookings/${code}/pay?error=method`);

  const booking = await db.booking.findFirst({ where: { code, userId: session.uid } });
  if (!booking) redirect("/account");
  if (booking.status !== "PENDING_PAYMENT") redirect(`/bookings/${code}`);

  await db.booking.update({
    where: { id: booking.id },
    data: {
      status: "PAID",
      paymentMethod: method,
      paymentRef: `TXN${Date.now().toString(36).toUpperCase()}`,
      paidAt: new Date(),
    },
  });
  revalidatePath("/account");
  redirect(`/bookings/${code}?paid=1`);
}

export async function cancelBooking(formData: FormData) {
  const session = await requireUser();
  const code = String(formData.get("code"));
  await db.booking.updateMany({
    where: { code, userId: session.uid, status: "PENDING_PAYMENT" },
    data: { status: "CANCELLED" },
  });
  revalidatePath("/account");
  redirect("/account");
}
