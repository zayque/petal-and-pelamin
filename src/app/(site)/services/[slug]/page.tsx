import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingWidget } from "@/components/booking-widget";
import { ServiceCard } from "@/components/service-card";
import { Img } from "@/components/ui";
import { getSession } from "@/lib/auth";
import { earliestBookableDate, unavailableDates } from "@/lib/availability";
import { categoryMeta, DEPOSIT_RATE } from "@/lib/catalog";
import { db } from "@/lib/db";
import { asStringArray, money, toISODate, toNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

async function load(slug: string) {
  return db.service.findFirst({ where: { slug, isActive: true } });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const service = await load((await params).slug);
  return service ? { title: service.name, description: service.tagline } : {};
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = await load(slug);
  if (!service) notFound();

  const [session, unavailable, related] = await Promise.all([
    getSession(),
    unavailableDates(service.id),
    db.service.findMany({
      where: { isActive: true, category: service.category, id: { not: service.id } },
      take: 3,
      orderBy: { isFeatured: "desc" },
    }),
  ]);

  const cat = categoryMeta(service.category);
  const gallery = [service.imageUrl, ...asStringArray(service.gallery)];
  const features = asStringArray(service.features);
  const tall = service.category === "DRESS";

  return (
    <div className="container-pp py-10">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/services" className="hover:text-blush-700">
          Services
        </Link>
        <span>/</span>
        <Link href={`/services?c=${cat.slug}`} className="hover:text-blush-700">
          {cat.label}
        </Link>
        <span>/</span>
        <span className="truncate text-ink">{service.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        {/* Left: media + details */}
        <div>
          <div className={`relative overflow-hidden rounded-[2rem] bg-blush-50 ${tall ? "aspect-[4/5] max-h-[720px]" : "aspect-[16/11]"}`}>
            <Img
              src={service.imageUrl}
              alt={service.name}
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className={tall ? "object-contain p-4" : "object-cover"}
            />
          </div>
          {gallery.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {gallery.slice(1).map((src) => (
                <div key={src} className="relative aspect-square overflow-hidden rounded-2xl bg-blush-50">
                  <Img src={src} alt="" fill sizes="15vw" className="object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="mt-10">
            <p className="eyebrow">{cat.label}</p>
            <h1 className="mt-2 text-5xl font-semibold">{service.name}</h1>
            <p className="mt-3 text-lg text-muted">{service.tagline}</p>

            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              {service.capacity && <Pill icon="👥">Up to {service.capacity.toLocaleString()} guests</Pill>}
              {service.location && <Pill icon="📍">{service.location}</Pill>}
              <Pill icon="🌸">{service.priceUnit}</Pill>
            </div>

            <p className="mt-8 leading-relaxed text-ink/85">{service.description}</p>

            {features.length > 0 && (
              <div className="mt-8">
                <h2 className="text-3xl font-semibold">What’s included</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {features.map((f) => (
                    <li key={f} className="flex gap-3 rounded-2xl bg-white/80 p-3 text-sm ring-1 ring-line">
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-blush-100 text-xs text-blush-700">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right: sticky booking card */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-muted">Price</p>
                <p className="font-display text-4xl font-semibold text-blush-700">{money(service.price)}</p>
                <p className="text-xs text-muted">{service.priceUnit}</p>
              </div>
              <div className="rounded-2xl bg-mint-100 px-3 py-2 text-right">
                <p className="text-[11px] text-mint-800">Deposit to secure</p>
                <p className="font-semibold text-mint-800">{money(toNumber(service.price) * DEPOSIT_RATE)}</p>
              </div>
            </div>
            <hr className="my-5 border-line" />
            <h2 className="mb-3 font-sans text-sm font-semibold text-ink">Choose your event date</h2>
            <BookingWidget
              serviceId={service.id}
              slug={service.slug}
              unavailable={unavailable}
              earliest={toISODate(earliestBookableDate())}
              isLoggedIn={!!session}
            />
            <p className="mt-4 text-center text-xs text-muted">Free date changes up to 60 days before your event.</p>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="text-4xl font-semibold">You may also love</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Pill({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-medium text-blush-800 ring-1 ring-blush-200">
      <span aria-hidden>{icon}</span>
      {children}
    </span>
  );
}
