import "server-only";
import { db } from "./db";
import { toISODate, todayUTC } from "./format";

/** Minimum lead time (days) between booking and the event. */
export const MIN_LEAD_DAYS = 14;

export function earliestBookableDate() {
  const d = todayUTC();
  d.setUTCDate(d.getUTCDate() + MIN_LEAD_DAYS);
  return d;
}

/**
 * ISO dates (YYYY-MM-DD) a service can't be booked on in the next ~18 months:
 * dates held by an active booking plus admin-blocked dates (service-specific or global).
 */
export async function unavailableDates(serviceId: number): Promise<string[]> {
  const from = todayUTC();
  const to = new Date(from);
  to.setUTCMonth(to.getUTCMonth() + 18);

  const [booked, blocked] = await Promise.all([
    db.bookingItem.findMany({
      where: {
        serviceId,
        eventDate: { gte: from, lte: to },
        booking: { status: { not: "CANCELLED" } },
      },
      select: { eventDate: true },
    }),
    db.blockedDate.findMany({
      where: { date: { gte: from, lte: to }, OR: [{ serviceId }, { serviceId: null }] },
      select: { date: true },
    }),
  ]);

  return [...new Set([...booked.map((b) => toISODate(b.eventDate)), ...blocked.map((b) => toISODate(b.date))])].sort();
}

export async function isAvailable(serviceId: number, date: Date) {
  if (date < earliestBookableDate()) return false;
  const [booked, blocked] = await Promise.all([
    db.bookingItem.count({
      where: { serviceId, eventDate: date, booking: { status: { not: "CANCELLED" } } },
    }),
    db.blockedDate.count({ where: { date, OR: [{ serviceId }, { serviceId: null }] } }),
  ]);
  return booked === 0 && blocked === 0;
}
