"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TreePine, Hammer, Ruler, ShieldCheck, Plus, Minus, Star, Quote } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";

/* ----------------------------- Section heading ---------------------------- */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className={`eyebrow ${align === "center" ? "justify-center" : ""}`}>{eyebrow}</p>
      <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.4rem)] font-medium leading-tight text-linen">
        {title}
      </h2>
      {description && <p className="mt-4 text-base text-linenDim">{description}</p>}
    </div>
  );
}

/* --------------------------------- Stats ---------------------------------- */
export function Stats({
  years,
  projects,
  clients,
  craftsmen,
}: {
  years: number;
  projects: number;
  clients: number;
  craftsmen: number;
}) {
  const items = [
    { value: years, suffix: "+", label: "Years of Craft" },
    { value: projects, suffix: "+", label: "Pieces Delivered" },
    { value: clients, suffix: "+", label: "Happy Clients" },
    { value: craftsmen, suffix: "", label: "Master Craftsmen" },
  ];
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-walnut/50 bg-walnut/50 md:grid-cols-4">
      {items.map((s, i) => (
        <Reveal key={i} delay={i * 0.08} className="bg-bark p-8 text-center">
          <div className="font-display text-5xl font-semibold text-brass">
            <Counter value={s.value} suffix={s.suffix} />
          </div>
          <p className="mt-2 text-xs uppercase tracking-widest2 text-linenDim">{s.label}</p>
        </Reveal>
      ))}
    </div>
  );
}

/* ------------------------------- Why choose ------------------------------- */
export function WhyUs() {
  const items = [
    { icon: TreePine, title: "Premium Solid Wood", body: "Only the finest seasoned hardwoods — selected, dried and graded for strength and grain." },
    { icon: Hammer, title: "Hand Craftsmanship", body: "Traditional joinery and hand-carving passed down through generations of artisans." },
    { icon: Ruler, title: "Made to Measure", body: "Every piece can be tailored to your dimensions, finish and upholstery." },
    { icon: ShieldCheck, title: "Built to Last", body: "Durable construction and premium finishing designed to age beautifully for decades." },
  ];
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it, i) => (
        <Reveal key={i} delay={i * 0.08}>
          <div className="h-full rounded-sm border border-walnut/50 bg-bark p-7 transition-colors hover:border-brass/50">
            <it.icon className="h-8 w-8 text-brass" strokeWidth={1.4} />
            <h3 className="mt-5 font-display text-2xl text-linen">{it.title}</h3>
            <p className="mt-2 text-sm text-linenDim">{it.body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* -------------------------------- Process --------------------------------- */
export function Process() {
  const steps = [
    { n: "01", title: "Consultation & Design", body: "We discuss your space, style and requirements, then translate them into a detailed design." },
    { n: "02", title: "Wood Selection", body: "Premium seasoned timber is hand-selected and graded for the piece." },
    { n: "03", title: "Crafting & Carving", body: "Skilled artisans cut, join and hand-carve each component with precision." },
    { n: "04", title: "Finishing & Delivery", body: "Premium finishing, quality checks, and careful delivery to your door." },
  ];
  return (
    <ol className="grid gap-px overflow-hidden rounded-sm border border-walnut/50 bg-walnut/50 md:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, i) => (
        <Reveal key={i} delay={i * 0.08} className="bg-bark p-8">
          <li>
            <span className="font-display text-5xl font-light text-brass/70">{s.n}</span>
            <h3 className="mt-4 font-display text-2xl text-linen">{s.title}</h3>
            <p className="mt-2 text-sm text-linenDim">{s.body}</p>
          </li>
        </Reveal>
      ))}
    </ol>
  );
}

/* ------------------------------ Testimonials ------------------------------ */
export type TestimonialData = { author: string; role?: string | null; quote: string; rating: number };

export function Testimonials({ items }: { items: TestimonialData[] }) {
  if (!items.length) return null;
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((t, i) => (
        <Reveal key={i} delay={(i % 3) * 0.08}>
          <figure className="flex h-full flex-col rounded-sm border border-walnut/50 bg-bark p-7">
            <Quote className="h-7 w-7 text-brass/60" />
            <blockquote className="mt-4 flex-1 font-display text-xl leading-relaxed text-linen">
              “{t.quote}”
            </blockquote>
            <div className="mt-5 flex items-center gap-1 text-brass">
              {Array.from({ length: t.rating }).map((_, k) => (
                <Star key={k} className="h-4 w-4 fill-brass" />
              ))}
            </div>
            <figcaption className="mt-3">
              <p className="font-medium text-linen">{t.author}</p>
              {t.role && <p className="text-xs uppercase tracking-wider text-linenDim">{t.role}</p>}
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}

/* ---------------------------------- FAQ ----------------------------------- */
const FAQS = [
  { q: "Do you make fully custom furniture?", a: "Yes. Custom design is our specialty — share your dimensions, style and finish preferences and we build to order." },
  { q: "Which woods do you work with?", a: "We work with premium seasoned hardwoods including Sheesham (rosewood), walnut, teak and oak, plus quality engineered options where suitable." },
  { q: "Do you ship outside Sialkot or Pakistan?", a: "Yes, we serve clients across Pakistan and arrange export for international buyers. Message us on WhatsApp for delivery details." },
  { q: "How do I get a price?", a: "Browse the collections and tap “Ask on WhatsApp” on any design, or use the contact form. We'll reply with pricing, wood options and timelines." },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-walnut/50 border-y border-walnut/50">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 py-6 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-display text-xl text-linen md:text-2xl">{f.q}</span>
              <span className="shrink-0 text-brass">{isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}</span>
            </button>
            <motion.div
              initial={false}
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              className="overflow-hidden"
            >
              <p className="pb-6 text-linenDim">{f.a}</p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------- CTA ----------------------------------- */
export function CTA() {
  return (
    <Reveal>
      <div className="relative overflow-hidden rounded-sm border border-brass/30 bg-walnut p-10 text-center md:p-16">
        <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.12] mix-blend-overlay" />
        <p className="eyebrow justify-center">Let's build something timeless</p>
        <h2 className="mx-auto mt-5 max-w-2xl font-display text-[clamp(2rem,4.5vw,3.4rem)] font-medium leading-tight text-linen">
          Have a piece in mind? Tell us about your project.
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/contact" className="btn-brass">Get in Touch</Link>
          <Link href="/categories" className="btn-ghost">Browse Collections</Link>
        </div>
      </div>
    </Reveal>
  );
}
