import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cancelBooking, payDeposit } from "@/app/actions/booking";
import { SubmitButton } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { PAYMENT_METHODS } from "@/lib/catalog";
import { db } from "@/lib/db";
import { eventDate, money, toNumber } from "@/lib/format";

export const metadata: Metadata = { title: "Payment" };

const ICONS: Record<string, string> = {
  "FPX Online Banking": "🏦",
  "Credit / Debit Card": "💳",
  "Touch 'n Go eWallet": "📱",
  "DuitNow QR": "🔳",
};

export default async function PayPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { code } = await params;
  const { error } = await searchParams;
  const session = await requireUser(`/bookings/${code}/pay`);
  const booking = await db.booking.findFirst({ where: { code, userId: session.uid }, include: { items: true } });
  if (!booking) notFound();
  if (booking.status !== "PENDING_PAYMENT") redirect(`/bookings/${code}`);

  return (
    <div className="container-pp max-w-3xl py-14">
      <p className="eyebrow">Step 3 of 3</p>
      <h1 className="mt-2 text-5xl font-semibold">Secure your date</h1>
      <p className="mt-2 text-muted">
        Booking <span className="font-semibold text-ink">{booking.code}</span> · {booking.items.length} item(s) · first event on{" "}
        {eventDate(booking.items.reduce((a, b) => (a.eventDate < b.eventDate ? a : b)).eventDate)}
      </p>

      <div className="card mt-8 overflow-hidden">
        <div className="bg-linear-to-r from-blush-100 to-lilac-100 px-6 py-6 sm:px-8">
          <p className="text-sm text-muted">Deposit due today</p>
          <p className="font-display text-5xl font-semibold text-blush-700">{money(booking.deposit)}</p>
          <p className="text-xs text-muted">
            of {money(booking.total)} total · balance {money(toNumber(booking.total) - toNumber(booking.deposit))} due 30 days before your event
          </p>
        </div>

        <form action={payDeposit} className="space-y-4 p-6 sm:p-8">
          <input type="hidden" name="code" value={booking.code} />
          {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">Please choose a payment method.</p>}
          <fieldset>
            <legend className="label mb-3">Payment method</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {PAYMENT_METHODS.map((m, i) => (
                <label
                  key={m}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl border border-blush-200 bg-white p-4 transition has-checked:border-blush-500 has-checked:bg-blush-50 has-checked:ring-4 has-checked:ring-blush-100"
                >
                  <input type="radio" name="method" value={m} defaultChecked={i === 0} className="accent-blush-500" />
                  <span className="text-xl" aria-hidden>
                    {ICONS[m]}
                  </span>
                  <span className="text-sm font-medium">{m}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <p className="rounded-2xl bg-peach-100 px-4 py-3 text-xs text-peach-800">
            Demo mode: this is a simulated gateway and no money is charged. Connect a real provider (e.g. Billplz, ToyyibPay or Stripe) in{" "}
            <code>src/app/actions/booking.ts → payDeposit</code>.
          </p>
          <SubmitButton pendingText="Processing payment…" className="btn-primary w-full py-4 text-base">
            Pay {money(booking.deposit)} deposit
          </SubmitButton>
        </form>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm">
        <Link href="/account" className="text-muted hover:text-blush-700">
          ← Pay later
        </Link>
        <form action={cancelBooking}>
          <input type="hidden" name="code" value={booking.code} />
          <button className="cursor-pointer text-muted hover:text-red-600">Cancel this booking</button>
        </form>
      </div>
    </div>
  );
}
