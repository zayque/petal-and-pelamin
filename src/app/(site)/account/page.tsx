import type { Metadata } from "next";
import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { eventDate, money, todayUTC } from "@/lib/format";

export const metadata: Metadata = { title: "My bookings" };

export default async function AccountPage() {
  const session = await requireUser("/account");
  const bookings = await db.booking.findMany({
    where: { userId: session.uid },
    include: { items: { orderBy: { eventDate: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  const upcoming = bookings
    .filter((b) => b.status !== "CANCELLED")
    .flatMap((b) => b.items)
    .filter((i) => i.eventDate >= todayUTC())
    .sort((a, b) => +a.eventDate - +b.eventDate)[0];
  const daysTo = upcoming ? Math.ceil((+upcoming.eventDate - +todayUTC()) / 86_400_000) : null;

  return (
    <div className="container-pp py-14">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">My account</p>
          <h1 className="mt-2 text-5xl font-semibold">Hello, {session.name.split(" ")[0]} ✿</h1>
        </div>
        <Link href="/services" className="btn-primary">
          Book another service
        </Link>
      </div>

      {upcoming && daysTo !== null && (
        <div className="mt-8 grid items-center gap-6 rounded-[2rem] bg-linear-to-r from-blush-200 via-blush-100 to-lilac-100 p-8 sm:grid-cols-[auto_1fr]">
          <div className="text-center">
            <p className="font-display text-7xl leading-none font-semibold text-blush-700">{daysTo}</p>
            <p className="text-xs font-semibold tracking-widest text-blush-800 uppercase">days to go</p>
          </div>
          <div>
            <p className="font-script text-4xl text-blush-600">Counting down…</p>
            <p className="text-ink/80">
              {upcoming.name} on <strong>{eventDate(upcoming.eventDate)}</strong>
            </p>
          </div>
        </div>
      )}

      <h2 className="mt-12 text-3xl font-semibold">Bookings</h2>
      {bookings.length === 0 ? (
        <div className="card mt-6 p-12 text-center">
          <p className="text-muted">You haven’t made a booking yet.</p>
          <Link href="/services" className="btn-soft mt-4">
            Start exploring
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {bookings.map((b) => (
            <Link key={b.id} href={`/bookings/${b.code}`} className="card flex flex-wrap items-center justify-between gap-4 p-5 transition hover:shadow-soft sm:p-6">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-display text-2xl font-semibold text-blush-900">{b.code}</p>
                  <StatusBadge status={b.status} />
                </div>
                <p className="mt-1 text-sm text-muted">
                  {b.items.map((i) => i.name).join(" · ")}
                </p>
                <p className="text-xs text-muted">From {eventDate(b.items[0].eventDate)}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blush-700">{money(b.total)}</p>
                {b.status === "PENDING_PAYMENT" ? (
                  <span className="text-xs font-semibold text-peach-800">Deposit {money(b.deposit)} due →</span>
                ) : (
                  <span className="text-xs text-muted">View invoice →</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
