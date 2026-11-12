import type { Metadata } from "next";
import Link from "next/link";
import { removeFromCart } from "@/app/actions/booking";
import { Img } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { categoryMeta, DEPOSIT_RATE } from "@/lib/catalog";
import { db } from "@/lib/db";
import { eventDate, money, toNumber } from "@/lib/format";

export const metadata: Metadata = { title: "Wishlist" };

export default async function CartPage() {
  const session = await requireUser("/cart");
  const items = await db.cartItem.findMany({
    where: { userId: session.uid },
    include: { service: true },
    orderBy: [{ eventDate: "asc" }, { createdAt: "asc" }],
  });
  const subtotal = items.reduce((s, i) => s + toNumber(i.service.price), 0);

  return (
    <div className="container-pp py-14">
      <p className="eyebrow">Step 1 of 3</p>
      <h1 className="mt-2 text-5xl font-semibold">Your wedding wishlist</h1>

      {items.length === 0 ? (
        <div className="card mt-10 p-16 text-center">
          <p className="font-script text-5xl text-blush-500">Nothing here yet</p>
          <p className="mt-3 text-muted">Find a venue or pelamin you love, pick a date and it’ll appear here.</p>
          <Link href="/services" className="btn-primary mt-8">
            Browse services
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="card flex gap-4 p-4 sm:gap-6">
                <Link href={`/services/${item.service.slug}`} className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-2xl bg-blush-50 sm:w-32">
                  <Img src={item.service.imageUrl} alt={item.service.name} fill sizes="128px" className="object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <p className="text-xs font-semibold tracking-wide text-blush-600 uppercase">{categoryMeta(item.service.category).short}</p>
                  <Link href={`/services/${item.service.slug}`} className="truncate font-display text-2xl font-semibold text-blush-900 hover:text-blush-600">
                    {item.service.name}
                  </Link>
                  <p className="mt-1 inline-flex w-fit items-center gap-1.5 rounded-full bg-lilac-100 px-3 py-1 text-xs font-medium text-lilac-800">
                    📅 {eventDate(item.eventDate)}
                  </p>
                  <div className="mt-auto flex items-end justify-between pt-3">
                    <p className="text-lg font-bold text-blush-700">{money(item.service.price)}</p>
                    <form action={removeFromCart}>
                      <input type="hidden" name="id" value={item.id} />
                      <button className="cursor-pointer text-xs font-medium text-muted underline-offset-4 hover:text-red-600 hover:underline">Remove</button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <h2 className="text-3xl font-semibold">Summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </dt>
                  <dd className="font-medium">{money(subtotal)}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3 text-base">
                  <dt className="font-semibold">Total</dt>
                  <dd className="font-bold text-blush-700">{money(subtotal)}</dd>
                </div>
                <div className="flex justify-between rounded-2xl bg-mint-100 px-4 py-3 text-mint-800">
                  <dt>Due today ({DEPOSIT_RATE * 100}% deposit)</dt>
                  <dd className="font-bold">{money(Math.round(subtotal * DEPOSIT_RATE))}</dd>
                </div>
              </dl>
              <Link href="/checkout" className="btn-primary mt-6 w-full py-4">
                Continue to details →
              </Link>
              <Link href="/services" className="btn-ghost mt-3 w-full">
                Add more services
              </Link>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
