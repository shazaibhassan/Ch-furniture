"use client";
import { Share2 } from "lucide-react";
import { toast } from "sonner";

export function ShareButton({ title }: { title: string }) {
  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title, url }); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  }
  return (
    <button onClick={share} className="btn-ghost">
      <Share2 className="h-4 w-4" /> Share
    </button>
  );
}
