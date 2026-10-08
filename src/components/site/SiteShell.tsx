import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { getSettings } from "@/lib/settings";

/** Wraps every public page with nav, footer and floating WhatsApp. */
export async function SiteShell({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer
        brandName={s.brandName}
        tagline={s.tagline}
        address={s.address}
        phone={s.phone}
        whatsapp={s.whatsapp}
        email={s.email}
        whatsappMessage={s.whatsappMessage}
        social={{ facebook: s.facebook, instagram: s.instagram, youtube: s.youtube }}
      />
      <FloatingWhatsApp number={s.whatsapp} message={s.whatsappMessage} />
    </>
  );
}
