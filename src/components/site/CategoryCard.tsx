"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export type CategoryCardData = {
  slug: string;
  name: string;
  description?: string | null;
  thumbUrl?: string | null;
  count?: number;
};

export function CategoryCard({ category, index = 0 }: { category: CategoryCardData; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        href={`/category/${category.slug}`}
        className="group relative block aspect-[3/4] overflow-hidden rounded-sm border border-walnut/50 bg-walnut"
      >
        {category.thumbUrl ? (
          <Image
            src={category.thumbUrl}
            alt={category.name}
            fill
            loading="lazy"
            quality={75}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-linenDim">{category.name}</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="font-display text-3xl font-medium text-linen">{category.name}</h3>
              {typeof category.count === "number" && (
                <p className="mt-1 text-xs uppercase tracking-wider text-brass">{category.count} designs</p>
              )}
            </div>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brass/60 text-brass transition-all duration-300 group-hover:bg-brass group-hover:text-espresso">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
