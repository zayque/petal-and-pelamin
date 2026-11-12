import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { CATEGORIES } from "@/lib/catalog";
import { db } from "@/lib/db";
import { dateTime, eventDate, money, toNumber, todayUTC } from "@/lib/format";

export default async function AdminOverview() {
  const today = todayUTC();
  const in60 = new Date(today);
  in60.setUTCDate(in60.getUTCDate() + 60);

  const [revenueAgg, bookingCount, customerCount, unread, recent, upcoming, byCategory] = await Promise.all([
    db.booking.aggregate({ _sum: { deposit: true }, where: { paidAt: { not: null }, status: { not: "CANCELLED" } } }),
    db.booking.count({ where: { status: { not: "CANCELLED" } } }),
    db.user.count({ where: { role: "CUSTOMER" } }),
    db.message.count({ where: { isRead: false } }),
    db.booking.findMany({ orderBy: { createdAt: "desc" }, take: 6, include: { items: true } }),
    db.bookingItem.findMany({
      where: { eventDate: { gte: today, lte: in60 }, booking: { status: { in: ["PAID", "CONFIRMED"] } } },
      orderBy: { eventDate: "asc" },
      take: 8,
      include: { booking: { select: { code: true, contactName: true } } },
    }),
    db.bookingItem.groupBy({
      by: ["category"],
      where: { booking: { status: { not: "CANCELLED" } } },
      _sum: { price: true },
      _count: true,
    }),
  ]);

  const maxCat = Math.max(1, ...byCategory.map((c) => toNumber(c._sum.price ?? 0)));

  const stats = [
    { label: "Deposits collected", value: money(revenueAgg._sum.deposit ?? 0), tone: "from-blush-100 to-blush-50" },
    { label: "Active bookings", value: bookingCount.toLocaleString(), tone: "from-lilac-100 to-white" },
    { label: "Customers", value: customerCount.toLocaleString(), tone: "from-mint-100 to-white" },
    { label: "Unread messages", value: unread.toLocaleString(), tone: "from-peach-100 to-white" },
  ];

  return (
    <div className="space-y-8">
      <header>
        <p className="eyebrow">Dashboard</p>
        <h1 className="mt-1 text-4xl font-semibold">Good day ✿</h1>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-3xl border border-line bg-linear-to-br ${s.tone} p-6`}>
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-2 font-display text-4xl font-semibold text-blush-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between p-6 pb-2">
            <h2 className="text-2xl font-semibold">Latest bookings</h2>
            <Link href="/admin/bookings" className="text-sm font-medium text-blush-700 hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="table-pp min-w-[560px]">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-muted">
                      No bookings yet.
                    </td>
                  </tr>
                )}
                {recent.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <Link href={`/bookings/${b.code}`} className="font-semibold text-blush-700 hover:underline">
                        {b.code}
                      </Link>
                      <p className="text-xs text-muted">{dateTime(b.createdAt)}</p>
                    </td>
                    <td>
                      {b.contactName}
                      <p className="text-xs text-muted">{b.items.length} item(s)</p>
                    </td>
                    <td className="font-medium">{money(b.total)}</td>
                    <td>
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-2xl font-semibold">Next 60 days</h2>
          {upcoming.length === 0 ? (
            <p className="mt-6 text-sm text-muted">No confirmed events coming up.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {upcoming.map((u) => (
                <li key={u.id} className="flex gap-4 rounded-2xl bg-blush-50/70 p-3">
                  <div className="grid w-14 shrink-0 place-items-center rounded-xl bg-white py-1 text-center ring-1 ring-blush-200">
                    <span className="text-[10px] font-semibold text-blush-600 uppercase">
                      {u.eventDate.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" })}
                    </span>
                    <span className="font-display text-2xl leading-none font-semibold">{u.eventDate.getUTCDate()}</span>
                  </div>
                  <div className="min-w-0 text-sm">
                    <p className="truncate font-semibold">{u.name}</p>
                    <p className="truncate text-xs text-muted">
                      {u.booking.contactName} · {u.booking.code}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="card p-6">
        <h2 className="text-2xl font-semibold">Booked value by category</h2>
        <div className="mt-6 space-y-4">
          {CATEGORIES.map((c) => {
            const row = byCategory.find((r) => r.category === c.key);
            const value = toNumber(row?._sum.price ?? 0);
            return (
              <div key={c.key} className="grid grid-cols-[120px_1fr_auto] items-center gap-4 text-sm">
                <span className="font-medium">{c.short}</span>
                <div className="h-3 overflow-hidden rounded-full bg-blush-50">
                  <div className="h-full rounded-full bg-linear-to-r from-blush-300 to-blush-500" style={{ width: `${(value / maxCat) * 100}%` }} />
                </div>
                <span className="w-28 text-right tabular-nums">
                  {money(value)} <span className="text-xs text-muted">({row?._count ?? 0})</span>
                </span>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-muted">Excludes cancelled bookings. Today is {eventDate(today)}.</p>
      </section>
    </div>
  );
}
