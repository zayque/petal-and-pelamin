import type { Prisma } from "@prisma/client";

type Num = number | string | Prisma.Decimal;

export function toNumber(value: Num) {
  return typeof value === "number" ? value : Number(value.toString());
}

const rm = new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR", maximumFractionDigits: 0 });
const rmCents = new Intl.NumberFormat("en-MY", { style: "currency", currency: "MYR" });

export function money(value: Num, cents = false) {
  return (cents ? rmCents : rm).format(toNumber(value));
}

/** Event dates are stored as DATE (UTC midnight) — always format in UTC. */
export function eventDate(d: Date, style: "long" | "short" = "long") {
  return d.toLocaleDateString("en-GB", {
    timeZone: "UTC",
    weekday: style === "long" ? "short" : undefined,
    day: "numeric",
    month: style === "long" ? "long" : "short",
    year: "numeric",
  });
}

export function dateTime(d: Date) {
  return d.toLocaleString("en-GB", {
    timeZone: "Asia/Kuala_Lumpur",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** "2026-12-24" → Date at UTC midnight, or null if malformed. */
export function parseISODate(value: unknown): Date | null {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(`${value}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function toISODate(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function todayUTC() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 150);
}

export function asStringArray(json: unknown): string[] {
  return Array.isArray(json) ? json.filter((x): x is string => typeof x === "string") : [];
}
