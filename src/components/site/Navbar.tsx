"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/categories", label: "Collections" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500",
        scrolled ? "glass py-3" : "bg-transparent py-5"
      )}
    >
      <nav className="container-px flex items-center justify-between">
        <Link href="/" className="group flex flex-col leading-none">
          <span className="font-display text-2xl font-semibold tracking-wide text-linen">
            CH FURNITURE
          </span>
          <span className="text-[10px] uppercase tracking-widest2 text-brass">
            Est. Sialkot · Pakistan
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-9 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative text-sm uppercase tracking-wider transition-colors",
                    active ? "text-brass" : "text-linenDim hover:text-linen"
                  )}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1.5 left-0 h-px w-full bg-brass"
                    />
                  )}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href="/search"
              aria-label="Search the catalog"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-brass/40 text-brass transition-colors hover:bg-brass/10"
            >
              <Search className="h-4 w-4" />
            </Link>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          className="text-linen md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden glass md:hidden"
          >
            <ul className="container-px flex flex-col gap-1 py-4">
              {[...NAV, { href: "/search", label: "Search" }].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block py-3 text-lg font-display text-linen"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
