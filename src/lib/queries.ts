import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

function toCard(f: any) {
  const primary = f.images?.find((i: any) => i.isPrimary) ?? f.images?.[0];
  const firstVideo = f.videos?.[0];
  return {
    slug: f.slug,
    name: f.name,
    style: f.style,
    woodType: f.woodType,
    shortDesc: f.shortDesc,
    categorySlug: f.category?.slug ?? "",
    imageUrl: primary?.url ?? null,
    videoUrl: firstVideo?.url ?? null,
    videoPosterUrl: firstVideo?.posterUrl ?? null,
  };
}

export const getFeaturedCategories = unstable_cache(
  async (limit = 6) => {
    const cats = await prisma.category.findMany({
      where: { featured: true },
      orderBy: { sortOrder: "asc" },
      take: limit,
      select: {
        slug: true,
        name: true,
        description: true,
        thumbUrl: true,
        _count: { select: { furniture: { where: { published: true } } } },
      },
    });
    return cats.map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.description,
      thumbUrl: c.thumbUrl,
      count: c._count.furniture,
    }));
  },
  ["featured-categories"],
  { revalidate: 60, tags: ["categories"] }
);

export const getAllCategories = unstable_cache(
  async () => {
    const cats = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: {
        slug: true,
        name: true,
        description: true,
        thumbUrl: true,
        _count: { select: { furniture: { where: { published: true } } } },
      },
    });
    return cats.map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.description,
      thumbUrl: c.thumbUrl,
      count: c._count.furniture,
    }));
  },
  ["all-categories"],
  { revalidate: 60, tags: ["categories"] }
);

export const getFeaturedFurniture = unstable_cache(
  async (limit = 6) => {
    const items = await prisma.furniture.findMany({
      where: { published: true, OR: [{ featured: true }, { bestSeller: true }] },
      orderBy: [{ bestSeller: "desc" }, { sortOrder: "asc" }],
      take: limit,
      include: {
        images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }], take: 1 },
        category: { select: { slug: true, name: true } },
      },
    });
    return items.map(toCard);
  },
  ["featured-furniture"],
  { revalidate: 60, tags: ["furniture"] }
);

export const getTestimonials = unstable_cache(
  async (limit = 6) => {
    return prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      take: limit,
    });
  },
  ["testimonials"],
  { revalidate: 300, tags: ["testimonials"] }
);

export async function getCategoryWithFurniture(
  slug: string,
  filters?: { style?: string; woodType?: string }
) {
  const cacheKey = `category-${slug}-${filters?.style ?? ""}-${filters?.woodType ?? ""}`;
  return unstable_cache(
    async () => {
      const category = await prisma.category.findUnique({
        where: { slug },
        include: {
          furniture: {
            where: {
              published: true,
              ...(filters?.style ? { style: filters.style } : {}),
              ...(filters?.woodType ? { woodType: filters.woodType } : {}),
            },
            orderBy: { sortOrder: "asc" },
            include: {
              images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }], take: 1 },
              videos: { orderBy: { sortOrder: "asc" }, take: 1 },
              category: { select: { slug: true, name: true } },
            },
          },
        },
      });
      if (!category) return null;
      const { furniture, ...cat } = category;
      return { category: cat, furniture: furniture.map(toCard) };
    },
    [cacheKey],
    { revalidate: 60, tags: ["categories", "furniture"] }
  )();
}

export async function getFurnitureBySlug(slug: string) {
  return unstable_cache(
    async () =>
      prisma.furniture.findUnique({
        where: { slug },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          videos: { orderBy: { sortOrder: "asc" } },
          category: true,
        },
      }),
    [`furniture-${slug}`],
    { revalidate: 60, tags: ["furniture"] }
  )();
}

export async function getRelated(categoryId: string, excludeId: string, limit = 4) {
  return unstable_cache(
    async () => {
      const items = await prisma.furniture.findMany({
        where: { categoryId, published: true, id: { not: excludeId } },
        take: limit,
        include: {
          images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }], take: 1 },
          category: { select: { slug: true, name: true } },
        },
      });
      return items.map(toCard);
    },
    [`related-${categoryId}-${excludeId}`],
    { revalidate: 60, tags: ["furniture"] }
  )();
}

export async function searchFurniture(q: string) {
  if (!q.trim()) return [];
  const items = await prisma.furniture.findMany({
    where: {
      published: true,
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { style: { contains: q, mode: "insensitive" } },
        { woodType: { contains: q, mode: "insensitive" } },
        { shortDesc: { contains: q, mode: "insensitive" } },
        { category: { name: { contains: q, mode: "insensitive" } } },
      ],
    },
    take: 40,
    include: {
      images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }], take: 1 },
      category: { select: { slug: true, name: true } },
    },
  });
  return items.map(toCard);
}

export async function getAllSlugs() {
  const [cats, items] = await Promise.all([
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.furniture.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true, category: { select: { slug: true } } },
    }),
  ]);
  return { cats, items };
}
