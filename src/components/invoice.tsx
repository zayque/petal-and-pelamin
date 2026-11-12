import type { Booking, BookingItem } from "@prisma/client";
import { categoryMeta } from "@/lib/catalog";
import { dateTime, eventDate, money, toNumber } from "@/lib/format";
import { PetalMark } from "./brand";
import { StatusBadge } from "./status-badge";

export function Invoice({ booking }: { booking: Booking & { items: BookingItem[] } }) {
  const balance = toNumber(booking.total) - (booking.paidAt ? toNumber(booking.deposit) : 0);
  return (
    <article className="card overflow-hidden print:border-0 print:shadow-none">
      <header className="flex flex-wrap items-start justify-between gap-6 bg-linear-to-r from-blush-100 via-blush-50 to-lilac-100 p-6 sm:p-10">
        <div className="flex items-center gap-3">
          <PetalMark className="size-12" />
          <div>
            <p className="font-display text-3xl font-semibold text-blush-900">Petal &amp; Pelamin</p>
            <p className="text-xs text-muted">Seksyen 13, Shah Alam, Selangor · hello@petalpelamin.my</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs tracking-widest text-muted uppercase">Invoice</p>
          <p className="font-display text-3xl font-semibold text-blush-800">{booking.code}</p>
          <p className="text-xs text-muted">Issued {dateTime(booking.createdAt)}</p>
          <div className="mt-2">
            <StatusBadge status={booking.status} />
          </div>
        </div>
      </header>

      <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-10">
        <div>
          <p className="text-xs font-semibold tracking-wider text-muted uppercase">Billed to</p>
          <p className="mt-2 font-semibold">{booking.contactName}</p>
          <p className="text-sm text-muted">{booking.contactEmail}</p>
          <p className="text-sm text-muted">{booking.contactPhone}</p>
          <p className="mt-1 text-sm text-muted">
            {booking.address}, {booking.city}, {booking.state}
          </p>
        </div>
        <div className="sm:text-right">
          <p className="text-xs font-semibold tracking-wider text-muted uppercase">Payment</p>
          {booking.paidAt ? (
            <>
              <p className="mt-2 font-semibold">{booking.paymentMethod}</p>
              <p className="text-sm text-muted">Ref {booking.paymentRef}</p>
              <p className="text-sm text-muted">Paid {dateTime(booking.paidAt)}</p>
            </>
          ) : (
            <p className="mt-2 text-sm text-muted">Not yet paid</p>
          )}
        </div>
      </div>

      <div className="overflow-x-auto px-2 sm:px-6">
        <table className="table-pp min-w-[520px]">
          <thead>
            <tr>
              <th>Service</th>
              <th>Event date</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {booking.items.map((i) => (
              <tr key={i.id}>
                <td>
                  <p className="font-medium">{i.name}</p>
                  <p className="text-xs text-muted">{categoryMeta(i.category).label}</p>
                </td>
                <td>{eventDate(i.eventDate)}</td>
                <td className="text-right font-medium">{money(i.price, true)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="ml-auto max-w-sm space-y-2 p-6 text-sm sm:p-10">
        <div className="flex justify-between">
          <dt className="text-muted">Subtotal</dt>
          <dd>{money(booking.subtotal, true)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Deposit {booking.paidAt ? "paid" : "due"}</dt>
          <dd>{booking.paidAt ? "−" : ""}{money(booking.deposit, true)}</dd>
        </div>
        <div className="flex justify-between border-t border-line pt-3 text-base">
          <dt className="font-semibold">Balance due</dt>
          <dd className="font-bold text-blush-700">{money(balance, true)}</dd>
        </div>
      </dl>

      {booking.notes && (
        <div className="mx-6 mb-8 rounded-2xl bg-blush-50 p-4 text-sm sm:mx-10">
          <p className="text-xs font-semibold tracking-wider text-muted uppercase">Notes</p>
          <p className="mt-1 whitespace-pre-line">{booking.notes}</p>
        </div>
      )}
      <p className="pb-8 text-center font-script text-3xl text-blush-400">Thank you &amp; selamat pengantin baru</p>
    </article>
  );
}
