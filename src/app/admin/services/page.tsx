import type { Metadata } from "next";
import Link from "next/link";
import { deleteService, toggleService } from "@/app/actions/admin";
import { Img } from "@/components/ui";
import { CATEGORIES, categoryBySlug, categoryMeta } from "@/lib/catalog";
import { db } from "@/lib/db";
import { money } from "@/lib/format";

export const metadata: Metadata = { title: "Services" };

export default async function AdminServices({
  searchParams,
}: {
  searchParams: Promise<{ c?: string; saved?: string; deleted?: string; archived?: string }>;
}) {
  const sp = await searchParams;
  const cat = categoryBySlug(sp.c);
  const services = await db.service.findMany({
    where: cat ? { category: cat.key } : {},
    orderBy: [{ category: "asc" }, { name: "asc" }],
    include: { _count: { select: { bookingItems: true } } },
  });

  const notice = sp.saved
    ? "Service saved."
    : sp.deleted
      ? "Service deleted."
      : sp.archived
        ? "This service has bookings, so it was hidden instead of deleted."
        : null;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h1 className="mt-1 text-4xl font-semibold">Services</h1>
        </div>
        <Link href="/admin/services/new" className="btn-primary">
          + New service
        </Link>
      </header>

      {notice && <p className="rounded-2xl bg-mint-100 px-4 py-3 text-sm text-mint-800">{notice}</p>}

      <nav className="flex flex-wrap gap-2">
        <Link href="/admin/services" className={`chip ${!cat ? "chip-active" : ""}`}>
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link key={c.key} href={`/admin/services?c=${c.slug}`} className={`chip ${cat?.key === c.key ? "chip-active" : ""}`}>
            {c.short}
          </Link>
        ))}
      </nav>

      <div className="card overflow-x-auto">
        <table className="table-pp min-w-[820px]">
          <thead>
            <tr>
              <th>Service</th>
              <th>Category</th>
              <th>Price</th>
              <th>Bookings</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} className={s.isActive ? "" : "opacity-60"}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-blush-50">
                      <Img src={s.imageUrl} alt="" fill sizes="48px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {s.name} {s.isFeatured && <span title="Featured">⭐</span>}
                      </p>
                      <p className="truncate text-xs text-muted">{s.tagline}</p>
                    </div>
                  </div>
                </td>
                <td>{categoryMeta(s.category).short}</td>
                <td className="font-medium whitespace-nowrap">{money(s.price)}</td>
                <td>{s._count.bookingItems}</td>
                <td>
                  <form action={toggleService}>
                    <input type="hidden" name="id" value={s.id} />
                    <button
                      className={`cursor-pointer rounded-full px-3 py-1 text-xs font-semibold ${s.isActive ? "bg-mint-100 text-mint-800" : "bg-stone-100 text-stone-600"}`}
                      title="Click to toggle"
                    >
                      {s.isActive ? "Live" : "Hidden"}
                    </button>
                  </form>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <Link href={`/services/${s.slug}`} className="btn-ghost btn-sm" target="_blank">
                      View
                    </Link>
                    <Link href={`/admin/services/${s.id}`} className="btn-soft btn-sm">
                      Edit
                    </Link>
                    <form action={deleteService}>
                      <input type="hidden" name="id" value={s.id} />
                      <button className="btn-danger btn-sm">Delete</button>
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
