"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { Field, FormAlert, SubmitButton } from "@/components/ui";
import type { FormState } from "@/lib/form";

export function LoginForm({ next }: { next?: string }) {
  const [state, action] = useActionState<FormState, FormData>(login, {});
  return (
    <>
      <h1 className="text-5xl font-semibold">Welcome back</h1>
      <p className="mt-2 text-muted">Sign in to see your wishlist and bookings.</p>
      <form action={action} className="mt-8 space-y-5">
        <input type="hidden" name="next" value={next ?? ""} />
        <FormAlert state={state} />
        <Field label="Email" name="email" type="email" state={state} required autoComplete="email" />
        <Field label="Password" name="password" type="password" state={state} required autoComplete="current-password" />
        <SubmitButton pendingText="Signing in…" className="btn-primary w-full py-3.5">
          Sign in
        </SubmitButton>
      </form>
      <p className="mt-8 text-center text-sm text-muted">
        New here?{" "}
        <Link href={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-blush-700 hover:underline">
          Create an account
        </Link>
      </p>
    </>
  );
}
