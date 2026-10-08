import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Hero } from "@/components/site/home/Hero";
import { CategoryCard } from "@/components/site/CategoryCard";
import { FurnitureCard } from "@/components/site/FurnitureCard";
import {
  SectionHeading,
  Stats,
  WhyUs,
  Process,
  Testimonials,
  FAQ,
  CTA,
} from "@/components/site/home/Sections";
import { Reveal } from "@/components/motion/Reveal";
import {
  getFeaturedCategories,
  getFeaturedFurniture,
  getTestimonials,
} from "@/lib/queries";
import { getSettings } from "@/lib/settings";

// Revalidate periodically so admin edits show without a redeploy.
export const revalidate = 60;

export default async function HomePage() {
  const [settings, categories, featured, testimonials] = await Promise.all([
    getSettings(),
    getFeaturedCategories(6),
    getFeaturedFurniture(6),
    getTestimonials(6),
  ]);

  return (
    <SiteShell>
      <Hero heroImage={settings.ogImageUrl || undefined} />

      {/* Introduction + stats */}
      <section className="container-px py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <SectionHeading
              eyebrow="Who we are"
              title="A Sialkot workshop devoted to fine wood."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg leading-relaxed text-linenDim">
              {settings.description ||
                "CH FURNITURE is a premium furniture manufacturer based in Sialkot, Pakistan. We design and build high-quality custom wooden furniture for homes, offices, hotels and restaurants — combining traditional woodworking with modern design."}
            </p>
            <Link href="/about" className="mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-wider text-brass hover:text-brassLight">
              Our story <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-16">
          <Stats
            years={settings.yearsExperience}
            projects={settings.projectsCompleted}
            clients={settings.happyClients}
            craftsmen={settings.craftsmenCount}
          />
        </div>
      </section>

      <div className="container-px"><div className="hairline" /></div>

      {/* Featured categories */}
      <section className="container-px py-24 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal><SectionHeading eyebrow="Collections" title="Explore our craft by category." /></Reveal>
          <Reveal delay={0.1}>
            <Link href="/categories" className="btn-ghost">All Collections</Link>
          </Reveal>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <CategoryCard key={c.slug} category={c} index={i} />
          ))}
        </div>
      </section>

      {/* Best selling designs */}
      {featured.length > 0 && (
        <section className="bg-bark py-24 md:py-32">
          <div className="container-px">
            <Reveal>
              <SectionHeading
                eyebrow="Best sellers"
                title="Signature designs our clients love."
                align="center"
              />
            </Reveal>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((f, i) => (
                <FurnitureCard key={f.slug} item={f} whatsapp={settings.whatsapp} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why choose us */}
      <section className="container-px py-24 md:py-32">
        <Reveal>
          <SectionHeading
            eyebrow="Why CH Furniture"
            title="Premium craftsmanship, built to last."
            align="center"
          />
        </Reveal>
        <div className="mt-14"><WhyUs /></div>
      </section>

      {/* Process */}
      <section className="bg-bark py-24 md:py-32">
        <div className="container-px">
          <Reveal>
            <SectionHeading eyebrow="How we work" title="From timber to treasured piece." align="center" />
          </Reveal>
          <div className="mt-14"><Process /></div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="container-px py-24 md:py-32">
          <Reveal>
            <SectionHeading eyebrow="Kind words" title="Trusted by homes and businesses." align="center" />
          </Reveal>
          <div className="mt-14"><Testimonials items={testimonials} /></div>
        </section>
      )}

      {/* FAQ */}
      <section className="container-px py-24 md:py-32">
        <Reveal>
          <SectionHeading eyebrow="Questions" title="Good to know." align="center" />
        </Reveal>
        <div className="mt-12"><FAQ /></div>
      </section>

      {/* CTA */}
      <section className="container-px pb-28"><CTA /></section>
    </SiteShell>
  );
}
