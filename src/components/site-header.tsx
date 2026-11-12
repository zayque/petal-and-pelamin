import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Logo } from "./brand";

const NAV = [
  { href: "/services", label: "Services" },
  { href: "/packages", label: "Packages" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export async function SiteHeader() {
  const session = await getSession();
  const cartCount = session ? await db.cartItem.count({ where: { userId: session.uid } }) : 0;

  return (
    <header className="no-print sticky top-0 z-40 border-b border-line/70 bg-cream/80 backdrop-blur-xl">
      <div className="container-pp flex h-18 items-center justify-between gap-4 py-3">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink/80 transition hover:bg-blush-100 hover:text-blush-800"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {session && (
            <Link
              href="/cart"
              className="relative grid size-11 place-items-center rounded-full text-blush-700 transition hover:bg-blush-100"
              aria-label={`Wishlist, ${cartCount} items`}
            >
              <HeartBagIcon />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid min-w-5 place-items-center rounded-full bg-blush-500 px-1 text-[11px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {session ? (
            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-blush-200 bg-white px-2 py-1.5 pr-4 text-sm font-medium text-blush-800 [&::-webkit-details-marker]:hidden">
                <span className="grid size-8 place-items-center rounded-full bg-blush-200 font-semibold text-blush-800">
                  {session.name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-28 truncate sm:inline">{session.name.split(" ")[0]}</span>
              </summary>
              <div className="card absolute right-0 mt-2 w-56 p-2 text-sm">
                {session.role === "ADMIN" && (
                  <Link href="/admin" className="block rounded-xl px-3 py-2 hover:bg-blush-50">
                    Admin dashboard
                  </Link>
                )}
                <Link href="/account" className="block rounded-xl px-3 py-2 hover:bg-blush-50">
                  My bookings
                </Link>
                <Link href="/cart" className="block rounded-xl px-3 py-2 hover:bg-blush-50">
                  Wishlist
                </Link>
                <form action={logout}>
                  <button className="w-full cursor-pointer rounded-xl px-3 py-2 text-left text-muted hover:bg-blush-50">
                    Sign out
                  </button>
                </form>
              </div>
            </details>
          ) : (
            <>
              <Link href="/login" className="hidden px-3 text-sm font-medium text-blush-800 hover:text-blush-600 sm:inline">
                Sign in
              </Link>
              <Link href="/services" className="btn-primary btn-sm hidden sm:inline-flex">
                Start planning
              </Link>
            </>
          )}

          <details className="relative md:hidden">
            <summary
              className="grid size-11 cursor-pointer list-none place-items-center rounded-full text-blush-800 hover:bg-blush-100 [&::-webkit-details-marker]:hidden"
              aria-label="Menu"
            >
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />
              </svg>
            </summary>
            <nav className="card absolute right-0 mt-2 w-60 p-2" aria-label="Mobile">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="block rounded-xl px-4 py-3 font-medium hover:bg-blush-50">
                  {n.label}
                </Link>
              ))}
              {!session && (
                <Link href="/login" className="block rounded-xl px-4 py-3 font-medium text-blush-700 hover:bg-blush-50">
                  Sign in
                </Link>
              )}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}

function HeartBagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round">
      <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z" />
      <path d="M9 8V6.5a3 3 0 0 1 6 0V8" strokeLinecap="round" />
      <path
        d="M12 17.5s-3-1.8-3-3.6c0-.9.7-1.6 1.5-1.6.6 0 1.1.3 1.5.8.4-.5.9-.8 1.5-.8.8 0 1.5.7 1.5 1.6 0 1.8-3 3.6-3 3.6Z"
        className="fill-blush-300 stroke-none"
      />
    </svg>
  );
}
