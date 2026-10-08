import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { CategoryCard } from "@/components/site/CategoryCard";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { getAllCategories } from "@/lib/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Browse CH FURNITURE collections — sofas, beds, dining, chairs, office furniture, tables, swings, carved furniture, TV units, wardrobes and custom pieces.",
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <SiteShell>
      <div className="container-px pt-32 pb-12 md:pt-40">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Collections" }]} />
        <Reveal>
          <p className="eyebrow mt-8">Our craft</p>
          <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,6vw,4.5rem)] font-medium leading-[1] text-linen">
            Collections built from premium wood.
          </h1>
          <p className="mt-5 max-w-xl text-linenDim">
            Every category below is fully customizable — explore the designs, then message us to tailor any piece to your space.
          </p>
        </Reveal>
      </div>

      <div className="container-px pb-28">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <CategoryCard key={c.slug} category={c} index={i} />
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
