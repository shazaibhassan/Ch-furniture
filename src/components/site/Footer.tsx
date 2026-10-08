import Link from "next/link";
import { Facebook, Instagram, Youtube, Phone, MapPin, MessageCircle, Mail } from "lucide-react";
import { whatsappUrl } from "@/lib/utils";

type FooterProps = {
  brandName: string;
  tagline: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  whatsappMessage: string;
  social: { facebook?: string; instagram?: string; youtube?: string };
};

export function Footer({
  brandName,
  tagline,
  address,
  phone,
  whatsapp,
  email,
  whatsappMessage,
  social,
}: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-walnut/60 bg-bark">
      <div className="container-px grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        {/* Brand */}
        <div>
          <h3 className="font-display text-3xl font-semibold text-linen">{brandName}</h3>
          <p className="mt-2 max-w-sm text-sm text-linenDim">{tagline}</p>
          <p className="mt-6 text-sm uppercase tracking-wider text-brass">
            Premium Wooden Furniture Manufacturer
          </p>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-xs uppercase tracking-widest2 text-brass">Explore</h4>
          <ul className="mt-5 space-y-3 text-sm text-linenDim">
            <li><Link href="/" className="hover:text-linen">Home</Link></li>
            <li><Link href="/about" className="hover:text-linen">About Us</Link></li>
            <li><Link href="/categories" className="hover:text-linen">Collections</Link></li>
            <li><Link href="/contact" className="hover:text-linen">Contact</Link></li>
            <li><Link href="/search" className="hover:text-linen">Search Catalog</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs uppercase tracking-widest2 text-brass">Visit & Contact</h4>
          <ul className="mt-5 space-y-4 text-sm text-linenDim">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brass" />
              <span>{address}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="h-4 w-4 shrink-0 text-brass" />
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-linen">{phone}</a>
            </li>
            <li className="flex gap-3">
              <MessageCircle className="h-4 w-4 shrink-0 text-brass" />
              <a
                href={whatsappUrl(whatsapp, whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-linen"
              >
                WhatsApp: {whatsapp}
              </a>
            </li>
            {email && (
              <li className="flex gap-3">
                <Mail className="h-4 w-4 shrink-0 text-brass" />
                <a href={`mailto:${email}`} className="hover:text-linen">{email}</a>
              </li>
            )}
          </ul>

          {(social.facebook || social.instagram || social.youtube) && (
            <div className="mt-6 flex gap-3">
              {social.facebook && (
                <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-brass/40 text-brass hover:bg-brass/10">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-brass/40 text-brass hover:bg-brass/10">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {social.youtube && (
                <a href={social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="flex h-9 w-9 items-center justify-center rounded-full border border-brass/40 text-brass hover:bg-brass/10">
                  <Youtube className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="hairline" />
      <div className="container-px flex flex-col items-center justify-between gap-2 py-6 text-xs text-linenDim sm:flex-row">
        <p>© {year} {brandName}. All Rights Reserved.</p>
        <p>Handcrafted in Sialkot, Pakistan.</p>
      </div>
    </footer>
  );
}
