"use client";

import { useActionState } from "react";
import { sendMessage } from "@/app/actions/contact";
import { Field, FormAlert, SubmitButton } from "@/components/ui";
import type { FormState } from "@/lib/form";

export function ContactForm() {
  const [state, action] = useActionState<FormState, FormData>(sendMessage, {});

  if (state.ok) {
    return (
      <div className="py-12 text-center">
        <p className="font-script text-6xl text-blush-500">Thank you!</p>
        <p className="mx-auto mt-4 max-w-sm text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <h2 className="text-3xl font-semibold">Send us a note</h2>
      <FormAlert state={state} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" state={state} required autoComplete="name" />
        <Field label="Email" name="email" type="email" state={state} required autoComplete="email" />
        <Field label="Phone (optional)" name="phone" type="tel" state={state} autoComplete="tel" />
        <Field label="Event date (if known)" name="eventDate" type="date" state={state} />
      </div>
      <div>
        <label htmlFor="body" className="label">
          Tell us about your day
        </label>
        <textarea
          id="body"
          name="body"
          rows={5}
          required
          defaultValue={state.values?.body}
          className="input resize-y"
          placeholder="Guest count, preferred venue style, colours you love…"
        />
        {state.errors?.body && <p className="field-error">{state.errors.body}</p>}
      </div>
      <SubmitButton pendingText="Sending…" className="btn-primary w-full sm:w-auto">
        Send message ✿
      </SubmitButton>
    </form>
  );
}
