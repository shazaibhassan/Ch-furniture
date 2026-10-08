import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, MessageCircle } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { ProductGallery } from "@/components/site/ProductGallery";
import { ShareButton } from "@/components/site/ShareButton";
import { FurnitureCard } from "@/components/site/FurnitureCard";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SectionHeading } from "@/components/site/home/Sections";
import { Reveal } from "@/components/motion/Reveal";
import { getFurnitureBySlug, getRelated } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { parseList, whatsappUrl } from "@/lib/utils";

export const revalidate = 60;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://ch-furniture.vercel.app";

type Params = { slug: string; product: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const item = await getFurnitureBySlug(params.product);
  if (!item) return { title: "Design" };
  const img = item.images.find((i) => i.isPrimary)?.url ?? item.images[0]?.url;
  const title = item.metaTitle || item.name;
  const description = item.metaDescription || item.shortDesc || item.description?.slice(0, 160) || item.name;
  const url = `${SITE}/category/${item.category.slug}/${item.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: img ? [{ url: img, width: 1200, height: 630, alt: title }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: img ? [img] : undefined },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const item = await getFurnitureBySlug(params.product);
  if (!item || !item.published) notFound();

  const [settings, related] = await Promise.all([
    getSettings(),
    getRelated(item.categoryId, item.id, 3),
  ]);

  const features = parseList(item.features);
  const media = [
    ...item.images.map((i) => ({ type: "image" as const, url: i.url, alt: i.alt ?? item.name })),
    ...item.videos.map((v) => ({ type: "video" as const, url: v.url, poster: v.posterUrl ?? undefined })),
  ];

  const waMessage = `Hello CH FURNITURE,\nI'm interested in the ${item.name} shown on your website. Please provide pricing, available wood options, delivery information, and customization options.`;

  const productUrl = `${SITE}/category/${item.category.slug}/${item.slug}`;

  // Product structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.name,
    description: item.shortDesc || item.description || undefined,
    url: productUrl,
    category: item.category.name,
    material: item.woodType || undefined,
    color: item.finish || undefined,
    brand: { "@type": "Brand", name: "CH FURNITURE" },
    image: item.images.map((i) => i.url),
    manufacturer: {
      "@type": "Organization",
      name: "CH FURNITURE",
      url: SITE,
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "PKR",
      seller: { "@type": "Organization", name: "CH FURNITURE" },
    },
  };

  // BreadcrumbList structured data
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Collections", item: `${SITE}/categories` },
      { "@type": "ListItem", position: 3, name: item.category.name, item: `${SITE}/category/${item.category.slug}` },
      { "@type": "ListItem", position: 4, name: item.name, item: productUrl },
    ],
  };

  const specs = [
    { label: "Style", value: item.style },
    { label: "Wood Type", value: item.woodType },
    { label: "Finish", value: item.finish },
    { label: "Dimensions", value: item.dimensions },
  ].filter((s) => s.value);

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="container-px pt-32 pb-6 md:pt-40">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Collections", href: "/categories" },
            { label: item.category.name, href: `/category/${item.category.slug}` },
            { label: item.name },
          ]}
        />
      </div>

      <section className="container-px grid gap-12 pb-20 lg:grid-cols-2 lg:gap-16">
        <Reveal><ProductGallery media={media} name={item.name} /></Reveal>

        <Reveal delay={0.1}>
          <div>
            {item.style && <p className="eyebrow">{item.style}</p>}
            <h1 className="mt-4 font-display text-[clamp(2.2rem,5vw,3.6rem)] font-medium leading-[1.05] text-linen">
              {item.name}
            </h1>
            {item.shortDesc && <p className="mt-4 text-lg text-linenDim">{item.shortDesc}</p>}

            {item.description && (
              <p className="mt-6 leading-relaxed text-linenDim">{item.description}</p>
            )}

            {/* Specs */}
            {specs.length > 0 && (
              <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-walnut/50 bg-walnut/50">
                {specs.map((s) => (
                  <div key={s.label} className="bg-bark p-4">
                    <dt className="text-xs uppercase tracking-wider text-brass">{s.label}</dt>
                    <dd className="mt-1 text-linen">{s.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {/* Features */}
            {features.length > 0 && (
              <ul className="mt-8 space-y-2">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-linenDim">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-brass" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Actions */}
            <div className="mt-10 flex flex-wrap gap-4">
              <a href={whatsappUrl(settings.whatsapp, waMessage)} target="_blank" rel="noopener noreferrer" className="btn-brass">
                <MessageCircle className="h-4 w-4" /> Enquire on WhatsApp
              </a>
              <ShareButton title={item.name} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-bark py-24">
          <div className="container-px">
            <Reveal><SectionHeading eyebrow="You may also like" title="Related designs." /></Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((f, i) => (
                <FurnitureCard key={f.slug} item={f} whatsapp={settings.whatsapp} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </SiteShell>
  );
}
