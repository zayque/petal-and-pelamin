import Image from "next/image";
import Link from "next/link";
import { FloatingPetals, SectionHeading } from "@/components/brand";
import { ServiceCard } from "@/components/service-card";
import { CATEGORIES } from "@/lib/catalog";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const STEPS = [
  { n: "01", title: "Discover", body: "Browse venues, pelamin, attire and photobooths with honest prices and real photos." },
  { n: "02", title: "Pick your date", body: "Live calendars show what's free, so there's no back-and-forth over WhatsApp." },
  { n: "03", title: "Lock it in", body: "Pay a 30% deposit online. Your date is held and your planner reaches out within a day." },
];

const TESTIMONIALS = [
  {
    quote: "We booked the hall, pelamin and my dress in one evening. The calendar showed exactly which Saturdays were free. No stress at all!",
    name: "Nurul & Hakim",
    meta: "Blush Ballroom · June 2026",
  },
  {
    quote: "Package B was such good value. The Melati menu got so many compliments, and the DJ-MC kept everyone smiling.",
    name: "Farah & Danial",
    meta: "Package B · March 2026",
  },
  {
    quote: "The Ivory Rose pelamin looked even more beautiful in person. Our photos are dreamy.",
    name: "Aina & Syafiq",
    meta: "Ivory Rose pelamin · Oct 2026",
  },
];

export default async function HomePage() {
  const [featured, counts] = await Promise.all([
    db.service.findMany({
      where: { isActive: true, isFeatured: true, category: { not: "PACKAGE" } },
      orderBy: { createdAt: "asc" },
      take: 6,
    }),
    db.service.groupBy({ by: ["category"], where: { isActive: true }, _count: true }),
  ]);
  const countFor = (k: string) => counts.find((c) => c.category === k)?._count ?? 0;

  return (
    <>
      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden">
        <FloatingPetals />
        <div className="container-pp grid items-center gap-12 pt-12 pb-20 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
          <div className="animate-fade-up">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-xs font-semibold text-blush-700 ring-1 ring-blush-200">
              <span className="size-1.5 rounded-full bg-blush-500" /> Now booking 2027 dates
            </p>
            <h1 className="mt-6 text-5xl leading-[1.05] font-semibold sm:text-6xl lg:text-7xl">
              Your dream wedding,
              <span className="block font-script text-6xl font-normal text-blush-500 sm:text-7xl lg:text-8xl">in full bloom.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
              Halls, pelamin, bridal attire and photobooths in one place. Check live availability, compare honest prices and secure your date
              with a 30% deposit.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/services" className="btn-primary px-8 py-4 text-base">
                Explore services
              </Link>
              <Link href="/packages" className="btn-ghost px-8 py-4 text-base">
                Compare packages
              </Link>
            </div>
            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6">
              {[
                ["1,200+", "couples wed"],
                ["4.9★", "average rating"],
                ["25+", "curated services"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-3xl font-semibold text-blush-700">{v}</dt>
                  <dd className="text-xs text-muted">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-linear-to-br from-blush-200 via-lilac-100 to-peach-100 blur-2xl" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] rounded-tl-[8rem] border-8 border-white shadow-soft">
              <Image
                src="/images/site/hero-stage.jpg"
                alt="A blush-pink floral wedding stage"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="card absolute -bottom-6 -left-4 flex items-center gap-3 px-5 py-4 sm:-left-10">
              <span className="grid size-11 place-items-center rounded-full bg-mint-100 text-lg">✓</span>
              <div>
                <p className="text-sm font-semibold">Date secured!</p>
                <p className="text-xs text-muted">Blush Ballroom · 12 Jun 2027</p>
              </div>
            </div>
            <div className="card absolute -top-4 -right-2 hidden px-4 py-3 sm:block">
              <p className="font-script text-2xl text-blush-500">Love,</p>
              <p className="text-xs text-muted">planned beautifully</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Categories ───────── */}
      <section className="container-pp py-16">
        <SectionHeading eyebrow="Everything for the big day" title="Plan it all in one place" />
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-5">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c.key}
              href={c.key === "PACKAGE" ? "/packages" : `/services?c=${c.slug}`}
              className={`group relative overflow-hidden rounded-3xl bg-blush-50 ${i === 0 ? "col-span-2 md:col-span-1" : ""}`}
            >
              <div className="relative aspect-[3/4]">
                <Image
                  src={c.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 20vw, 50vw"
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-blush-900/80 via-blush-900/10 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <p className="font-display text-2xl font-semibold">{c.short}</p>
                <p className="text-xs text-white/80">{countFor(c.key)} options</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ───────── Featured ───────── */}
      <section className="container-pp py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading align="left" eyebrow="Couples' favourites" title="Loved this season" />
          <Link href="/services" className="btn-ghost">
            See all services →
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s, i) => (
            <ServiceCard key={s.id} service={s} priority={i < 3} />
          ))}
        </div>
      </section>

      {/* ───────── How it works ───────── */}
      <section className="py-20">
        <div className="container-pp">
          <div className="rounded-[2.5rem] bg-linear-to-br from-blush-100 via-white to-lilac-100 px-6 py-16 sm:px-12">
            <SectionHeading eyebrow="How it works" title="Three gentle steps to “I do”" />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.n} className="card p-8">
                  <span className="font-display text-5xl font-semibold text-blush-300">{s.n}</span>
                  <h3 className="mt-4 text-3xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Testimonials ───────── */}
      <section className="container-pp py-12">
        <SectionHeading eyebrow="Kind words" title="From our newlyweds" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="card relative p-8">
              <span className="absolute top-4 right-6 font-display text-7xl leading-none text-blush-200">“</span>
              <blockquote className="relative text-base leading-relaxed text-ink/90">{t.quote}</blockquote>
              <figcaption className="mt-6">
                <p className="font-script text-3xl text-blush-600">{t.name}</p>
                <p className="text-xs text-muted">{t.meta}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="container-pp py-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-r from-blush-500 to-blush-600 px-8 py-16 text-center text-white sm:px-16">
          <FloatingPetals />
          <h2 className="relative text-4xl font-semibold text-white sm:text-5xl">Let’s make it unforgettable</h2>
          <p className="relative mx-auto mt-4 max-w-xl text-white/85">
            Book a free 30-minute consultation with our planners. We’ll shortlist venues and styles for your budget.
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn bg-white text-blush-700 hover:bg-blush-50">
              Book a consultation
            </Link>
            <Link href="/register" className="btn border border-white/50 text-white hover:bg-white/10">
              Create a free account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
