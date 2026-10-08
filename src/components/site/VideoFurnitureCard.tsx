"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { MessageCircle, ArrowUpRight, Play } from "lucide-react";
import { motion } from "framer-motion";
import { whatsappUrl } from "@/lib/utils";

export type VideoFurnitureCardData = {
  slug: string;
  name: string;
  style?: string | null;
  woodType?: string | null;
  shortDesc?: string | null;
  categorySlug: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  videoPosterUrl?: string | null;
};

export function VideoFurnitureCard({
  item,
  whatsapp,
  index = 0,
}: {
  item: VideoFurnitureCardData;
  whatsapp: string;
  index?: number;
}) {
  const detailHref = `/category/${item.categorySlug}/${item.slug}`;
  const waMessage = `Hello CH FURNITURE,\nI'm interested in the ${item.name} shown on your website. Please provide pricing, available wood options, delivery information, and customization options.`;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  const hasVideo = !!item.videoUrl && !videoError;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative overflow-hidden rounded-sm border border-walnut/50 bg-bark"
    >
      <Link href={detailHref} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-walnut">

          {hasVideo ? (
            <>
              <video
                ref={videoRef}
                src={item.videoUrl!}
                poster={item.videoPosterUrl || item.imageUrl || undefined}
                autoPlay
                loop
                muted
                playsInline
                onError={() => setVideoError(true)}
                className="absolute inset-0 h-full w-full object-cover"
              />
              {/* Play icon overlay so users know it's a video */}
              <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-espresso/70 px-3 py-1 text-[10px] uppercase tracking-widest text-brass backdrop-blur">
                <Play className="h-3 w-3 fill-brass" /> Video
              </span>
            </>
          ) : item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-linenDim">No media</div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/10 to-transparent opacity-80" />

          {/* Style chip (only when no video badge) */}
          {item.style && !hasVideo && (
            <span className="absolute left-4 top-4 rounded-full bg-espresso/70 px-3 py-1 text-[10px] uppercase tracking-widest2 text-brass backdrop-blur">
              {item.style}
            </span>
          )}

          {/* Bottom content */}
          <div className="absolute inset-x-0 bottom-0 p-5">
            <h3 className="font-display text-2xl font-medium text-linen">{item.name}</h3>
            {item.woodType && (
              <p className="mt-1 text-xs uppercase tracking-wider text-linenDim">{item.woodType}</p>
            )}
            {item.shortDesc && (
              <p className="mt-2 line-clamp-2 text-sm text-linenDim/90">{item.shortDesc}</p>
            )}
          </div>
        </div>
      </Link>

      {/* Action row */}
      <div className="flex items-stretch border-t border-walnut/50">
        <a
          href={whatsappUrl(whatsapp, waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 py-3.5 text-xs uppercase tracking-wider text-[#4ade80] transition-colors hover:bg-[#25D366]/10"
        >
          <MessageCircle className="h-4 w-4" /> Ask on WhatsApp
        </a>
        <Link
          href={detailHref}
          className="flex flex-1 items-center justify-center gap-2 border-l border-walnut/50 py-3.5 text-xs uppercase tracking-wider text-brass transition-colors hover:bg-brass/10"
        >
          Enquire <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.article>
  );
}
