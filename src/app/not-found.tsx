import Link from "next/link";
import { FloatingPetals, Logo } from "@/components/brand";

export default function NotFound() {
  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden px-4 text-center">
      <FloatingPetals />
      <div>
        <div className="flex justify-center">
          <Logo />
        </div>
        <p className="mt-10 font-script text-7xl text-blush-500">Oh petal…</p>
        <h1 className="mt-2 text-4xl font-semibold">We couldn’t find that page</h1>
        <p className="mt-3 text-muted">It may have moved, or the link might be a little off.</p>
        <Link href="/" className="btn-primary mt-8">
          Back to home
        </Link>
      </div>
    </div>
  );
}
