import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { Logo } from "@/components/brand";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminNav } from "./admin-nav";

export const metadata: Metadata = { title: { default: "Admin", template: "%s · Admin · Petal & Pelamin" } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  const [unread, pending] = await Promise.all([
    db.message.count({ where: { isRead: false } }),
    db.booking.count({ where: { status: "PAID" } }),
  ]);

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="no-print border-b border-line bg-white/70 backdrop-blur lg:sticky lg:top-0 lg:h-dvh lg:border-r lg:border-b-0">
        <div className="flex h-full flex-col gap-6 p-5">
          <div className="flex items-center justify-between">
            <Logo href="/admin" />
          </div>
          <AdminNav badges={{ "/admin/messages": unread, "/admin/bookings": pending }} />
          <div className="mt-auto hidden rounded-2xl bg-blush-50 p-4 text-sm lg:block">
            <p className="font-semibold">{session.name}</p>
            <p className="text-xs text-muted">Administrator</p>
            <div className="mt-3 flex gap-3 text-xs">
              <Link href="/" className="text-blush-700 hover:underline">
                View site
              </Link>
              <form action={logout}>
                <button className="cursor-pointer text-muted hover:text-red-600">Sign out</button>
              </form>
            </div>
          </div>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-8 sm:px-8 lg:px-10">{children}</main>
    </div>
  );
}
