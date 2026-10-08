"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Boxes, Sofa, MessageSquareQuote,
  Settings as SettingsIcon, Mail, LogOut, ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/categories", label: "Categories", icon: Boxes },
  { href: "/admin/furniture", label: "Furniture", icon: Sofa },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-walnut/50 bg-bark p-5">
      <div className="px-2">
        <p className="font-display text-2xl text-linen">CH FURNITURE</p>
        <p className="text-[10px] uppercase tracking-widest2 text-brass">Admin Panel</p>
      </div>

      <nav className="mt-8 flex-1 space-y-1">
        {LINKS.map((l) => {
          const active = pathname === l.href || (l.href !== "/admin" && pathname.startsWith(l.href));
          return (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors",
                active ? "bg-brass/15 text-brass" : "text-linenDim hover:bg-walnut/40 hover:text-linen"
              )}
            >
              <l.icon className="h-4 w-4" /> {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-walnut/50 pt-4">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-linenDim hover:text-linen">
          <ExternalLink className="h-4 w-4" /> View Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-linenDim hover:text-linen"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </aside>
  );
}
