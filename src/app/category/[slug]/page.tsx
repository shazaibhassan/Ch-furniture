import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { FurnitureCard } from "@/components/site/FurnitureCard";
import { VideoFurnitureCard } from "@/components/site/VideoFurnitureCard";
import { CategoryFilters } from "@/components/site/CategoryFilters";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { getCategoryWithFurniture } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://ch-furniture.vercel.app";

type Params = { slug: string };
type Search = { style?: string; wood?: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const cat = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!cat) return { title: "Collection" };
  const title = cat.metaTitle || cat.name;
  const description = cat.metaDescription || cat.description || `Browse our ${cat.name} collection — premium handcrafted wooden furniture by CH FURNITURE, Sialkot, Pakistan.`;
  const url = `${SITE}/category/${cat.slug}`;
  const image = cat.bannerUrl || cat.thumbUrl || `${SITE}/og-default.jpg`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}) {
  const [settings, data] = await Promise.all([
    getSettings(),
    getCategoryWithFurniture(params.slug, {
      style: searchParams.style,
      woodType: searchParams.wood,
    }),
  ]);

  if (!data) notFound();
  const { category, furniture } = data;

  const pageUrl = `${SITE}/category/${category.slug}`;

  // BreadcrumbList structured data
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Collections", item: `${SITE}/categories` },
      { "@type": "ListItem", position: 3, name: category.name, item: pageUrl },
    ],
  };

  // ItemList structured data for product grid
  const itemListLd = furniture.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: category.name,
    description: category.description || undefined,
    url: pageUrl,
    numberOfItems: furniture.length,
    itemListElement: furniture.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE}/category/${f.categorySlug}/${f.slug}`,
      name: f.name,
    })),
  } : null;

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {itemListLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />}

      {/* Banner / Hero Video */}
      <section className="relative h-[52vh] min-h-[380px] overflow-hidden">
        {category.heroVideoUrl ? (
          <video
            src={category.heroVideoUrl}
            poster={category.heroVideoPosterUrl || undefined}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Image
            src={category.bannerUrl || "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=2000&q=80"}
            alt={category.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/50 to-espresso/30" />
        <div className="container-px relative flex h-full flex-col justify-end pb-12">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Collections", href: "/categories" },
              { label: category.name },
            ]}
          />
          <h1 className="mt-4 font-display text-[clamp(2.4rem,7vw,5rem)] font-medium leading-[1] text-linen">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-3 max-w-2xl text-linenDim">{category.description}</p>
          )}
        </div>
      </section>

      {/* Filters + grid */}
      <section className="container-px py-14">
        <Suspense fallback={null}>
          <CategoryFilters />
        </Suspense>

        <div className="mt-10">
          {furniture.length === 0 ? (
            <div className="rounded-sm border border-walnut/50 bg-bark p-16 text-center">
              <p className="font-display text-2xl text-linen">No designs match these filters yet.</p>
              <p className="mt-2 text-linenDim">Try clearing the filters, or message us — we build custom pieces to order.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {furniture.map((f, i) =>
                category.videoMode ? (
                  <VideoFurnitureCard key={f.slug} item={f} whatsapp={settings.whatsapp} index={i} />
                ) : (
                  <FurnitureCard key={f.slug} item={f} whatsapp={settings.whatsapp} index={i} />
                )
              )}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
