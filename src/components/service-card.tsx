import type { Service } from "@prisma/client";
import Link from "next/link";
import { categoryMeta } from "@/lib/catalog";
import { money } from "@/lib/format";
import { Img } from "./ui";

export function ServiceCard({ service, priority }: { service: Service; priority?: boolean }) {
  const cat = categoryMeta(service.category);
  const tall = service.category === "DRESS";
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group card flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-soft"
    >
      <div className={`relative overflow-hidden bg-blush-50 ${tall ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
        <Img
          src={service.imageUrl}
          alt={service.name}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className={`transition duration-700 group-hover:scale-105 ${tall ? "object-contain p-2" : "object-cover"}`}
        />
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-blush-700 backdrop-blur">
          {cat.short}
        </span>
        {service.capacity && (
          <span className="absolute top-3 right-3 rounded-full bg-blush-900/70 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {service.capacity.toLocaleString()} pax
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-2xl font-semibold transition group-hover:text-blush-600">{service.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted">{service.tagline}</p>
        <div className="mt-auto flex items-end justify-between pt-5">
          <p>
            <span className="text-xs text-muted">from </span>
            <span className="text-lg font-bold text-blush-700">{money(service.price)}</span>
            <span className="block text-xs text-muted">{service.priceUnit}</span>
          </p>
          <span className="grid size-10 place-items-center rounded-full bg-blush-100 text-blush-700 transition group-hover:bg-blush-500 group-hover:text-white">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
