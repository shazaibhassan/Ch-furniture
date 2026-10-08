"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { deleteAsset } from "@/lib/cloudinary";
import { slugify } from "@/lib/utils";

/** Guard: throw if not authenticated. */
async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
}

/* ------------------------------- Categories ------------------------------- */
const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().optional(),
  bannerUrl: z.string().optional(),
  thumbUrl: z.string().optional(),
  heroVideoUrl: z.string().optional(),
  heroVideoPosterUrl: z.string().optional(),
  sortOrder: z.coerce.number().int().default(0),
  featured: z.coerce.boolean().default(false),
  videoMode: z.coerce.boolean().default(false),
});

export async function upsertCategory(id: string | null, formData: FormData) {
  await requireAdmin();
  const raw = Object.fromEntries(formData);
  const data = categorySchema.parse({
    ...raw,
    featured: formData.get("featured") === "on",
    videoMode: formData.get("videoMode") === "on",
  });
  const slug = data.slug?.trim() ? slugify(data.slug) : slugify(data.name);

  if (id) {
    await prisma.category.update({ where: { id }, data: { ...data, slug } });
  } else {
    await prisma.category.create({ data: { ...data, slug } });
  }
  revalidateTag("categories");
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/");
  revalidatePath(`/category/${slug}`);
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  // Cascade deletes furniture + their images/videos in DB; clean Cloudinary too.
  const cat = await prisma.category.findUnique({
    where: { id },
    include: { furniture: { include: { images: true, videos: true } } },
  });
  if (cat) {
    for (const f of cat.furniture) {
      for (const img of f.images) await deleteAsset(img.publicId, "image");
      for (const vid of f.videos) if (vid.publicId) await deleteAsset(vid.publicId, "video");
    }
  }
  await prisma.category.delete({ where: { id } });
  revalidateTag("categories");
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
}

/* -------------------------------- Furniture ------------------------------- */
const furnitureSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  categoryId: z.string().min(1),
  style: z.string().optional(),
  woodType: z.string().optional(),
  finish: z.string().optional(),
  dimensions: z.string().optional(),
  shortDesc: z.string().optional(),
  description: z.string().optional(),
  features: z.string().optional(), // newline-separated in the form
  sortOrder: z.coerce.number().int().default(0),
});

export async function upsertFurniture(
  id: string | null,
  formData: FormData,
  // images/videos are arrays of {url, publicId} captured client-side from Cloudinary
  media: { images: { url: string; publicId: string }[]; videos: { url: string; publicId: string; posterUrl?: string }[] }
) {
  await requireAdmin();
  const raw = Object.fromEntries(formData);
  const parsed = furnitureSchema.parse(raw);

  const featuresArr = (parsed.features || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const base = {
    name: parsed.name,
    slug: parsed.slug?.trim() ? slugify(parsed.slug) : slugify(parsed.name),
    categoryId: parsed.categoryId,
    style: parsed.style || null,
    woodType: parsed.woodType || null,
    finish: parsed.finish || null,
    dimensions: parsed.dimensions || null,
    shortDesc: parsed.shortDesc || null,
    description: parsed.description || null,
    features: JSON.stringify(featuresArr),
    sortOrder: parsed.sortOrder,
    featured: formData.get("featured") === "on",
    bestSeller: formData.get("bestSeller") === "on",
    published: formData.get("published") !== "off",
  };

  let furnitureId = id;
  if (id) {
    await prisma.furniture.update({ where: { id }, data: base });
  } else {
    const created = await prisma.furniture.create({ data: base });
    furnitureId = created.id;
  }

  // Append newly uploaded media (existing media kept; deletions handled separately).
  if (furnitureId) {
    if (media.images.length) {
      const existingCount = await prisma.image.count({ where: { furnitureId } });
      await prisma.image.createMany({
        data: media.images.map((m, i) => ({
          furnitureId: furnitureId!,
          url: m.url,
          publicId: m.publicId,
          isPrimary: existingCount === 0 && i === 0,
          sortOrder: existingCount + i,
        })),
      });
    }
    if (media.videos.length) {
      await prisma.video.createMany({
        data: media.videos.map((m, i) => ({
          furnitureId: furnitureId!,
          url: m.url,
          publicId: m.publicId,
          posterUrl: m.posterUrl || null,
          sortOrder: i,
        })),
      });
    }
  }

  // Also revalidate the category page so video grids update immediately
  if (furnitureId) {
    const item = await prisma.furniture.findUnique({
      where: { id: furnitureId },
      include: { category: { select: { slug: true } } },
    });
    if (item?.category?.slug) revalidatePath(`/category/${item.category.slug}`);
  }
  revalidateTag("furniture");
  revalidatePath("/admin/furniture");
  revalidatePath("/");
  return furnitureId;
}

export async function deleteFurniture(id: string) {
  await requireAdmin();
  const f = await prisma.furniture.findUnique({
    where: { id },
    include: { images: true, videos: true },
  });
  if (f) {
    for (const img of f.images) await deleteAsset(img.publicId, "image");
    for (const vid of f.videos) if (vid.publicId) await deleteAsset(vid.publicId, "video");
  }
  await prisma.furniture.delete({ where: { id } });
  revalidateTag("furniture");
  revalidatePath("/admin/furniture");
}

export async function deleteImage(imageId: string) {
  await requireAdmin();
  const img = await prisma.image.findUnique({ where: { id: imageId } });
  if (img) {
    await deleteAsset(img.publicId, "image");
    await prisma.image.delete({ where: { id: imageId } });
  }
  revalidatePath("/admin/furniture");
}

export async function setPrimaryImage(furnitureId: string, imageId: string) {
  await requireAdmin();
  await prisma.image.updateMany({ where: { furnitureId }, data: { isPrimary: false } });
  await prisma.image.update({ where: { id: imageId }, data: { isPrimary: true } });
  revalidatePath("/admin/furniture");
}

export async function deleteVideo(videoId: string) {
  await requireAdmin();
  const vid = await prisma.video.findUnique({ where: { id: videoId } });
  if (vid?.publicId) await deleteAsset(vid.publicId, "video");
  await prisma.video.delete({ where: { id: videoId } });
  revalidatePath("/admin/furniture");
}

/* -------------------------------- Settings -------------------------------- */
export async function updateSettings(formData: FormData) {
  await requireAdmin();
  const get = (k: string) => (formData.get(k) as string | null) ?? undefined;
  const num = (k: string) => {
    const v = formData.get(k);
    return v ? parseInt(String(v), 10) : undefined;
  };

  await prisma.settings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton" },
    update: {
      brandName: get("brandName"),
      tagline: get("tagline"),
      description: get("description"),
      address: get("address"),
      phone: get("phone"),
      whatsapp: get("whatsapp"),
      email: get("email"),
      businessHours: get("businessHours"),
      mapEmbedUrl: get("mapEmbedUrl"),
      whatsappMessage: get("whatsappMessage"),
      facebook: get("facebook"),
      instagram: get("instagram"),
      youtube: get("youtube"),
      tiktok: get("tiktok"),
      linkedin: get("linkedin"),
      seoTitle: get("seoTitle"),
      seoDescription: get("seoDescription"),
      seoKeywords: get("seoKeywords"),
      ogImageUrl: get("ogImageUrl"),
      aboutStory: get("aboutStory"),
      aboutMission: get("aboutMission"),
      aboutVision: get("aboutVision"),
      aboutExperience: get("aboutExperience"),
      yearsExperience: num("yearsExperience"),
      projectsCompleted: num("projectsCompleted"),
      happyClients: num("happyClients"),
      craftsmenCount: num("craftsmenCount"),
    },
  });
  revalidateTag("settings");
  revalidatePath("/", "layout");
}

/* ------------------------------ Testimonials ------------------------------ */
export async function upsertTestimonial(id: string | null, formData: FormData) {
  await requireAdmin();
  const data = {
    author: String(formData.get("author")),
    role: (formData.get("role") as string) || null,
    quote: String(formData.get("quote")),
    rating: parseInt(String(formData.get("rating") || "5"), 10),
    published: formData.get("published") !== "off",
    sortOrder: parseInt(String(formData.get("sortOrder") || "0"), 10),
  };
  if (id) await prisma.testimonial.update({ where: { id }, data });
  else await prisma.testimonial.create({ data });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
}

/* -------------------------------- Messages -------------------------------- */
export async function markMessageRead(id: string, read: boolean) {
  await requireAdmin();
  await prisma.contactMessage.update({ where: { id }, data: { read } });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
}
