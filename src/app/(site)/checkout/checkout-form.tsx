"use client";

import { useActionState } from "react";
import { checkout } from "@/app/actions/booking";
import { Field, FormAlert, SubmitButton } from "@/components/ui";
import type { FormState } from "@/lib/form";

const STATES = [
  "Johor", "Kedah", "Kelantan", "Kuala Lumpur", "Labuan", "Melaka", "Negeri Sembilan", "Pahang", "Perak",
  "Perlis", "Pulau Pinang", "Putrajaya", "Sabah", "Sarawak", "Selangor", "Terengganu",
];

export function CheckoutForm({ defaults }: { defaults: Record<string, string> }) {
  const [state, action] = useActionState<FormState, FormData>(checkout, {});
  const v = (k: string) => state.values?.[k] ?? defaults[k];

  return (
    <form action={action} className="space-y-6">
      <FormAlert state={state} />
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 font-display text-2xl font-semibold text-blush-900">Contact person</legend>
        <Field label="Full name" name="contactName" state={state} defaultValue={v("contactName")} required className="sm:col-span-2" />
        <Field label="Email" name="contactEmail" type="email" state={state} defaultValue={v("contactEmail")} required />
        <Field label="Phone" name="contactPhone" type="tel" state={state} defaultValue={v("contactPhone")} required />
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 font-display text-2xl font-semibold text-blush-900">Billing address</legend>
        <Field label="Street address" name="address" state={state} required className="sm:col-span-2" autoComplete="street-address" />
        <Field label="City" name="city" state={state} required autoComplete="address-level2" />
        <div>
          <label htmlFor="state" className="label">
            State
          </label>
          <select id="state" name="state" className="input" defaultValue={state.values?.state ?? "Selangor"} required>
            {STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </fieldset>

      <div>
        <label htmlFor="notes" className="label">
          Notes for your planner <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea id="notes" name="notes" rows={3} defaultValue={state.values?.notes} className="input" placeholder="Theme colours, special requests, dietary needs…" />
      </div>

      <SubmitButton pendingText="Securing your dates…" className="btn-primary w-full py-4 sm:w-auto">
        Continue to payment →
      </SubmitButton>
    </form>
  );
}
