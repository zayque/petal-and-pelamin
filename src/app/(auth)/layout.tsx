import Image from "next/image";
import { FloatingPetals, Logo } from "@/components/brand";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <Image src="/images/halls/blush-ballroom.jpg" alt="" fill priority sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-br from-blush-500/70 via-blush-700/50 to-lilac-800/50" />
        <FloatingPetals />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white">
          <p className="font-script text-6xl">Forever starts here.</p>
          <p className="mt-3 max-w-sm text-white/85">Save your favourite venues, check live dates and track every booking in one place.</p>
        </div>
      </div>
      <div className="flex flex-col px-4 py-8 sm:px-12">
        <Logo />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">{children}</div>
      </div>
    </div>
  );
}
