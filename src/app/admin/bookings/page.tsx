import type { BookingStatus } from "@prisma/client";
import type { Metadata } from "next";
import Link from "next/link";
import { updateBookingStatus } from "@/app/actions/admin";
import { StatusBadge } from "@/components/status-badge";
import { STATUS_META } from "@/lib/catalog";
import { db } from "@/lib/db";
import { dateTime, eventDate, money } from "@/lib/format";

export const metadata: Metadata = { title: "Bookings" };

const STATUSES = Object.keys(STATUS_META) as BookingStatus[];

export default async function AdminBookings({ searchParams }: { searchParams: Promise<{ status?: string; q?: string }> }) {
  const { status, q } = await searchParams;
  const filter = STATUSES.includes(status as BookingStatus) ? (status as BookingStatus) : undefined;
  const query = q?.trim();

  const bookings = await db.booking.findMany({
    where: {
      ...(filter ? { status: filter } : {}),
      ...(query ? { OR: [{ code: { contains: query } }, { contactName: { contains: query } }, { contactEmail: { contains: query } }] } : {}),
    },
    include: { items: { orderBy: { eventDate: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Manage</p>
          <h1 className="mt-1 text-4xl font-semibold">Bookings</h1>
        </div>
        <form className="flex gap-2">
          {filter && <input type="hidden" name="status" value={filter} />}
          <input name="q" defaultValue={query} placeholder="Code, name or email" className="input w-64 rounded-full py-2.5" />
          <button className="btn-soft btn-sm">Search</button>
        </form>
      </header>

      <nav className="flex flex-wrap gap-2">
        <Link href="/admin/bookings" className={`chip ${!filter ? "chip-active" : ""}`}>
          All
        </Link>
        {STATUSES.map((s) => (
          <Link key={s} href={`/admin/bookings?status=${s}`} className={`chip ${filter === s ? "chip-active" : ""}`}>
            {STATUS_META[s].label}
          </Link>
        ))}
      </nav>

      <div className="card overflow-x-auto">
        <table className="table-pp min-w-[900px]">
          <thead>
            <tr>
              <th>Booking</th>
              <th>Customer</th>
              <th>Services & dates</th>
              <th>Total / deposit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-muted">
                  No bookings found.
                </td>
              </tr>
            )}
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>
                  <Link href={`/bookings/${b.code}`} className="font-semibold text-blush-700 hover:underline">
                    {b.code}
                  </Link>
                  <p className="text-xs text-muted">{dateTime(b.createdAt)}</p>
                </td>
                <td>
                  <p className="font-medium">{b.contactName}</p>
                  <p className="text-xs text-muted">{b.contactPhone}</p>
                  <p className="text-xs text-muted">{b.contactEmail}</p>
                </td>
                <td>
                  <ul className="space-y-0.5 text-xs">
                    {b.items.map((i) => (
                      <li key={i.id}>
                        <span className="font-medium">{i.name}</span> <span className="text-muted">· {eventDate(i.eventDate, "short")}</span>
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <p className="font-semibold">{money(b.total)}</p>
                  <p className="text-xs text-muted">
                    {money(b.deposit)} {b.paidAt ? "paid" : "due"}
                  </p>
                </td>
                <td>
                  <div className="space-y-2">
                    <StatusBadge status={b.status} />
                    <form action={updateBookingStatus} className="flex gap-1.5">
                      <input type="hidden" name="id" value={b.id} />
                      <select name="status" defaultValue={b.status} className="rounded-full border border-blush-200 bg-white px-2 py-1 text-xs" aria-label="Change status">
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_META[s].label}
                          </option>
                        ))}
                      </select>
                      <button className="cursor-pointer rounded-full bg-blush-100 px-3 text-xs font-semibold text-blush-800 hover:bg-blush-200">Save</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
