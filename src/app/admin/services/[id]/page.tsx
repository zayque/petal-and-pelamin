import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES } from "@/lib/catalog";
import { db } from "@/lib/db";
import { asStringArray } from "@/lib/format";
import { ServiceForm } from "../service-form";

export const metadata: Metadata = { title: "Edit service" };

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const s = Number.isInteger(id) ? await db.service.findUnique({ where: { id } }) : null;
  if (!s) notFound();

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Catalogue</p>
        <h1 className="mt-1 text-4xl font-semibold">Edit · {s.name}</h1>
      </header>
      <ServiceForm
        categories={CATEGORIES.map(({ key, label }) => ({ key, label }))}
        initial={{
          id: s.id,
          name: s.name,
          category: s.category,
          tagline: s.tagline,
          description: s.description,
          features: asStringArray(s.features).join("\n"),
          price: s.price.toString(),
          priceUnit: s.priceUnit,
          capacity: s.capacity?.toString() ?? "",
          location: s.location ?? "",
          imageUrl: s.imageUrl,
          isActive: s.isActive,
          isFeatured: s.isFeatured,
        }}
      />
    </div>
  );
}
