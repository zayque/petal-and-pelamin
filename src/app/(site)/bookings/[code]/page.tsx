import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Invoice } from "@/components/invoice";
import { PrintButton } from "@/components/print-button";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Booking" };

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ paid?: string }>;
}) {
  const { code } = await params;
  const { paid } = await searchParams;
  const session = await requireUser(`/bookings/${code}`);
  const booking = await db.booking.findFirst({
    where: { code, ...(session.role === "ADMIN" ? {} : { userId: session.uid }) },
    include: { items: { orderBy: { eventDate: "asc" } } },
  });
  if (!booking) notFound();

  return (
    <div className="container-pp max-w-4xl py-14">
      {paid && (
        <div className="no-print mb-8 rounded-3xl bg-linear-to-r from-mint-100 to-blush-100 p-8 text-center">
          <p className="font-script text-5xl text-blush-600">Your date is secured!</p>
          <p className="mt-2 text-muted">We’ve received your deposit. Your planner will WhatsApp you within one working day.</p>
        </div>
      )}
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href={session.role === "ADMIN" ? "/admin/bookings" : "/account"} className="text-sm text-muted hover:text-blush-700">
          ← Back to bookings
        </Link>
        <div className="flex gap-2">
          {booking.status === "PENDING_PAYMENT" && booking.userId === session.uid && (
            <Link href={`/bookings/${booking.code}/pay`} className="btn-primary btn-sm">
              Pay deposit
            </Link>
          )}
          <PrintButton />
        </div>
      </div>
      <Invoice booking={booking} />
    </div>
  );
}
