import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const script = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-greatvibes" });

export const metadata: Metadata = {
  title: {
    default: "Petal & Pelamin — Wedding halls, pelamin & bridal attire",
    template: "%s · Petal & Pelamin",
  },
  description:
    "Book wedding halls, pelamin, bridal attire and photobooths in one place. Live availability, transparent pricing, and a 30% deposit to lock your date.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#ffd6e2" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable} ${script.variable}`}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
