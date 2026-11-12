import type { z } from "zod";

export type FormState = {
  ok?: boolean;
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

/** Validate FormData with a zod schema; returns parsed data or a FormState with field errors. */
export function parseForm<T extends z.ZodType>(
  schema: T,
  formData: FormData,
): { data: z.infer<T>; state?: undefined } | { data?: undefined; state: FormState } {
  const raw: Record<string, string> = {};
  for (const [k, v] of formData.entries()) if (typeof v === "string") raw[k] = v;

  const result = schema.safeParse(raw);
  if (result.success) return { data: result.data };

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  // never echo passwords back to the browser
  const { password: _p, confirm: _c, ...values } = raw;
  return { state: { ok: false, errors, values, message: "Please check the highlighted fields." } };
}
