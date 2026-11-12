import type { Metadata } from "next";
import { CATEGORIES } from "@/lib/catalog";
import { ServiceForm } from "../service-form";

export const metadata: Metadata = { title: "New service" };

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Catalogue</p>
        <h1 className="mt-1 text-4xl font-semibold">New service</h1>
      </header>
      <ServiceForm
        categories={CATEGORIES.map(({ key, label }) => ({ key, label }))}
        initial={{
          name: "",
          category: "HALL",
          tagline: "",
          description: "",
          features: "",
          price: "",
          priceUnit: "per event",
          capacity: "",
          location: "",
          imageUrl: "",
          isActive: true,
          isFeatured: false,
        }}
      />
    </div>
  );
}
