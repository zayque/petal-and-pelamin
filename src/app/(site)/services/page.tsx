import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { SectionHeading } from "@/components/brand";
import { ServiceCard } from "@/components/service-card";
import { CATEGORIES, categoryBySlug } from "@/lib/catalog";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Services" };
export const dynamic = "force-dynamic";

const SORTS = {
  popular: { label: "Popular", orderBy: [{ isFeatured: "desc" }, { createdAt: "asc" }] },
  "price-asc": { label: "Price ↑", orderBy: [{ price: "asc" }] },
  "price-desc": { label: "Price ↓", orderBy: [{ price: "desc" }] },
} satisfies Record<string, { label: string; orderBy: Prisma.ServiceOrderByWithRelationInput[] }>;

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string; q?: string; sort?: string }>;
}) {
  const { c, q, sort } = await searchParams;
  const category = categoryBySlug(c);
  const sortKey = (sort && sort in SORTS ? sort : "popular") as keyof typeof SORTS;
  const query = q?.trim().slice(0, 80);

  const services = await db.service.findMany({
    where: {
      isActive: true,
      ...(category ? { category: category.key } : {}),
      ...(query ? { OR: [{ name: { contains: query } }, { tagline: { contains: query } }, { location: { contains: query } }] } : {}),
    },
    orderBy: SORTS[sortKey].orderBy,
  });

  const href = (params: { c?: string; sort?: string }) => {
    const sp = new URLSearchParams();
    const nc = "c" in params ? params.c : c;
    const ns = params.sort ?? sort;
    if (nc) sp.set("c", nc);
    if (query) sp.set("q", query);
    if (ns && ns !== "popular") sp.set("sort", ns);
    const s = sp.toString();
    return s ? `/services?${s}` : "/services";
  };

  return (
    <div className="container-pp py-14">
      <SectionHeading
        eyebrow={category ? "Services" : "All services"}
        title={category?.label ?? "Find your perfect pieces"}
        intro={category?.blurb ?? "Venues, pelamin, attire and photobooths. Every listing has live availability."}
      />

      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:px-0" aria-label="Categories">
          <Link href={href({ c: undefined })} className={`chip shrink-0 ${!category ? "chip-active" : ""}`}>
            All
          </Link>
          {CATEGORIES.map((cat) => (
            <Link key={cat.key} href={href({ c: cat.slug })} className={`chip shrink-0 ${category?.key === cat.key ? "chip-active" : ""}`}>
              {cat.short}
            </Link>
          ))}
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          <form action="/services" className="relative">
            {c && <input type="hidden" name="c" value={c} />}
            <input
              name="q"
              defaultValue={query}
              placeholder="Search name or location…"
              className="input w-64 rounded-full py-2.5 pl-10"
              aria-label="Search services"
            />
            <svg viewBox="0 0 24 24" className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
          </form>
          <div className="flex rounded-full bg-white p-1 ring-1 ring-blush-200">
            {Object.entries(SORTS).map(([k, v]) => (
              <Link
                key={k}
                href={href({ sort: k })}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${sortKey === k ? "bg-blush-500 text-white" : "text-blush-800 hover:bg-blush-50"}`}
              >
                {v.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {services.length === 0 ? (
        <div className="card mt-12 p-16 text-center">
          <p className="font-display text-3xl text-blush-800">Nothing matches just yet</p>
          <p className="mt-2 text-muted">Try another search or browse all services.</p>
          <Link href="/services" className="btn-soft mt-6">
            Clear filters
          </Link>
        </div>
      ) : (
        <>
          <p className="mt-8 text-sm text-muted">
            {services.length} {services.length === 1 ? "result" : "results"}
            {query && <> for “{query}”</>}
          </p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <ServiceCard key={s.id} service={s} priority={i < 3} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
