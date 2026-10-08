"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";

/**
 * Luxury hero: a dark, grain-textured stage with a seasoned-wood image,
 * an oversized serif headline that reveals on load, and a parallax drift.
 */
export function Hero({ heroImage }: { heroImage?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const overlay = useTransform(scrollYProgress, [0, 1], [0.55, 0.85]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] overflow-hidden">
      {/* Background image with parallax */}
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        <Image
          src={heroImage || "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1280&q=75&fm=webp"}
          alt="Handcrafted wooden furniture by CH FURNITURE"
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover"
        />
        <motion.div style={{ opacity: overlay }} className="absolute inset-0 bg-espresso" />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/30 to-espresso/60" />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-[0.15] mix-blend-overlay" />

      <div className="container-px flex h-full flex-col justify-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="eyebrow"
        >
          № 001 — Sialkot, Pakistan
        </motion.p>

        <h1 className="mt-6 max-w-4xl font-display text-[clamp(2.75rem,8vw,6.5rem)] font-medium leading-[0.95] text-linen">
          {["Crafting premium", "wooden furniture with", "timeless elegance."].map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="block"
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-8 max-w-xl text-base text-linenDim sm:text-lg"
        >
          Solid-wood sofas, beds, dining sets and intricate hand-carved pieces — built by
          skilled craftsmen to last generations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <Link href="/categories" className="btn-brass">View Collections</Link>
          <Link href="/contact" className="btn-ghost">Request a Quote</Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-brass"
      >
        <ArrowDown className="h-5 w-5 animate-bounce" />
      </motion.div>
    </section>
  );
}
