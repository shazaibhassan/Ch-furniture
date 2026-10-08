import type { Config } from "tailwindcss";

/**
 * CH FURNITURE design tokens.
 * Palette evokes seasoned walnut + brass workshop light, not the generic
 * cream/terracotta look. Display serif (Cormorant) carries the brand voice.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        espresso: "#1A1410", // near-black base
        bark: "#2B2118",     // warm charcoal surface
        walnut: "#3D2E20",   // raised surface
        brass: "#B08D57",    // primary accent (aged brass)
        brassLight: "#C9A876",
        clay: "#9A7B5F",     // muted secondary
        linen: "#EDE6DA",    // light text / light bg
        linenDim: "#C9C0B2",
      },
      fontFamily: {
        display: ["var(--font-display)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      maxWidth: {
        container: "1320px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        shimmer: "shimmer 1.6s infinite",
      },
      backgroundImage: {
        "grain":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
