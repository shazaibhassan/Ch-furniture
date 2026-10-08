import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SearchClient } from "@/components/site/SearchClient";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the CH FURNITURE catalog by name, category, style or wood type.",
};

export default async function SearchPage() {
  const s = await getSettings();
  return (
    <SiteShell>
      <div className="container-px pt-32 pb-12 md:pt-40">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
        <h1 className="mt-8 font-display text-[clamp(2.2rem,5vw,4rem)] font-medium text-linen">Search the catalog</h1>
      </div>
      <section className="container-px pb-28">
        <SearchClient whatsapp={s.whatsapp} />
      </section>
    </SiteShell>
  );
}
