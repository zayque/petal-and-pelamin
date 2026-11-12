import type { BookingStatus, Category } from "@prisma/client";

export const CATEGORIES: {
  key: Category;
  slug: string;
  label: string;
  short: string;
  blurb: string;
  image: string;
}[] = [
  {
    key: "HALL",
    slug: "halls",
    label: "Halls & Venues",
    short: "Venues",
    blurb: "Ballrooms, garden terraces and poolside pavilions for 300 to 1,500 guests.",
    image: "/images/halls/blush-ballroom.jpg",
  },
  {
    key: "PACKAGE",
    slug: "packages",
    label: "Wedding Packages",
    short: "Packages",
    blurb: "Hall, catering, dais and photographer bundled into one price.",
    image: "/images/halls/starlight-hall.jpg",
  },
  {
    key: "DAIS",
    slug: "dais",
    label: "Pelamin & Dais",
    short: "Pelamin",
    blurb: "Hand-styled bridal daises with fresh florals and soft drapery.",
    image: "/images/dais/dais-3.png",
  },
  {
    key: "DRESS",
    slug: "attire",
    label: "Bridal Attire",
    short: "Attire",
    blurb: "Couture gowns, baju kurung moden and tuxedos to rent.",
    image: "/images/dresses/dress-10.png",
  },
  {
    key: "PHOTOBOOTH",
    slug: "photobooth",
    label: "Photobooth",
    short: "Photobooth",
    blurb: "Themed backdrops, props and a guestbook your guests will love.",
    image: "/images/site/couple-wide.jpg",
  },
];

export function categoryBySlug(slug: string | undefined) {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function categoryMeta(key: Category) {
  return CATEGORIES.find((c) => c.key === key)!;
}

export const STATUS_META: Record<BookingStatus, { label: string; tone: string }> = {
  PENDING_PAYMENT: { label: "Awaiting payment", tone: "bg-peach-100 text-peach-800 ring-peach-200" },
  PAID: { label: "Deposit paid", tone: "bg-lilac-100 text-lilac-800 ring-lilac-200" },
  CONFIRMED: { label: "Confirmed", tone: "bg-mint-100 text-mint-800 ring-mint-200" },
  COMPLETED: { label: "Completed", tone: "bg-blush-100 text-blush-800 ring-blush-200" },
  CANCELLED: { label: "Cancelled", tone: "bg-stone-100 text-stone-600 ring-stone-200" },
};

export const PAYMENT_METHODS = ["FPX Online Banking", "Credit / Debit Card", "Touch 'n Go eWallet", "DuitNow QR"] as const;

/** Share of the total paid up-front to lock the date. */
export const DEPOSIT_RATE = 0.3;
