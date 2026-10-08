/** Canonical category taxonomy (used for seed + nav). */
export const CATEGORY_SEED = [
  { slug: "sofas", name: "Sofas", description: "Luxury, modern, classic, traditional, sectional and L-shape sofas — upholstered on solid hardwood frames." },
  { slug: "beds", name: "Beds", description: "Luxury and wooden beds with hand-finished headboards built to last generations." },
  { slug: "dining", name: "Dining", description: "Dining tables and complete dining sets crafted from premium solid wood." },
  { slug: "chairs", name: "Chairs", description: "Wooden, luxury and accent chairs combining comfort with sculptural form." },
  { slug: "office-furniture", name: "Office Furniture", description: "Executive desks, office tables and corporate seating for distinguished workspaces." },
  { slug: "tables", name: "Tables", description: "Coffee, side, center and console tables — statement pieces for every room." },
  { slug: "swings", name: "Swings", description: "Hand-built wooden swings and jhulas, a signature of South Asian craftsmanship." },
  { slug: "carved-furniture", name: "Carved Furniture", description: "Intricate hand-carved furniture showcasing traditional woodworking mastery." },
  { slug: "tv-units", name: "TV Units", description: "Media consoles and TV units that anchor the modern living room." },
  { slug: "wardrobes", name: "Wardrobes", description: "Spacious wardrobes and cabinets with premium fittings and finishes." },
  { slug: "custom-furniture", name: "Custom Furniture", description: "Bespoke pieces designed and built entirely to your specification." },
] as const;

/** Style filter options. */
export const STYLES = ["Modern", "Classic", "Traditional", "Luxury", "Hand Carved"] as const;

/** Wood type filter options. */
export const WOOD_TYPES = ["Sheesham (Rosewood)", "Walnut", "Teak", "Oak", "Mango Wood", "MDF + Veneer"] as const;
