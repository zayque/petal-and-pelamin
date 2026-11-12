"use client";

import { useActionState } from "react";
import { blockDate } from "@/app/actions/admin";
import { Field, FormAlert, SubmitButton } from "@/components/ui";
import type { FormState } from "@/lib/form";

export function BlockDateForm({ services }: { services: { id: number; name: string; category: string }[] }) {
  const [state, action] = useActionState<FormState, FormData>(blockDate, {});
  return (
    <form action={action} className="mt-4 space-y-4">
      <FormAlert state={state} />
      <Field label="Date" name="date" type="date" state={state} required />
      <div>
        <label htmlFor="serviceId" className="label">
          Applies to
        </label>
        <select id="serviceId" name="serviceId" className="input">
          <option value="">All services</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <Field label="Reason (optional)" name="reason" state={state} placeholder="e.g. Hall maintenance" />
      <SubmitButton pendingText="Blocking…" className="btn-primary w-full">
        Block date
      </SubmitButton>
    </form>
  );
}
