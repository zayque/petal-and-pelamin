import type { Metadata } from "next";
import Link from "next/link";
import { FloatingPetals, SectionHeading } from "@/components/brand";
import { db } from "@/lib/db";
import { asStringArray, money, toNumber } from "@/lib/format";

export const metadata: Metadata = { title: "Wedding Packages" };
export const dynamic = "force-dynamic";

const COMPARE = [
  { label: "Hall rental", test: (f: string[]) => f.some((x) => /hall/i.test(x)) },
  { label: "Full Malay catering", test: (f: string[]) => f.some((x) => /catering/i.test(x)) },
  { label: "Bride's table menu", test: (f: string[]) => f.some((x) => /bride/i.test(x)) },
  { label: "Wedding dais (pelamin)", test: (f: string[]) => f.some((x) => /dais|pelamin/i.test(x)) },
  { label: "DJ-MC & audio", test: (f: string[]) => f.some((x) => /DJ/i.test(x)) },
  { label: "Professional photographer", test: (f: string[]) => f.some((x) => /photographer/i.test(x)) },
  { label: "Free outdoor session", test: (f: string[]) => f.some((x) => /outdoor/i.test(x)) },
  { label: "Basmathi nasi bukhari", test: (f: string[]) => f.some((x) => /bukhari/i.test(x)) },
];

export default async function PackagesPage() {
  const packages = await db.service.findMany({
    where: { isActive: true, category: "PACKAGE" },
    orderBy: { price: "asc" },
  });

  return (
    <>
      <section className="relative overflow-hidden">
        <FloatingPetals />
        <div className="container-pp py-16">
          <SectionHeading
            eyebrow="All-in-one"
            title={
              <>
                Packages that bloom <span className="font-script font-normal text-blush-500">with you</span>
              </>
            }
            intro="Hall, catering and styling bundled together, so you pay less and stress less. Every package includes a dedicated planner."
          />
        </div>
      </section>

      <div className="container-pp">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {packages.map((p) => {
            const features = asStringArray(p.features);
            const perPax = p.capacity ? toNumber(p.price) / p.capacity : null;
            return (
              <article
                key={p.id}
                className={`card relative flex flex-col p-7 ${p.isFeatured ? "ring-2 ring-blush-400 xl:-translate-y-3" : ""}`}
              >
                {p.isFeatured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blush-500 px-4 py-1 text-xs font-bold text-white shadow-soft">
                    Most loved
                  </span>
                )}
                <h2 className="text-3xl font-semibold">{p.name.split("·")[1]?.trim() ?? p.name}</h2>
                <p className="text-xs font-semibold tracking-wider text-blush-600 uppercase">{p.name.split("·")[0]}</p>
                <p className="mt-3 text-sm text-muted">{p.tagline}</p>
                <p className="mt-6 font-display text-5xl font-semibold text-blush-700">{money(p.price)}</p>
                <p className="text-xs text-muted">
                  {p.capacity?.toLocaleString()} pax{perPax && <> · ≈ {money(perPax, true)} per guest</>}
                </p>
                <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                  {features.slice(0, 8).map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-blush-500">✿</span>
                      <span>{f}</span>
                    </li>
                  ))}
                  {features.length > 8 && <li className="text-xs text-muted">+ {features.length - 8} more</li>}
                </ul>
                <Link href={`/services/${p.slug}`} className={`mt-8 ${p.isFeatured ? "btn-primary" : "btn-soft"}`}>
                  Check dates
                </Link>
              </article>
            );
          })}
        </div>

        {packages.length > 0 && (
          <section className="mt-20">
            <h2 className="text-center text-4xl font-semibold">Side by side</h2>
            <div className="card mt-8 overflow-x-auto">
              <table className="table-pp min-w-[640px]">
                <thead>
                  <tr>
                    <th>Included</th>
                    {packages.map((p) => (
                      <th key={p.id} className="text-center">
                        {p.name.split("·")[1]?.trim() ?? p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-medium">Guests</td>
                    {packages.map((p) => (
                      <td key={p.id} className="text-center">
                        {p.capacity?.toLocaleString() ?? "—"}
                      </td>
                    ))}
                  </tr>
                  {COMPARE.map((row) => (
                    <tr key={row.label}>
                      <td className="font-medium">{row.label}</td>
                      {packages.map((p) => (
                        <td key={p.id} className="text-center">
                          {row.test(asStringArray(p.features)) ? (
                            <span className="inline-grid size-6 place-items-center rounded-full bg-blush-100 text-blush-700">✓</span>
                          ) : (
                            <span className="text-ink/20">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="font-semibold">Price</td>
                    {packages.map((p) => (
                      <td key={p.id} className="text-center font-semibold text-blush-700">
                        {money(p.price)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-center text-sm text-muted">
              Need something custom? <Link href="/contact" className="font-semibold text-blush-700 underline-offset-4 hover:underline">Talk to a planner</Link>.
            </p>
          </section>
        )}
      </div>
    </>
  );
}
