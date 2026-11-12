"use client";

import type { Category } from "@prisma/client";
import Link from "next/link";
import { useActionState } from "react";
import { saveService } from "@/app/actions/admin";
import { Field, FormAlert, SubmitButton } from "@/components/ui";
import type { FormState } from "@/lib/form";

export type ServiceFormValues = {
  id?: number;
  name: string;
  category: Category;
  tagline: string;
  description: string;
  features: string;
  price: string;
  priceUnit: string;
  capacity: string;
  location: string;
  imageUrl: string;
  isActive: boolean;
  isFeatured: boolean;
};

export function ServiceForm({
  initial,
  categories,
}: {
  initial: ServiceFormValues;
  categories: { key: Category; label: string }[];
}) {
  const [state, action] = useActionState<FormState, FormData>(saveService, {});
  const v = (k: keyof ServiceFormValues) => state.values?.[k] ?? String(initial[k] ?? "");

  return (
    <form action={action} className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <div className="card space-y-5 p-6 sm:p-8">
        <FormAlert state={state} />
        {initial.id && <input type="hidden" name="id" value={initial.id} />}
        <input type="hidden" name="imageUrl" value={initial.imageUrl} />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Name" name="name" state={state} defaultValue={v("name")} required />
          <div>
            <label htmlFor="category" className="label">
              Category
            </label>
            <select id="category" name="category" defaultValue={v("category")} className="input">
              {categories.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <Field label="Tagline" name="tagline" state={state} defaultValue={v("tagline")} required hint="One line shown on cards" />
        <div>
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea id="description" name="description" rows={5} defaultValue={v("description")} className="input" required />
          {state.errors?.description && <p className="field-error">{state.errors.description}</p>}
        </div>
        <div>
          <label htmlFor="features" className="label">
            What’s included <span className="font-normal text-muted">(one per line)</span>
          </label>
          <textarea id="features" name="features" rows={6} defaultValue={v("features")} className="input font-mono text-xs" />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Price (RM)" name="price" type="number" step="0.01" min="0" state={state} defaultValue={v("price")} required />
          <Field label="Price unit" name="priceUnit" state={state} defaultValue={v("priceUnit")} placeholder="per event" />
          <Field label="Capacity (pax)" name="capacity" type="number" min="0" state={state} defaultValue={v("capacity")} />
        </div>
        <Field label="Location" name="location" state={state} defaultValue={v("location")} placeholder="e.g. Shah Alam, Selangor" />
      </div>

      <aside className="space-y-6">
        <div className="card space-y-4 p-6">
          <h2 className="font-sans text-sm font-semibold">Cover image</h2>
          {initial.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={initial.imageUrl} alt="" className="aspect-[4/3] w-full rounded-2xl object-cover" />
          )}
          <input
            type="file"
            name="image"
            accept="image/jpeg,image/png,image/webp"
            className="block w-full text-sm file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-blush-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blush-800"
          />
          <p className="text-xs text-muted">JPG, PNG or WEBP · max 5 MB</p>
          {state.errors?.image && <p className="field-error">{state.errors.image}</p>}
        </div>
        <div className="card space-y-3 p-6 text-sm">
          <label className="flex items-center gap-3">
            <input type="checkbox" name="isActive" defaultChecked={initial.isActive} className="size-4 accent-blush-500" />
            Live on website
          </label>
          <label className="flex items-center gap-3">
            <input type="checkbox" name="isFeatured" defaultChecked={initial.isFeatured} className="size-4 accent-blush-500" />
            Feature on homepage
          </label>
        </div>
        <div className="flex gap-3">
          <SubmitButton pendingText="Saving…" className="btn-primary flex-1">
            Save service
          </SubmitButton>
          <Link href="/admin/services" className="btn-ghost">
            Cancel
          </Link>
        </div>
      </aside>
    </form>
  );
}
