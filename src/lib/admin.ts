"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

function uploadToCloudinary(buffer: Buffer): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "ch-furniture", resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

function detectCategory(filename: string) {
  const lowerName = filename.toLowerCase();
  if (lowerName.includes("sofa")) return "Sofa";
  if (lowerName.includes("bed")) return "Bed";
  if (lowerName.includes("chair")) return "Chair";
  if (lowerName.includes("table")) return "Table";
  if (lowerName.includes("almari") || lowerName.includes("wardrobe")) return "Almari";
  return "Other";
}

function titleFromFilename(filename: string) {
  const withoutExtension = filename.replace(/\.[^/.]+$/, "");
  return withoutExtension
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\w\S*/g, (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

function uniqueSlug(title: string) {
  const random = Math.random().toString(36).slice(2, 8);
  return `${slugify(title)}-${Date.now()}-${random}`;
}

export async function bulkUploadAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const files = formData.getAll("files").filter((value): value is File => value instanceof File);
  let count = 0;

  for (const file of files) {
    try {
      if (!file.type.startsWith("image/") || file.size === 0) continue;

      const uploaded = await uploadToCloudinary(Buffer.from(await file.arrayBuffer()));
      const categoryName = detectCategory(file.name);
      const categorySlug = slugify(categoryName);
      const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: { name: categoryName },
        create: { name: categoryName, slug: categorySlug },
      });
      const title = titleFromFilename(file.name);
      const furniture = await prisma.furniture.create({
        data: {
          name: title || "Untitled Furniture",
          slug: uniqueSlug(title || "untitled-furniture"),
          categoryId: category.id,
          description: `Premium quality ${categoryName} from CH Furniture. Made with high-quality wood and crafted for lasting beauty.`,
          published: true,
          images: {
            create: {
              url: uploaded.url,
              publicId: uploaded.publicId,
              alt: title || categoryName,
              isPrimary: true,
              sortOrder: 0,
            },
          },
        },
      });

      if (furniture.id) count += 1;
    } catch (error) {
      console.error(`Bulk upload failed for ${file.name}:`, error);
    }
  }

  revalidatePath("/admin/furniture");
  revalidatePath("/collections");
  revalidatePath("/categories");
  return { success: true, count };
}
