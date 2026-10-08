import { v2 as cloudinary } from "cloudinary";

// Server-side Cloudinary config. Used for deletions and signed operations.
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/** Delete an asset from Cloudinary by public_id. */
export async function deleteAsset(
  publicId: string,
  resourceType: "image" | "video" = "image"
) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error("Cloudinary delete failed:", err);
  }
}

/**
 * Return a transformed Cloudinary URL (auto format + quality + width).
 * Falls back to the original URL if it isn't a Cloudinary URL.
 */
export function cldOptimize(url: string, width = 1200): string {
  if (!url.includes("/upload/")) return url;
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}
