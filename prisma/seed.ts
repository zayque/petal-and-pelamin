/* Idempotent seed: safe to run repeatedly (upserts by slug / email). */
import { PrismaClient, type Category } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

type SeedService = {
  slug: string;
  name: string;
  category: Category;
  tagline: string;
  description: string;
  features: string[];
  price: number;
  priceUnit?: string;
  capacity?: number;
  location?: string;
  imageUrl: string;
  gallery?: string[];
  isFeatured?: boolean;
};

const MAIN_MENU = [
  "Nasi Minyak & Nasi Putih",
  "Gulai Daging Kawah",
  "Ayam Masak Merah",
  "Acar Nenas & Sambal Belacan",
  "Bubur Kacang",
];
const BRIDE_MENU = "Bride's table: udang berhias, ayam golek, ikan masak 3 rasa, fruits & dessert";

const services: SeedService[] = [
  // ───────── Halls ─────────
  {
    slug: "blush-ballroom",
    name: "The Blush Ballroom",
    category: "HALL",
    tagline: "A rosy, chandelier-lit ballroom made for grand receptions.",
    description:
      "Our signature indoor ballroom has soft pink uplighting, mirrored ceilings and a sprung dance floor. The bridal walkway runs straight from the foyer to the pelamin, which makes for a beautiful entrance. Includes a bridal suite, a VIP holding room and dedicated loading access for vendors.",
    features: ["Seats up to 1,000 guests", "Bridal suite & VIP room", "Full A/V & stage lighting", "Covered drop-off & 400 parking bays", "Surau & ablution area"],
    price: 9800,
    capacity: 1000,
    location: "Shah Alam, Selangor",
    imageUrl: "/images/halls/blush-ballroom.jpg",
    gallery: ["/images/site/hero-stage.jpg"],
    isFeatured: true,
  },
  {
    slug: "sumira-palace-banquet",
    name: "Sumira Palace Banquet",
    category: "HALL",
    tagline: "Starlit ceilings and round-table elegance for 1,500 guests.",
    description:
      "Sumira Palace is our largest pillarless banquet hall. A fibre-optic starlit ceiling sits over crisp white table settings. Partition walls let it host an intimate 500-guest nikah or a full 1,500-guest reception.",
    features: ["Up to 1,500 guests", "Pillarless layout", "Fibre-optic starlight ceiling", "In-house PA & LED wall", "Dedicated event captain"],
    price: 14500,
    capacity: 1500,
    location: "Putrajaya",
    imageUrl: "/images/halls/starlight-hall.jpg",
    isFeatured: true,
  },
  {
    slug: "enchanted-garden-terrace",
    name: "Enchanted Garden Terrace",
    category: "HALL",
    tagline: "Long tables under fairy lights and a canopy of trees.",
    description:
      "An open-air garden terrace strung with festoon lights. Set up long rustic tables, peony centrepieces and a wet-weather marquee on standby. It suits evening receptions and intimate solemnisations.",
    features: ["300 guests (banquet) / 450 (standing)", "Wet-weather marquee included", "Festoon & fairy lighting", "Rustic long-table setup"],
    price: 7200,
    capacity: 300,
    location: "Bukit Tinggi, Pahang",
    imageUrl: "/images/halls/garden-hall.jpg",
    isFeatured: true,
  },
  {
    slug: "poolside-pavilion",
    name: "Poolside Pavilion",
    category: "HALL",
    tagline: "A breezy night reception with a lit pool and canopy tents.",
    description:
      "Peaked white canopy tents set around a softly lit pool make a relaxed, resort-style reception. It works well for after-parties, mehndi nights and modern couples.",
    features: ["Up to 400 guests", "Peaked canopy tents", "Pool & ambient lighting", "Outdoor bar counter space"],
    price: 6500,
    capacity: 400,
    location: "Port Dickson, Negeri Sembilan",
    imageUrl: "/images/halls/poolside-pavilion.jpg",
  },
  {
    slug: "grand-marquee",
    name: "The Grand Marquee",
    category: "HALL",
    tagline: "A fully air-conditioned marquee with chandeliers.",
    description:
      "This climate-controlled marquee has crystal chandeliers, a garden-green aisle and seating for 800. You get a ballroom feel with the freedom of an outdoor site.",
    features: ["Up to 800 guests", "Fully air-conditioned", "Crystal chandeliers", "Green-carpet aisle"],
    price: 8800,
    capacity: 800,
    location: "Seremban, Negeri Sembilan",
    imageUrl: "/images/halls/grand-marquee.jpg",
  },

  // ───────── Packages (from the original site's Package A–D) ─────────
  {
    slug: "package-a-mawar",
    name: "Package A · Mawar",
    category: "PACKAGE",
    tagline: "Hall + full Malay catering for 1,000 guests.",
    description: "The essentials, done beautifully: a hall reception with a classic kenduri menu and a dedicated bride's table.",
    features: ["Hall rental", "Catering for 1,000 pax", ...MAIN_MENU, "Cordial drink", BRIDE_MENU],
    price: 13800,
    capacity: 1000,
    imageUrl: "/images/halls/grand-marquee.jpg",
  },
  {
    slug: "package-b-melati",
    name: "Package B · Melati",
    category: "PACKAGE",
    tagline: "Hall, catering, pelamin and DJ/MC for 1,200 guests.",
    description: "Our most popular package. It adds a styled pelamin and a DJ-MC with a full audio system to the hall and catering.",
    features: ["Hall rental", "Catering for 1,200 pax", ...MAIN_MENU, "Ikan bilis berlada", "Watermelon / orange", "Wedding dais (pelamin)", "DJ-MC + audio & cordless mic", BRIDE_MENU],
    price: 16800,
    capacity: 1200,
    imageUrl: "/images/halls/blush-ballroom.jpg",
    isFeatured: true,
  },
  {
    slug: "package-c-kenanga",
    name: "Package C · Kenanga",
    category: "PACKAGE",
    tagline: "Everything in Melati, plus a pro photographer, for 1,500 guests.",
    description: "Hall, caterer-served menu, pelamin and unlimited professional photography, with a free outdoor session after your big day.",
    features: ["Hall rental", "Catering for 1,500 pax", ...MAIN_MENU, "Papadom & fruit punch", "Wedding dais (pelamin)", "Professional photographer — unlimited shots", "All images in softcopy", "FREE outdoor session", BRIDE_MENU],
    price: 22200,
    capacity: 1500,
    imageUrl: "/images/halls/starlight-hall.jpg",
    isFeatured: true,
  },
  {
    slug: "package-d-teratai",
    name: "Package D · Teratai",
    category: "PACKAGE",
    tagline: "The premium package, with nasi bukhari and basmathi for 1,500 guests.",
    description: "Our top tier. It upgrades the menu to basmathi nasi bukhari and includes the full photography package and consultation.",
    features: ["Hall rental", "Catering for 1,500 pax", "Nasi Bukhari & Nasi Putih (basmathi)", "Gulai Daging Kawah", "Ayam Masak Merah", "Papadom & fruit punch", "Wedding dais (pelamin)", "Professional photographer — unlimited shots", "Professional consultation", "FREE outdoor session", BRIDE_MENU],
    price: 25200,
    capacity: 1500,
    imageUrl: "/images/site/hero-stage.jpg",
  },

  // ───────── Pelamin / Dais ─────────
  {
    slug: "pelamin-putih-klasik",
    name: "Putih Klasik",
    category: "DAIS",
    tagline: "Ivory florals, a geometric arch and crystal lanterns.",
    description: "A clean, modern pelamin with a gold geometric frame, white orchids, trailing greenery and a plush ivory settee.",
    features: ["4m × 3m setup", "Fresh & silk florals", "Settee + 2 side lanterns", "Setup & teardown included"],
    price: 2800,
    priceUnit: "per event",
    imageUrl: "/images/dais/dais-1.png",
    isFeatured: true,
  },
  {
    slug: "pelamin-biru-serene",
    name: "Serene Blue",
    category: "DAIS",
    tagline: "Dusty blue hydrangeas on soft white drapery.",
    description: "Cloud-like drapery with dusty-blue and blush hydrangeas makes a calm, dreamy backdrop.",
    features: ["5m × 3m setup", "Drapery backdrop", "Hydrangea florals", "Faux-fur carpet"],
    price: 3200,
    imageUrl: "/images/dais/dais-2.png",
  },
  {
    slug: "pelamin-ivory-rose",
    name: "Ivory Rose",
    category: "DAIS",
    tagline: "Blush roses, gold urns and a tufted loveseat.",
    description: "A romantic, full-bloom pelamin with cascading blush and ivory roses spilling from gold urns.",
    features: ["5m × 3.5m setup", "Premium rose arrangements", "Gold urns & candelabra", "Tufted loveseat"],
    price: 3600,
    imageUrl: "/images/dais/dais-3.png",
    isFeatured: true,
  },
  {
    slug: "pelamin-moonlit-arch",
    name: "Moonlit Arch",
    category: "DAIS",
    tagline: "Layered moon arches with a floral meadow carpet.",
    description: "Statement crescent arches framed in white florals. It's a show-stopper for large ballrooms.",
    features: ["6m × 4m setup", "Twin crescent arches", "Floral carpet border", "Warm spotlighting"],
    price: 4200,
    imageUrl: "/images/dais/dais-4.png",
  },

  // ───────── Attire ─────────
  {
    slug: "gown-rose-gold-ballgown",
    name: "Rose Gold Ballgown",
    category: "DRESS",
    tagline: "Embroidered tulle ballgown with a cathedral train.",
    description: "A full ballgown with metallic floral embroidery on blush tulle, finished with a dramatic cathedral-length train.",
    features: ["Sizes XS–XL (alteration included)", "3-day rental", "Steaming & dry-clean included", "Matching veil available"],
    price: 1500,
    priceUnit: "per 3-day rental",
    imageUrl: "/images/dresses/dress-10.png",
    isFeatured: true,
  },
  {
    slug: "gown-silver-mermaid",
    name: "Silver Mist Mermaid",
    category: "DRESS",
    tagline: "Fitted lace mermaid with a sheer cape sleeve.",
    description: "A sleek silver-grey mermaid silhouette with a sheer lace overlay. Elegant for a sanding or evening reception.",
    features: ["Sizes XS–L", "3-day rental", "Alteration included"],
    price: 1200,
    priceUnit: "per 3-day rental",
    imageUrl: "/images/dresses/dress-1.png",
    gallery: ["/images/dresses/dress-11.png"],
  },
  {
    slug: "kurung-blush-peplum",
    name: "Blush Peplum Kurung",
    category: "DRESS",
    tagline: "A modern baju kurung with a ruffled peplum and veil.",
    description: "A soft blush baju kurung moden with a cascading ruffle peplum, a fishtail skirt and a matching long veil.",
    features: ["Sizes S–XL", "Includes veil", "3-day rental"],
    price: 950,
    priceUnit: "per 3-day rental",
    imageUrl: "/images/dresses/dress-3.png",
    isFeatured: true,
  },
  {
    slug: "kurung-dusty-blue",
    name: "Dusty Blue Songket Kurung",
    category: "DRESS",
    tagline: "Textured songket-inspired fabric in powder blue.",
    description: "A structured kurung in powder-blue jacquard with a mermaid flare. A modern take on tradition.",
    features: ["Sizes S–XL", "3-day rental"],
    price: 850,
    priceUnit: "per 3-day rental",
    imageUrl: "/images/dresses/dress-4.png",
  },
  {
    slug: "gown-ivory-veil",
    name: "Ivory Cathedral Gown",
    category: "DRESS",
    tagline: "Beaded ivory gown with a cathedral veil.",
    description: "A classic ivory A-line with hand-beaded bodice and a cathedral veil for the solemnisation.",
    features: ["Sizes XS–XL", "Includes cathedral veil", "3-day rental"],
    price: 1300,
    priceUnit: "per 3-day rental",
    imageUrl: "/images/dresses/dress-6.png",
    gallery: ["/images/dresses/dress-2.png"],
  },
  {
    slug: "gown-mint-tiered",
    name: "Mint Cloud Tiered Gown",
    category: "DRESS",
    tagline: "Airy tiers of mint organza for a fairytale look.",
    description: "Soft tiers of mint-sage organza with a lace bodice. A dreamy pastel choice for garden receptions.",
    features: ["Sizes XS–L", "3-day rental"],
    price: 1100,
    priceUnit: "per 3-day rental",
    imageUrl: "/images/dresses/dress-8.png",
  },
  {
    slug: "kurung-midnight-peplum",
    name: "Midnight Pearl Peplum",
    category: "DRESS",
    tagline: "Iridescent midnight satin with a sculpted peplum.",
    description: "A bold, iridescent midnight satin with a structured peplum. Made for an evening bersanding.",
    features: ["Sizes S–XL", "3-day rental"],
    price: 900,
    priceUnit: "per 3-day rental",
    imageUrl: "/images/dresses/dress-5.png",
  },
  {
    slug: "tux-navy-jacquard",
    name: "Navy Jacquard Tuxedo",
    category: "DRESS",
    tagline: "Patterned navy tux with black satin lapels.",
    description: "A tailored navy jacquard dinner jacket with satin peak lapels, trousers and bow tie.",
    features: ["Sizes 36–48", "Jacket, trousers & bow tie", "3-day rental"],
    price: 450,
    priceUnit: "per 3-day rental",
    imageUrl: "/images/dresses/tux-1.jpg",
  },
  {
    slug: "tux-burgundy-velvet",
    name: "Burgundy Velvet Tuxedo",
    category: "DRESS",
    tagline: "Rich burgundy velvet for a statement groom.",
    description: "A plush burgundy velvet dinner jacket with black satin lapels, paired with slim black trousers.",
    features: ["Sizes 36–48", "Jacket, trousers & bow tie", "3-day rental"],
    price: 480,
    priceUnit: "per 3-day rental",
    imageUrl: "/images/dresses/tux-2.jpg",
  },

  // ───────── Photobooth ─────────
  {
    slug: "photobooth-rustic-garden",
    name: "Rustic Garden Booth",
    category: "PHOTOBOOTH",
    tagline: "A 7×7 floral backdrop with 15 rental props.",
    description: "A rustic garden backdrop with deko lighting, a bench seat and a basket of fun props.",
    features: ["7×7 ft backdrop", "15 rental prop sticks", "Garden / rustic deco", "Lighting + seat", "1 pair of soft pillows"],
    price: 195,
    priceUnit: "per event",
    imageUrl: "/images/photobooth/pb4.png",
  },
  {
    slug: "photobooth-secret-garden",
    name: "Secret Garden Booth",
    category: "PHOTOBOOTH",
    tagline: "A secret-garden backdrop with an 80-page premium guestbook.",
    description: "Our best-seller. A lush secret-garden wall with a premium 80-page guestbook so guests can leave notes beside their photos.",
    features: ["Secret garden backdrop", "80-page premium guestbook", "15 rental prop sticks", "Lighting + seat", "1 pair of soft pillows"],
    price: 200,
    imageUrl: "/images/photobooth/pb5.png",
    isFeatured: true,
  },
  {
    slug: "photobooth-grand-guestbook",
    name: "Grand Guestbook Corner",
    category: "PHOTOBOOTH",
    tagline: "An 8×7 backdrop with a full guestbook corner.",
    description: "The largest setup: an 8×7 backdrop, a dedicated guestbook corner and garden-concept deco.",
    features: ["8×7 ft backdrop", "80-page guestbook + guestbook corner", "15 rental prop sticks", "Garden concept deko", "Lighting + seat"],
    price: 250,
    imageUrl: "/images/photobooth/pb6.png",
  },
];

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@petalpelamin.my").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@12345";

  await db.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Studio Admin",
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: "ADMIN",
    },
  });

  await db.user.upsert({
    where: { email: "aisyah@example.com" },
    update: {},
    create: {
      name: "Aisyah Rahman",
      email: "aisyah@example.com",
      phone: "012-345 6789",
      passwordHash: await bcrypt.hash("Bride@2026", 10),
    },
  });

  for (const s of services) {
    const data = {
      ...s,
      priceUnit: s.priceUnit ?? "per event",
      gallery: s.gallery ?? [],
      isFeatured: s.isFeatured ?? false,
    };
    // create-only: never overwrite edits an admin made in the dashboard
    await db.service.upsert({ where: { slug: s.slug }, update: {}, create: data });
  }

  console.log(`✿ Seeded ${services.length} services, admin <${adminEmail}> and demo customer <aisyah@example.com>`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
