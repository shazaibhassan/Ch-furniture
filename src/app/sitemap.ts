import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/queries";

const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://ch-furniture.vercel.app";

const staticRoutes = ["", "/about", "/categories", "/contact", "/search"].map((p) => ({
  url: `${SITE}${p}`,
  lastModified: new Date(),
  changeFrequency: "weekly" as const,
  priority: p === "" ? 1 : 0.7,
}));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Race the DB call against a 6-second timeout so Google always gets a valid XML response
  const fallback = { cats: [] as any[], items: [] as any[] };
  const timeoutPromise = new Promise<typeof fallback>((resolve) =>
    setTimeout(() => resolve(fallback), 6000)
  );

  const { cats, items } = await Promise.race([
    getAllSlugs().catch(() => fallback),
    timeoutPromise,
  ]);

  const categoryRoutes = cats.map((c: any) => ({
    url: `${SITE}/category/${c.slug}`,
    lastModified: c.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const productRoutes = items.map((i: any) => ({
    url: `${SITE}/category/${i.category.slug}/${i.slug}`,
    lastModified: i.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
