"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Star, Film } from "lucide-react";
import { MediaUploader, type UploadedMedia } from "@/components/admin/MediaUploader";
import { upsertCategory, deleteCategory } from "@/app/actions/admin";

type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  bannerUrl: string | null;
  thumbUrl: string | null;
  heroVideoUrl: string | null;
  heroVideoPosterUrl: string | null;
  sortOrder: number;
  featured: boolean;
  videoMode: boolean;
  _count?: { furniture: number };
};

const field =
  "w-full rounded-sm border border-walnut/60 bg-espresso px-4 py-2.5 text-linen placeholder:text-linenDim/60 focus:border-brass";
const label = "block text-xs uppercase tracking-wider text-brass mb-1.5";

export function CategoriesManager({ categories }: { categories: Category[] }) {
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);

  const showForm = creating || editing !== null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl text-linen">Categories</h1>
          <p className="mt-1 text-linenDim">{categories.length} categories</p>
        </div>
        {!showForm && (
          <button onClick={() => setCreating(true)} className="btn-brass">
            <Plus className="h-4 w-4" /> Add Category
          </button>
        )}
      </div>

      {showForm ? (
        <CategoryForm
          category={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <div key={c.id} className="overflow-hidden rounded-sm border border-walnut/50 bg-bark">
              <div className="relative aspect-video bg-walnut">
                {c.thumbUrl || c.bannerUrl ? (
                  <Image src={(c.thumbUrl || c.bannerUrl)!} alt={c.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-linenDim">No image</div>
                )}
                {c.featured && (
                  <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-espresso/80 px-2 py-1 text-[10px] uppercase tracking-wider text-brass">
                    <Star className="h-3 w-3 fill-brass" /> Featured
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-display text-xl text-linen">{c.name}</h3>
                <p className="text-xs text-linenDim">/{c.slug} · {c._count?.furniture ?? 0} items</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setEditing(c)} className="flex flex-1 items-center justify-center gap-1.5 rounded-sm border border-walnut/60 py-2 text-xs text-linenDim hover:text-linen">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </button>
                  <DeleteButton id={c.id} name={c.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryForm({ category, onClose }: { category: Category | null; onClose: () => void }) {
  const [banner, setBanner] = useState(category?.bannerUrl || "");
  const [thumb, setThumb] = useState(category?.thumbUrl || "");
  const [heroVideo, setHeroVideo] = useState(category?.heroVideoUrl || "");
  const [heroVideoPoster, setHeroVideoPoster] = useState(category?.heroVideoPosterUrl || "");
  const [saving, setSaving] = useState(false);

  async function action(formData: FormData) {
    setSaving(true);
    formData.set("bannerUrl", banner);
    formData.set("thumbUrl", thumb);
    formData.set("heroVideoUrl", heroVideo);
    formData.set("heroVideoPosterUrl", heroVideoPoster);
    try {
      await upsertCategory(category?.id ?? null, formData);
      toast.success(category ? "Category updated" : "Category created");
      onClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-8 rounded-sm border border-walnut/50 bg-bark p-7">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-linen">{category ? "Edit Category" : "New Category"}</h2>
        <button onClick={onClose} aria-label="Close"><X className="h-5 w-5 text-linenDim hover:text-linen" /></button>
      </div>

      <form action={action} className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label}>Name</label>
            <input name="name" defaultValue={category?.name} required className={field} />
          </div>
          <div>
            <label className={label}>Slug (optional)</label>
            <input name="slug" defaultValue={category?.slug} placeholder="auto from name" className={field} />
          </div>
        </div>

        <div>
          <label className={label}>Description</label>
          <textarea name="description" defaultValue={category?.description ?? ""} rows={3} className={field} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label}>Sort order</label>
            <input name="sortOrder" type="number" defaultValue={category?.sortOrder ?? 0} className={field} />
          </div>
          <div className="flex flex-col gap-3 pt-7">
            <label className="flex items-center gap-3 text-sm text-linen">
              <input name="featured" type="checkbox" defaultChecked={category?.featured} className="h-4 w-4 accent-brass" />
              Featured on homepage
            </label>
            <label className="flex items-center gap-3 text-sm text-linen">
              <input name="videoMode" type="checkbox" defaultChecked={category?.videoMode} className="h-4 w-4 accent-brass" />
              <span>Video grid mode <span className="text-xs text-linenDim">(shows autoplaying videos instead of images)</span></span>
            </label>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label}>Thumbnail (card image)</label>
            {thumb && <div className="relative mb-2 aspect-video overflow-hidden rounded-sm"><Image src={thumb} alt="" fill className="object-cover" /></div>}
            <MediaUploader resourceType="image" onUploaded={(m: UploadedMedia[]) => m[0] && setThumb(m[0].url)} />
          </div>
          <div>
            <label className={label}>Banner (category page hero image)</label>
            {banner && <div className="relative mb-2 aspect-video overflow-hidden rounded-sm"><Image src={banner} alt="" fill className="object-cover" /></div>}
            <MediaUploader resourceType="image" onUploaded={(m: UploadedMedia[]) => m[0] && setBanner(m[0].url)} />
          </div>
        </div>

        <div className="rounded-sm border border-brass/20 bg-espresso/40 p-4">
          <label className="mb-1.5 flex items-center gap-2 text-xs uppercase tracking-wider text-brass">
            <Film className="h-3.5 w-3.5" /> Hero Video (auto-plays when customer opens this category)
          </label>
          <p className="mb-3 text-xs text-linenDim">If set, this video plays automatically at the top of the category page instead of the banner image. Upload an MP4 video.</p>
          {heroVideo ? (
            <div className="mb-3">
              <video src={heroVideo} poster={heroVideoPoster || undefined} className="w-full max-h-48 rounded-sm object-cover" controls />
              <button type="button" onClick={() => { setHeroVideo(""); setHeroVideoPoster(""); }} className="mt-1.5 text-xs text-red-400 hover:text-red-300">
                Remove video
              </button>
            </div>
          ) : null}
          <MediaUploader
            resourceType="video"
            onUploaded={(m: UploadedMedia[]) => {
              if (m[0]) {
                setHeroVideo(m[0].url);
                if (m[0].posterUrl) setHeroVideoPoster(m[0].posterUrl);
              }
            }}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-brass disabled:opacity-60">
            {saving ? "Saving…" : "Save Category"}
          </button>
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function DeleteButton({ id, name }: { id: string; name: string }) {
  const [confirming, setConfirming] = useState(false);
  async function onDelete() {
    try {
      await deleteCategory(id);
      toast.success(`Deleted ${name}`);
    } catch {
      toast.error("Could not delete category.");
    }
  }
  return confirming ? (
    <button onClick={onDelete} className="flex items-center justify-center gap-1.5 rounded-sm border border-red-500/50 px-3 py-2 text-xs text-red-400">
      Confirm?
    </button>
  ) : (
    <button onClick={() => setConfirming(true)} aria-label="Delete" className="flex items-center justify-center rounded-sm border border-walnut/60 px-3 py-2 text-linenDim hover:text-red-400">
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
