"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Star, EyeOff } from "lucide-react";
import { upsertTestimonial, deleteTestimonial } from "@/app/actions/admin";

type Testimonial = {
  id: string;
  author: string;
  role: string | null;
  quote: string;
  rating: number;
  published: boolean;
  sortOrder: number;
};

const field =
  "w-full rounded-sm border border-walnut/60 bg-espresso px-4 py-2.5 text-linen placeholder:text-linenDim/60 focus:border-brass";
const label = "block text-xs uppercase tracking-wider text-brass mb-1.5";

export function TestimonialsManager({ testimonials }: { testimonials: Testimonial[] }) {
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [creating, setCreating] = useState(false);
  const showForm = creating || editing !== null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl text-linen">Testimonials</h1>
          <p className="mt-1 text-linenDim">{testimonials.length} testimonials</p>
        </div>
        {!showForm && <button onClick={() => setCreating(true)} className="btn-brass"><Plus className="h-4 w-4" /> Add</button>}
      </div>

      {showForm ? (
        <Form testimonial={editing} onClose={() => { setCreating(false); setEditing(null); }} />
      ) : (
        <div className="mt-8 space-y-3">
          {testimonials.map((t) => (
            <div key={t.id} className="flex items-start gap-4 rounded-sm border border-walnut/50 bg-bark p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-linen">{t.author}</p>
                  {!t.published && <EyeOff className="h-3.5 w-3.5 text-linenDim" />}
                  <span className="flex text-brass">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-brass" />)}</span>
                </div>
                {t.role && <p className="text-xs text-linenDim">{t.role}</p>}
                <p className="mt-1 line-clamp-2 text-sm text-linenDim">{t.quote}</p>
              </div>
              <button onClick={() => setEditing(t)} className="rounded-sm border border-walnut/60 px-3 py-2 text-xs text-linenDim hover:text-linen"><Pencil className="h-3.5 w-3.5" /></button>
              <DeleteBtn id={t.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Form({ testimonial, onClose }: { testimonial: Testimonial | null; onClose: () => void }) {
  const [saving, setSaving] = useState(false);
  async function action(formData: FormData) {
    setSaving(true);
    try {
      await upsertTestimonial(testimonial?.id ?? null, formData);
      toast.success(testimonial ? "Updated" : "Created");
      onClose();
    } catch { toast.error("Something went wrong."); }
    finally { setSaving(false); }
  }
  return (
    <div className="mt-8 rounded-sm border border-walnut/50 bg-bark p-7">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl text-linen">{testimonial ? "Edit" : "New"} Testimonial</h2>
        <button onClick={onClose}><X className="h-5 w-5 text-linenDim hover:text-linen" /></button>
      </div>
      <form action={action} className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div><label className={label}>Author</label><input name="author" defaultValue={testimonial?.author} required className={field} /></div>
          <div><label className={label}>Role / location</label><input name="role" defaultValue={testimonial?.role ?? ""} placeholder="e.g. Homeowner, Lahore" className={field} /></div>
        </div>
        <div><label className={label}>Quote</label><textarea name="quote" defaultValue={testimonial?.quote} required rows={3} className={field} /></div>
        <div className="grid gap-5 sm:grid-cols-3">
          <div><label className={label}>Rating (1–5)</label><input name="rating" type="number" min={1} max={5} defaultValue={testimonial?.rating ?? 5} className={field} /></div>
          <div><label className={label}>Sort order</label><input name="sortOrder" type="number" defaultValue={testimonial?.sortOrder ?? 0} className={field} /></div>
          <label className="flex items-center gap-2 pt-7 text-sm text-linen"><input name="published" type="checkbox" defaultChecked={testimonial?.published ?? true} className="h-4 w-4 accent-brass" /> Published</label>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-brass disabled:opacity-60">{saving ? "Saving…" : "Save"}</button>
          <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function DeleteBtn({ id }: { id: string }) {
  const [confirm, setConfirm] = useState(false);
  return confirm ? (
    <button onClick={async () => { try { await deleteTestimonial(id); toast.success("Deleted"); } catch { toast.error("Delete failed"); } }} className="rounded-sm border border-red-500/50 px-3 py-2 text-xs text-red-400">Confirm?</button>
  ) : (
    <button onClick={() => setConfirm(true)} className="rounded-sm border border-walnut/60 px-3 py-2 text-linenDim hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
  );
}
