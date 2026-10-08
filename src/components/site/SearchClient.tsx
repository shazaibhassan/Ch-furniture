"use client";
import { useState, useEffect, useCallback } from "react";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { FurnitureCard, type FurnitureCardData } from "@/components/site/FurnitureCard";

export function SearchClient({ whatsapp }: { whatsapp: string }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<FurnitureCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState(false);

  const run = useCallback(async (term: string) => {
    if (!term.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      setResults(data.results ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    setTouched(true);
    const t = setTimeout(() => run(q), 300);
    return () => clearTimeout(t);
  }, [q, run]);

  return (
    <div>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-brass" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, category, style or wood…"
          aria-label="Search furniture"
          className="w-full rounded-full border border-walnut/60 bg-bark py-4 pl-14 pr-5 text-lg text-linen placeholder:text-linenDim/60 focus:border-brass"
        />
        {loading && <Loader2 className="absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-brass" />}
      </div>

      <div className="mt-10">
        {q.trim() && !loading && results.length === 0 && touched && (
          <p className="text-center text-linenDim">No designs found for “{q}”. Try another term.</p>
        )}
        {results.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((f, i) => (
              <FurnitureCard key={f.slug} item={f} whatsapp={whatsapp} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
