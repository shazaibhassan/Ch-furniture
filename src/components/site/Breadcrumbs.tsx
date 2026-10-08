import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wider text-linenDim">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="hover:text-brass">{item.label}</Link>
          ) : (
            <span className="text-brass">{item.label}</span>
          )}
          {i < items.length - 1 && <ChevronRight className="h-3 w-3 text-walnut" />}
        </span>
      ))}
    </nav>
  );
}
