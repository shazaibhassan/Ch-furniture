"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { STYLES, WOOD_TYPES } from "@/lib/constants";

/** Client filter bar — updates the URL query (?style=&wood=) for SSR filtering. */
export function CategoryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const activeStyle = params.get("style") || "";
  const activeWood = params.get("wood") || "";

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value && next.get(key) !== value) next.set(key, value);
    else next.delete(key);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  }

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-xs uppercase tracking-wider transition-colors ${
      active ? "border-brass bg-brass text-espresso" : "border-walnut/60 text-linenDim hover:border-brass/60 hover:text-linen"
    }`;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs uppercase tracking-widest2 text-brass">Style</span>
        <button onClick={() => setParam("style", "")} className={chip(!activeStyle)}>All</button>
        {STYLES.map((s) => (
          <button key={s} onClick={() => setParam("style", s)} className={chip(activeStyle === s)}>{s}</button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs uppercase tracking-widest2 text-brass">Wood</span>
        <button onClick={() => setParam("wood", "")} className={chip(!activeWood)}>All</button>
        {WOOD_TYPES.map((w) => (
          <button key={w} onClick={() => setParam("wood", w)} className={chip(activeWood === w)}>{w}</button>
        ))}
      </div>
    </div>
  );
}
