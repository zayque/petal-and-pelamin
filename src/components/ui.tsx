"use client";

import Image, { type ImageProps } from "next/image";
import { useFormStatus } from "react-dom";
import type { FormState } from "@/lib/form";

export function SubmitButton({
  children,
  pendingText = "Please wait…",
  className = "btn-primary",
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending} aria-busy={pending}>
      {pending ? (
        <>
          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function FormAlert({ state }: { state: FormState }) {
  if (!state.message) return null;
  return (
    <div
      role={state.ok ? "status" : "alert"}
      className={`rounded-2xl px-4 py-3 text-sm ${
        state.ok ? "bg-mint-100 text-mint-800" : "bg-red-50 text-red-700 ring-1 ring-red-100"
      }`}
    >
      {state.message}
    </div>
  );
}

export function Field({
  label,
  name,
  state,
  hint,
  className,
  defaultValue,
  ...props
}: {
  label: string;
  name: string;
  state?: FormState;
  hint?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const error = state?.errors?.[name];
  return (
    <div className={className}>
      <label htmlFor={name} className="label">
        {label}
      </label>
      <input
        id={name}
        name={name}
        className="input"
        defaultValue={state?.values?.[name] ?? defaultValue}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...props}
      />
      {hint && !error && <p className="mt-1 text-xs text-muted">{hint}</p>}
      {error && (
        <p id={`${name}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}

/** next/image that skips optimisation for admin uploads (served by a route handler). */
export function Img(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  return <Image {...props} unoptimized={props.unoptimized ?? src.startsWith("/uploads/")} />;
}
