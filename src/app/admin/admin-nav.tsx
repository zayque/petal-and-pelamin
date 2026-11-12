"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/admin", label: "Overview", icon: "✿" },
  { href: "/admin/bookings", label: "Bookings", icon: "📒" },
  { href: "/admin/services", label: "Services", icon: "💐" },
  { href: "/admin/calendar", label: "Calendar", icon: "📅" },
  { href: "/admin/messages", label: "Messages", icon: "💌" },
  { href: "/admin/customers", label: "Customers", icon: "👰" },
];

export function AdminNav({ badges }: { badges: Record<string, number> }) {
  const path = usePathname();
  return (
    <nav className="-mx-1 flex gap-1 overflow-x-auto lg:mx-0 lg:flex-col" aria-label="Admin">
      {ITEMS.map((item) => {
        const active = item.href === "/admin" ? path === "/admin" : path.startsWith(item.href);
        const badge = badges[item.href];
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex shrink-0 items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition ${
              active ? "bg-blush-500 text-white shadow-soft" : "text-ink/80 hover:bg-blush-100"
            }`}
          >
            <span aria-hidden>{item.icon}</span>
            {item.label}
            {badge > 0 && (
              <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-bold ${active ? "bg-white/25" : "bg-blush-100 text-blush-700"}`}>
                {badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
