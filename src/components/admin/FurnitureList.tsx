"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Star, EyeOff } from "lucide-react";
import { deleteFurniture } from "@/app/actions/admin";

type Row = {
  id: string;
  slug: string;
  name: string;
  published: boolean;
  featured: boolean;
  bestSeller: boolean;
  category: { name: string };
  images: { url: string; isPrimary: boolean }[];
};

export function FurnitureList({ items }: { items: Row[] }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl text-linen">Furniture</h1>
          <p className="mt-1 text-linenDim">{items.length} designs</p>
        </div>
        <Link href="/admin/furniture/new" className="btn-brass"><Plus className="h-4 w-4" /> Add Design</Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-sm border border-walnut/50">
        {items.length === 0 ? (
          <div className="bg-bark p-12 text-center text-linenDim">No designs yet. Add your first piece.</div>
        ) : (
          items.map((it) => {
            const img = it.images.find((i) => i.isPrimary)?.url ?? it.images[0]?.url;
            return (
              <div key={it.id} className="flex items-center gap-4 border-b border-walnut/40 bg-bark p-3 last:border-0">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-walnut">
                  {img && <Image src={img} alt="" fill className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-linen">{it.name}</p>
                  <p className="text-xs text-linenDim">{it.category.name} · /{it.slug}</p>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  {it.featured && <span title="Featured"><Star className="h-4 w-4 fill-brass text-brass" /></span>}
                  {it.bestSeller && <span className="rounded-full bg-brass/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-brass">Best</span>}
                  {!it.published && <span title="Hidden"><EyeOff className="h-4 w-4 text-linenDim" /></span>}
                </div>
                <Link href={`/admin/furniture/${it.id}`} className="flex items-center gap-1.5 rounded-sm border border-walnut/60 px-3 py-2 text-xs text-linenDim hover:text-linen">
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Link>
                <DeleteBtn id={it.id} name={it.name} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function DeleteBtn({ id, name }: { id: string; name: string }) {
  const [confirm, setConfirm] = useState(false);
  return confirm ? (
    <button
      onClick={async () => { try { await deleteFurniture(id); toast.success(`Deleted ${name}`); } catch { toast.error("Delete failed"); } }}
      className="rounded-sm border border-red-500/50 px-3 py-2 text-xs text-red-400"
    >Confirm?</button>
  ) : (
    <button onClick={() => setConfirm(true)} aria-label="Delete" className="rounded-sm border border-walnut/60 px-3 py-2 text-linenDim hover:text-red-400">
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}
