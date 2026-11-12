import type { Metadata } from "next";
import Link from "next/link";
import { unblockDate } from "@/app/actions/admin";
import { db } from "@/lib/db";
import { eventDate, todayUTC } from "@/lib/format";
import { BlockDateForm } from "./block-date-form";

export const metadata: Metadata = { title: "Calendar" };

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default async function AdminCalendar({ searchParams }: { searchParams: Promise<{ m?: string }> }) {
  const { m } = await searchParams;
  const today = todayUTC();
  const [yy, mm] = m && /^\d{4}-\d{2}$/.test(m) ? m.split("-").map(Number) : [today.getUTCFullYear(), today.getUTCMonth() + 1];
  const start = new Date(Date.UTC(yy, mm - 1, 1));
  const end = new Date(Date.UTC(yy, mm, 0));
  const prev = new Date(Date.UTC(yy, mm - 2, 1)).toISOString().slice(0, 7);
  const next = new Date(Date.UTC(yy, mm, 1)).toISOString().slice(0, 7);

  const [items, blocked, services, upcomingBlocks] = await Promise.all([
    db.bookingItem.findMany({
      where: { eventDate: { gte: start, lte: end }, booking: { status: { not: "CANCELLED" } } },
      include: { booking: { select: { code: true, status: true } } },
    }),
    db.blockedDate.findMany({ where: { date: { gte: start, lte: end } }, include: { service: { select: { name: true } } } }),
    db.service.findMany({ where: { isActive: true }, select: { id: true, name: true, category: true }, orderBy: { name: "asc" } }),
    db.blockedDate.findMany({
      where: { date: { gte: today } },
      include: { service: { select: { name: true } } },
      orderBy: { date: "asc" },
      take: 30,
    }),
  ]);

  const offset = (start.getUTCDay() + 6) % 7;
  const cells: (number | null)[] = [...Array(offset).fill(null), ...Array.from({ length: end.getUTCDate() }, (_, i) => i + 1)];
  const label = start.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Availability</p>
        <h1 className="mt-1 text-4xl font-semibold">Calendar</h1>
      </header>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <section className="card p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <Link href={`/admin/calendar?m=${prev}`} className="btn-ghost btn-sm">
              ‹ Prev
            </Link>
            <h2 className="text-3xl font-semibold">{label}</h2>
            <Link href={`/admin/calendar?m=${next}`} className="btn-ghost btn-sm">
              Next ›
            </Link>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold text-muted">
            {WEEKDAYS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="mt-1.5 grid grid-cols-7 gap-1.5">
            {cells.map((d, i) => {
              if (!d) return <span key={`e${i}`} />;
              const dayItems = items.filter((x) => x.eventDate.getUTCDate() === d);
              const dayBlocks = blocked.filter((x) => x.date.getUTCDate() === d);
              const isToday = +new Date(Date.UTC(yy, mm - 1, d)) === +today;
              return (
                <div
                  key={d}
                  className={`min-h-24 rounded-xl border p-1.5 text-left text-[11px] ${
                    isToday ? "border-blush-400 bg-blush-50" : "border-line bg-white"
                  }`}
                >
                  <p className={`mb-1 font-semibold ${isToday ? "text-blush-700" : "text-ink/70"}`}>{d}</p>
                  <div className="space-y-1">
                    {dayItems.slice(0, 3).map((x) => (
                      <Link
                        key={x.id}
                        href={`/bookings/${x.booking.code}`}
                        className={`block truncate rounded-md px-1.5 py-0.5 ${
                          x.booking.status === "PENDING_PAYMENT" ? "bg-peach-100 text-peach-800" : "bg-blush-100 text-blush-800"
                        }`}
                        title={`${x.name} · ${x.booking.code}`}
                      >
                        {x.name}
                      </Link>
                    ))}
                    {dayItems.length > 3 && <p className="text-muted">+{dayItems.length - 3} more</p>}
                    {dayBlocks.map((b) => (
                      <p key={b.id} className="truncate rounded-md bg-stone-100 px-1.5 py-0.5 text-stone-600" title={b.reason ?? ""}>
                        ⛔ {b.service?.name ?? "All services"}
                      </p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded bg-blush-100" /> Booked
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded bg-peach-100" /> Awaiting payment
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded bg-stone-100" /> Blocked
            </span>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="card p-6">
            <h2 className="text-2xl font-semibold">Block a date</h2>
            <p className="mt-1 text-xs text-muted">For maintenance, private events or public holidays.</p>
            <BlockDateForm services={services} />
          </div>
          <div className="card p-6">
            <h2 className="text-2xl font-semibold">Upcoming blocks</h2>
            {upcomingBlocks.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No dates blocked.</p>
            ) : (
              <ul className="mt-3 divide-y divide-line text-sm">
                {upcomingBlocks.map((b) => (
                  <li key={b.id} className="flex items-center justify-between gap-3 py-2.5">
                    <div className="min-w-0">
                      <p className="font-medium">{eventDate(b.date, "short")}</p>
                      <p className="truncate text-xs text-muted">
                        {b.service?.name ?? "All services"}
                        {b.reason && ` · ${b.reason}`}
                      </p>
                    </div>
                    <form action={unblockDate}>
                      <input type="hidden" name="id" value={b.id} />
                      <button className="cursor-pointer text-xs text-muted hover:text-red-600">Remove</button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
