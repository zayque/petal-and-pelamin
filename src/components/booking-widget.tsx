"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { addToCart } from "@/app/actions/booking";
import type { FormState } from "@/lib/form";
import { FormAlert, SubmitButton } from "./ui";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function iso(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function BookingWidget({
  serviceId,
  slug,
  unavailable,
  earliest,
  isLoggedIn,
}: {
  serviceId: number;
  slug: string;
  unavailable: string[];
  /** first bookable ISO date */
  earliest: string;
  isLoggedIn: boolean;
}) {
  const [state, action] = useActionState<FormState, FormData>(addToCart, {});
  const taken = useMemo(() => new Set(unavailable), [unavailable]);
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState(() => {
    const [y, m] = earliest.split("-").map(Number);
    return { y, m: m - 1 };
  });

  const days = useMemo(() => {
    const first = new Date(Date.UTC(view.y, view.m, 1));
    const offset = (first.getUTCDay() + 6) % 7; // Monday-first
    const count = new Date(Date.UTC(view.y, view.m + 1, 0)).getUTCDate();
    return [...Array(offset).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)] as (number | null)[];
  }, [view]);

  const [ey, em] = earliest.split("-").map(Number);
  const canGoBack = view.y > ey || (view.y === ey && view.m > em - 1);
  const monthLabel = new Date(Date.UTC(view.y, view.m, 1)).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  function shift(delta: number) {
    setView(({ y, m }) => {
      const d = new Date(Date.UTC(y, m + delta, 1));
      return { y: d.getUTCFullYear(), m: d.getUTCMonth() };
    });
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="serviceId" value={serviceId} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="eventDate" value={selected ?? ""} />

      <div className="rounded-3xl border border-line bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => shift(-1)}
            disabled={!canGoBack}
            className="grid size-9 cursor-pointer place-items-center rounded-full text-blush-700 hover:bg-blush-100 disabled:cursor-default disabled:opacity-30"
            aria-label="Previous month"
          >
            ‹
          </button>
          <p className="font-display text-xl font-semibold text-blush-900">{monthLabel}</p>
          <button
            type="button"
            onClick={() => shift(1)}
            className="grid size-9 cursor-pointer place-items-center rounded-full text-blush-700 hover:bg-blush-100"
            aria-label="Next month"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-muted">
          {WEEKDAYS.map((d) => (
            <span key={d} className="py-1">
              {d}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => {
            if (d === null) return <span key={`e${i}`} />;
            const value = iso(view.y, view.m, d);
            const isTaken = taken.has(value);
            const tooSoon = value < earliest;
            const disabled = isTaken || tooSoon;
            const isSelected = selected === value;
            return (
              <button
                key={value}
                type="button"
                disabled={disabled}
                onClick={() => setSelected(value)}
                aria-pressed={isSelected}
                aria-label={`${value}${isTaken ? " (booked)" : ""}`}
                className={`aspect-square cursor-pointer rounded-xl text-sm transition ${
                  isSelected
                    ? "bg-blush-500 font-bold text-white shadow-soft"
                    : isTaken
                      ? "cursor-not-allowed bg-blush-50 text-blush-300 line-through"
                      : tooSoon
                        ? "cursor-not-allowed text-ink/25"
                        : "text-ink hover:bg-blush-100 hover:text-blush-800"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-[11px] text-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded bg-blush-500" /> Selected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-3 rounded bg-blush-50 ring-1 ring-blush-200" /> Booked
          </span>
          <span>Bookings open 14 days ahead</span>
        </div>
      </div>

      <FormAlert state={state} />

      {isLoggedIn ? (
        <>
          <SubmitButton pendingText="Checking date…" className={`${state.ok ? "btn-ghost" : "btn-primary"} w-full`}>
            {selected
              ? `Reserve ${new Date(`${selected}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}`
              : "Pick a date to reserve"}
          </SubmitButton>
          {state.ok && (
            <Link href="/cart" className="btn-primary w-full">
              View wishlist & checkout →
            </Link>
          )}
        </>
      ) : (
        <Link href={`/login?next=/services/${slug}`} className="btn-primary w-full">
          Sign in to reserve
        </Link>
      )}
    </form>
  );
}
