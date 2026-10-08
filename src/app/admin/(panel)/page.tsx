import Link from "next/link";
import { Boxes, Sofa, MessageSquareQuote, Mail, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [categories, furniture, testimonials, unread] = await Promise.all([
    prisma.category.count(),
    prisma.furniture.count(),
    prisma.testimonial.count(),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);

  const stats = [
    { label: "Categories", value: categories, href: "/admin/categories", icon: Boxes },
    { label: "Furniture", value: furniture, href: "/admin/furniture", icon: Sofa },
    { label: "Testimonials", value: testimonials, href: "/admin/testimonials", icon: MessageSquareQuote },
    { label: "Unread messages", value: unread, href: "/admin/messages", icon: Mail },
  ];

  return (
    <div>
      <h1 className="font-display text-4xl text-linen">Dashboard</h1>
      <p className="mt-1 text-linenDim">Manage your catalog, content and enquiries.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-sm border border-walnut/50 bg-bark p-6 transition-colors hover:border-brass/50">
            <s.icon className="h-6 w-6 text-brass" />
            <p className="mt-4 font-display text-4xl text-linen">{s.value}</p>
            <p className="text-xs uppercase tracking-wider text-linenDim">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <Link href="/admin/furniture/new" className="btn-brass"><Plus className="h-4 w-4" /> Add Furniture</Link>
        <Link href="/admin/categories" className="btn-ghost"><Plus className="h-4 w-4" /> Add Category</Link>
      </div>
    </div>
  );
}
