import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";
import { Logo } from "./brand";

export function SiteFooter() {
  return (
    <footer className="no-print mt-24 border-t border-line bg-linear-to-b from-blush-50 to-blush-100/70">
      <div className="container-pp grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Halls, pelamin, bridal attire and photobooths, all bookable in one place. Malaysian weddings, planned with love.
          </p>
        </div>
        <FooterCol title="Services">
          {CATEGORIES.map((c) => (
            <Link key={c.key} href={`/services?c=${c.slug}`}>
              {c.label}
            </Link>
          ))}
        </FooterCol>
        <FooterCol title="Studio">
          <Link href="/about">Our story</Link>
          <Link href="/packages">Compare packages</Link>
          <Link href="/contact">Book a consultation</Link>
          <Link href="/account">My bookings</Link>
        </FooterCol>
        <FooterCol title="Visit us">
          <span>Mon–Sat · 10am–7pm</span>
          <span>Shah Alam, Selangor</span>
          <a href="mailto:hello@petalpelamin.my">hello@petalpelamin.my</a>
        </FooterCol>
      </div>
      <div className="border-t border-line/80 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} Petal &amp; Pelamin. Made with ♡ in Malaysia.
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-sans text-sm font-semibold tracking-wide text-blush-800">{title}</h3>
      <div className="mt-4 flex flex-col gap-2.5 text-sm text-muted [&_a]:transition [&_a:hover]:text-blush-700">{children}</div>
    </div>
  );
}
