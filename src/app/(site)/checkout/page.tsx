import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { DEPOSIT_RATE } from "@/lib/catalog";
import { db } from "@/lib/db";
import { eventDate, money, toNumber } from "@/lib/format";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const session = await requireUser("/checkout");
  const [user, items] = await Promise.all([
    db.user.findUnique({ where: { id: session.uid } }),
    db.cartItem.findMany({ where: { userId: session.uid }, include: { service: true }, orderBy: { eventDate: "asc" } }),
  ]);
  if (items.length === 0) redirect("/cart");
  const subtotal = items.reduce((s, i) => s + toNumber(i.service.price), 0);

  return (
    <div className="container-pp py-14">
      <p className="eyebrow">Step 2 of 3</p>
      <h1 className="mt-2 text-5xl font-semibold">Your details</h1>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="card p-6 sm:p-8">
          <CheckoutForm defaults={{ contactName: user?.name ?? "", contactEmail: user?.email ?? "", contactPhone: user?.phone ?? "" }} />
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h2 className="text-3xl font-semibold">Your booking</h2>
            <ul className="mt-5 divide-y divide-line text-sm">
              {items.map((i) => (
                <li key={i.id} className="flex justify-between gap-4 py-3">
                  <div>
                    <p className="font-medium">{i.service.name}</p>
                    <p className="text-xs text-muted">{eventDate(i.eventDate)}</p>
                  </div>
                  <p className="font-medium whitespace-nowrap">{money(i.service.price)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex justify-between border-t border-line pt-4">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-blush-700">{money(subtotal)}</span>
            </div>
            <div className="mt-3 flex justify-between rounded-2xl bg-mint-100 px-4 py-3 text-sm text-mint-800">
              <span>Deposit due now</span>
              <span className="font-bold">{money(Math.round(subtotal * DEPOSIT_RATE))}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
