import type { Metadata } from "next";
import { MapPin, Phone, MessageCircle, Mail, Clock } from "lucide-react";
import { SiteShell } from "@/components/site/SiteShell";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { ContactForm } from "@/components/site/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { getSettings } from "@/lib/settings";
import { whatsappUrl } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact CH FURNITURE in Sialkot, Pakistan — WhatsApp, call, email or send us a message about custom wooden furniture.",
};

export default async function ContactPage() {
  const s = await getSettings();
  const mapSrc =
    s.mapEmbedUrl ||
    `https://www.google.com/maps?q=${encodeURIComponent(s.address)}&output=embed`;

  return (
    <SiteShell>
      <div className="container-px pt-32 pb-12 md:pt-40">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
        <Reveal>
          <p className="eyebrow mt-8">Get in touch</p>
          <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.4rem,6vw,4.8rem)] font-medium leading-[1] text-linen">
            Let's craft your next piece.
          </h1>
          <p className="mt-5 max-w-xl text-linenDim">
            Message us on WhatsApp for the fastest reply, or send a note below. We'll get back with pricing, wood options and timelines.
          </p>
        </Reveal>
      </div>

      <section className="container-px grid gap-12 pb-16 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        {/* Details */}
        <Reveal>
          <div className="space-y-6">
            <div className="flex gap-4">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-brass" />
              <div>
                <p className="text-xs uppercase tracking-widest2 text-brass">Workshop</p>
                <p className="mt-1 text-linen">{s.address}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Clock className="mt-1 h-5 w-5 shrink-0 text-brass" />
              <div>
                <p className="text-xs uppercase tracking-widest2 text-brass">Business Hours</p>
                <p className="mt-1 whitespace-pre-line text-linen">{s.businessHours}</p>
              </div>
            </div>

            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <a href={whatsappUrl(s.whatsapp, s.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-sm border border-walnut/60 bg-bark p-4 hover:border-brass/60">
                <MessageCircle className="h-5 w-5 text-[#4ade80]" />
                <span className="text-sm text-linen">WhatsApp<br /><span className="text-linenDim">{s.whatsapp}</span></span>
              </a>
              <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 rounded-sm border border-walnut/60 bg-bark p-4 hover:border-brass/60">
                <Phone className="h-5 w-5 text-brass" />
                <span className="text-sm text-linen">Call<br /><span className="text-linenDim">{s.phone}</span></span>
              </a>
              {s.email && (
                <a href={`mailto:${s.email}`} className="flex items-center gap-3 rounded-sm border border-walnut/60 bg-bark p-4 hover:border-brass/60 sm:col-span-2">
                  <Mail className="h-5 w-5 text-brass" />
                  <span className="text-sm text-linen">Email<br /><span className="text-linenDim">{s.email}</span></span>
                </a>
              )}
            </div>
          </div>
        </Reveal>

        {/* Form */}
        <Reveal delay={0.1}>
          <div className="rounded-sm border border-walnut/50 bg-bark p-7 md:p-9">
            <h2 className="font-display text-2xl text-linen">Send a message</h2>
            <p className="mt-1 text-sm text-linenDim">We typically reply within a business day.</p>
            <div className="mt-6"><ContactForm /></div>
          </div>
        </Reveal>
      </section>

      {/* Map */}
      <section className="container-px pb-28">
        <div className="overflow-hidden rounded-sm border border-walnut/50">
          <iframe
            src={mapSrc}
            title="CH FURNITURE location"
            width="100%"
            height="420"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="grayscale-[0.3]"
          />
        </div>
      </section>
    </SiteShell>
  );
}
