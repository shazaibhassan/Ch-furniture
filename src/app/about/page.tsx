import type { Metadata } from "next";
import Image from "next/image";
import { SiteShell } from "@/components/site/SiteShell";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SectionHeading, Stats, Process } from "@/components/site/home/Sections";
import { Reveal } from "@/components/motion/Reveal";
import { getSettings } from "@/lib/settings";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The story, craftsmanship and workshop behind CH FURNITURE — premium wooden furniture handmade in Sialkot, Pakistan.",
};

export default async function AboutPage() {
  const s = await getSettings();

  return (
    <SiteShell>
      <div className="container-px pt-32 pb-12 md:pt-40">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
        <Reveal>
          <p className="eyebrow mt-8">Our story</p>
          <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.4rem,6vw,4.8rem)] font-medium leading-[1] text-linen">
            Three generations of wood, joined by hand.
          </h1>
        </Reveal>
      </div>

      {/* Story + image */}
      <section className="container-px grid gap-12 pb-24 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-walnut/50">
            <Image
              src="https://images.unsplash.com/photo-1601760562234-9814eea6663a?w=1400&q=80"
              alt="CH FURNITURE workshop"
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="space-y-6 text-lg leading-relaxed text-linenDim">
            <p>
              {s.aboutStory ||
                "CH FURNITURE began in a small Sialkot workshop with a simple belief: furniture should be built to outlive trends. Today we craft premium wooden furniture for homes, offices, hotels and restaurants across Pakistan and beyond."}
            </p>
            <p>
              {s.aboutExperience ||
                "Every piece is made from carefully seasoned hardwood and finished by hand. Our craftsmen combine traditional joinery and hand-carving with modern design — so each design is both timeless and made for how you live today."}
            </p>
          </div>
        </Reveal>
      </section>

      {/* Stats */}
      <section className="container-px pb-24">
        <Stats
          years={s.yearsExperience}
          projects={s.projectsCompleted}
          clients={s.happyClients}
          craftsmen={s.craftsmenCount}
        />
      </section>

      {/* Mission / Vision */}
      <section className="bg-bark py-24">
        <div className="container-px grid gap-12 md:grid-cols-2">
          <Reveal>
            <div className="rounded-sm border border-walnut/50 bg-espresso p-9">
              <p className="eyebrow">Mission</p>
              <p className="mt-5 font-display text-2xl leading-relaxed text-linen">
                {s.aboutMission ||
                  "To craft premium, honest, made-to-last wooden furniture that brings warmth and character to every space we touch."}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-sm border border-walnut/50 bg-espresso p-9">
              <p className="eyebrow">Vision</p>
              <p className="mt-5 font-display text-2xl leading-relaxed text-linen">
                {s.aboutVision ||
                  "To carry Pakistani craftsmanship to the world — recognised for quality, integrity and timeless design."}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="container-px py-24">
        <Reveal>
          <SectionHeading eyebrow="Manufacturing" title="How a piece is made." align="center" />
        </Reveal>
        <div className="mt-14"><Process /></div>
      </section>
    </SiteShell>
  );
}
