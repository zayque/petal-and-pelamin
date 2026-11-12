"use client";

import Link from "next/link";
import { useActionState } from "react";
import { register } from "@/app/actions/auth";
import { Field, FormAlert, SubmitButton } from "@/components/ui";
import type { FormState } from "@/lib/form";

export function RegisterForm({ next }: { next?: string }) {
  const [state, action] = useActionState<FormState, FormData>(register, {});
  return (
    <>
      <h1 className="text-5xl font-semibold">Create your account</h1>
      <p className="mt-2 text-muted">It’s free, and it takes less than a minute.</p>
      <form action={action} className="mt-8 space-y-5">
        <input type="hidden" name="next" value={next ?? ""} />
        <FormAlert state={state} />
        <Field label="Full name" name="name" state={state} required autoComplete="name" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email" name="email" type="email" state={state} required autoComplete="email" />
          <Field label="Phone" name="phone" type="tel" state={state} required autoComplete="tel" placeholder="012-345 6789" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Password" name="password" type="password" state={state} required minLength={8} autoComplete="new-password" hint="8+ characters" />
          <Field label="Confirm password" name="confirm" type="password" state={state} required autoComplete="new-password" />
        </div>
        <SubmitButton pendingText="Creating account…" className="btn-primary w-full py-3.5">
          Create account
        </SubmitButton>
      </form>
      <p className="mt-8 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-blush-700 hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
