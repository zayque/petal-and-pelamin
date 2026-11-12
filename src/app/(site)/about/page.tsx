import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/brand";

export const metadata: Metadata = { title: "Our Story" };

const VALUES = [
  { icon: "🌸", title: "Honest pricing", body: "What you see is what you pay. No hidden service charges on the day." },
  { icon: "📅", title: "Live availability", body: "Our calendars update in real time, so a date you see open really is open." },
  { icon: "🤍", title: "Planner on call", body: "Every booking comes with a dedicated planner from deposit to doa selamat." },
  { icon: "✨", title: "Curated vendors", body: "We visit every hall and inspect every pelamin and gown ourselves." },
];

export default function AboutPage() {
  return (
    <div className="container-pp py-16">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">Our story</p>
          <h1 className="mt-3 text-5xl leading-tight font-semibold sm:text-6xl">
            Born from one very <span className="font-script font-normal text-blush-500">stressful</span> kenduri
          </h1>
          <div className="mt-6 space-y-4 leading-relaxed text-ink/85">
            <p>
              Petal &amp; Pelamin started when our founder spent four months on the phone with halls, pelamin makers and boutiques just to plan
              her own wedding. Every vendor had a different price list, a different WhatsApp number and a different answer about “is that
              date free?”
            </p>
            <p>
              So we built the place we wished we had: one beautiful home for the venues, pelamin, attire and photobooths Malaysian couples
              love, with live calendars and transparent prices.
            </p>
          </div>
          <Link href="/services" className="btn-primary mt-8">
            Start planning
          </Link>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 -z-10 rotate-3 rounded-[2.5rem] bg-linear-to-br from-blush-200 to-lilac-200" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] border-8 border-white shadow-soft">
            <Image src="/images/site/couple.jpg" alt="A bride and groom holding a bouquet" fill sizes="(min-width:1024px) 45vw, 100vw" className="object-cover" />
          </div>
        </div>
      </div>

      <section className="mt-28">
        <SectionHeading eyebrow="What we promise" title="Planning that feels like a gift" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="card p-7">
              <span className="grid size-12 place-items-center rounded-2xl bg-blush-100 text-2xl">{v.icon}</span>
              <h3 className="mt-5 text-2xl font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mt-28 overflow-hidden rounded-[2.5rem]">
        <div className="relative aspect-[21/9] min-h-64">
          <Image src="/images/site/couple-wide.jpg" alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-r from-blush-900/70 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-center p-8 sm:p-16">
          <div className="max-w-md text-white">
            <p className="font-script text-4xl text-blush-200">Selamat pengantin baru</p>
            <p className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">Let’s write the first chapter together.</p>
            <Link href="/contact" className="btn mt-6 bg-white text-blush-700 hover:bg-blush-50">
              Meet a planner
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
