import type { Metadata } from "next";
import { db } from "@/lib/db";
import { dateTime, money, toNumber } from "@/lib/format";

export const metadata: Metadata = { title: "Customers" };

export default async function AdminCustomers() {
  const customers = await db.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: { bookings: { where: { status: { not: "CANCELLED" } }, select: { total: true } } },
    take: 500,
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">People</p>
        <h1 className="mt-1 text-4xl font-semibold">Customers</h1>
      </header>
      <div className="card overflow-x-auto">
        <table className="table-pp min-w-[720px]">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Joined</th>
              <th>Bookings</th>
              <th className="text-right">Lifetime value</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td className="font-medium">
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 place-items-center rounded-full bg-blush-100 font-semibold text-blush-700">{c.name.charAt(0)}</span>
                    {c.name}
                  </div>
                </td>
                <td>
                  <p>{c.email}</p>
                  <p className="text-xs text-muted">{c.phone ?? "—"}</p>
                </td>
                <td className="text-muted">{dateTime(c.createdAt)}</td>
                <td>{c.bookings.length}</td>
                <td className="text-right font-semibold">{money(c.bookings.reduce((s, b) => s + toNumber(b.total), 0))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
