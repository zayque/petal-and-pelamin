import type { Metadata } from "next";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="container-pp py-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="eyebrow">Say hello</p>
          <h1 className="mt-3 text-5xl font-semibold sm:text-6xl">
            Let’s plan something <span className="font-script font-normal text-blush-500">lovely</span>
          </h1>
          <p className="mt-5 max-w-md leading-relaxed text-muted">
            Tell us a little about your day: the date, guest count and the vibe you’re dreaming of. A planner will reply within one working
            day.
          </p>
          <dl className="mt-10 space-y-5">
            {[
              ["Studio", "Seksyen 13, Shah Alam, Selangor"],
              ["Hours", "Mon–Sat · 10am – 7pm"],
              ["Email", "hello@petalpelamin.my"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-start gap-4">
                <span className="mt-1 size-2.5 shrink-0 rounded-full bg-blush-400" />
                <div>
                  <dt className="text-xs font-semibold tracking-wider text-muted uppercase">{k}</dt>
                  <dd className="text-ink">{v}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
        <div className="card p-6 sm:p-10">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
