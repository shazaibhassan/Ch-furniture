import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Stock imagery (Unsplash) used only as seed placeholders — replace via the
// admin panel with your own Cloudinary uploads.
const IMG = {
  sofa: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
  sofa2: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&q=80",
  bed: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
  bed2: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&q=80",
  dining: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1200&q=80",
  dining2: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=1200&q=80",
  chair: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1200&q=80",
  chair2: "https://images.unsplash.com/photo-1503602642458-232111445657?w=1200&q=80",
  office: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
  table: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=1200&q=80",
  swing: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80",
  carved: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1200&q=80",
  tv: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=1200&q=80",
  wardrobe: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=1200&q=80",
  custom: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1200&q=80",
};

const CATEGORIES = [
  { slug: "sofas", name: "Sofas", featured: true, thumb: IMG.sofa, banner: IMG.sofa2, description: "Luxury, modern, classic and sectional sofas — upholstered on solid hardwood frames." },
  { slug: "beds", name: "Beds", featured: true, thumb: IMG.bed, banner: IMG.bed2, description: "Luxury and wooden beds with hand-finished headboards built to last generations." },
  { slug: "dining", name: "Dining", featured: true, thumb: IMG.dining, banner: IMG.dining2, description: "Dining tables and complete sets crafted from premium solid wood." },
  { slug: "chairs", name: "Chairs", featured: true, thumb: IMG.chair, banner: IMG.chair2, description: "Wooden, luxury and accent chairs combining comfort with sculptural form." },
  { slug: "office-furniture", name: "Office Furniture", featured: false, thumb: IMG.office, banner: IMG.office, description: "Executive desks, office tables and corporate seating for distinguished workspaces." },
  { slug: "tables", name: "Tables", featured: true, thumb: IMG.table, banner: IMG.table, description: "Coffee, side, center and console tables — statement pieces for every room." },
  { slug: "swings", name: "Swings", featured: false, thumb: IMG.swing, banner: IMG.swing, description: "Hand-built wooden swings and jhulas, a signature of South Asian craftsmanship." },
  { slug: "carved-furniture", name: "Carved Furniture", featured: true, thumb: IMG.carved, banner: IMG.carved, description: "Intricate hand-carved furniture showcasing traditional woodworking mastery." },
  { slug: "tv-units", name: "TV Units", featured: false, thumb: IMG.tv, banner: IMG.tv, description: "Media consoles and TV units that anchor the modern living room." },
  { slug: "wardrobes", name: "Wardrobes", featured: false, thumb: IMG.wardrobe, banner: IMG.wardrobe, description: "Spacious wardrobes and cabinets with premium fittings and finishes." },
  { slug: "custom-furniture", name: "Custom Furniture", featured: false, thumb: IMG.custom, banner: IMG.custom, description: "Bespoke pieces designed and built entirely to your specification." },
];

// A few sample designs per featured category to make the site feel alive.
const FURNITURE: Record<string, Array<any>> = {
  sofas: [
    { name: "Heritage Chesterfield Sofa", style: "Classic", woodType: "Sheesham (Rosewood)", finish: "Hand-rubbed walnut stain", dimensions: '84\" W × 36\" D × 32\" H', shortDesc: "Deep-buttoned three-seater on a solid rosewood frame.", featured: true, bestSeller: true, img: IMG.sofa, features: ["Solid Sheesham frame", "Hand-tufted buttoning", "Premium velvet or leather upholstery", "Custom dimensions available"] },
    { name: "Lahore Modern Sectional", style: "Modern", woodType: "Walnut", finish: "Matte lacquer", dimensions: '120\" W × 64\" D', shortDesc: "An L-shape sectional with clean lines and a low profile.", featured: false, bestSeller: true, img: IMG.sofa2, features: ["Kiln-dried hardwood frame", "High-resilience foam", "Stain-resistant fabric options", "Modular configuration"] },
  ],
  beds: [
    { name: "Royal Carved Bed", style: "Luxury", woodType: "Sheesham (Rosewood)", finish: "Antique gold patina", dimensions: "King · 72\" × 78\"", shortDesc: "A statement headboard with intricate hand carving.", featured: true, bestSeller: true, img: IMG.bed, features: ["Hand-carved headboard", "Solid rosewood construction", "Reinforced slat support", "Matching side tables available"] },
    { name: "Minimalist Platform Bed", style: "Modern", woodType: "Oak", finish: "Natural oil", dimensions: "Queen · 60\" × 78\"", shortDesc: "Low platform bed with a floating-frame look.", featured: false, bestSeller: false, img: IMG.bed2, features: ["Solid oak frame", "Floating side rails", "No box spring required"] },
  ],
  dining: [
    { name: "Grand Banquet Dining Set", style: "Traditional", woodType: "Sheesham (Rosewood)", finish: "Deep walnut polish", dimensions: "Seats 8 · 96\" table", shortDesc: "Eight-seat dining table with carved legs and chairs.", featured: true, bestSeller: true, img: IMG.dining, features: ["Seats up to 8", "Carved leg detailing", "Matching upholstered chairs", "Extendable option available"] },
    { name: "Live-Edge Dining Table", style: "Modern", woodType: "Walnut", finish: "Clear matte", dimensions: '78\" L × 38\" W', shortDesc: "Natural live-edge slab on a steel-reinforced base.", featured: false, bestSeller: false, img: IMG.dining2, features: ["Single live-edge slab", "Hand-finished natural edge", "Powder-coated metal legs"] },
  ],
  chairs: [
    { name: "Carved Accent Armchair", style: "Hand Carved", woodType: "Sheesham (Rosewood)", finish: "Honey stain", dimensions: '28\" W × 30\" D × 40\" H', shortDesc: "Sculptural armchair with hand-carved arms.", featured: true, bestSeller: false, img: IMG.chair, features: ["Hand-carved arms", "Solid rosewood frame", "Custom upholstery"] },
    { name: "Executive Wing Chair", style: "Luxury", woodType: "Walnut", finish: "Dark espresso", dimensions: '32\" W × 34\" D', shortDesc: "High-back wing chair upholstered in premium leather.", featured: false, bestSeller: true, img: IMG.chair2, features: ["Genuine leather", "High wing back", "Brass stud detailing"] },
  ],
  tables: [
    { name: "Octagon Carved Center Table", style: "Hand Carved", woodType: "Sheesham (Rosewood)", finish: "Walnut polish", dimensions: '42\" Ø × 18\" H', shortDesc: "Octagonal center table with intricate carved apron.", featured: true, bestSeller: false, img: IMG.table, features: ["Hand-carved apron", "Solid rosewood top", "Brass inlay option"] },
  ],
  "carved-furniture": [
    { name: "Mughal Carved Console", style: "Hand Carved", woodType: "Sheesham (Rosewood)", finish: "Antique stain", dimensions: '54\" W × 18\" D × 34\" H', shortDesc: "A console table inspired by Mughal motifs.", featured: true, bestSeller: true, img: IMG.carved, features: ["Mughal-inspired carving", "Solid rosewood", "Hand-finished detailing", "Mirror pairing available"] },
  ],
  "office-furniture": [
    { name: "Executive Office Desk", style: "Modern", woodType: "Oak", finish: "Matte clear", dimensions: '72\" W × 36\" D', shortDesc: "Spacious executive desk with cable management.", featured: false, bestSeller: false, img: IMG.office, features: ["Integrated cable routing", "Lockable drawers", "Solid oak top"] },
  ],
  "tv-units": [
    { name: "Floating Media Console", style: "Modern", woodType: "Walnut", finish: "Matte", dimensions: '72\" W × 16\" D', shortDesc: "Wall-mounted media console with hidden storage.", featured: false, bestSeller: false, img: IMG.tv, features: ["Wall-mounted design", "Push-to-open doors", "Cable management"] },
  ],
  wardrobes: [
    { name: "Six-Door Premium Wardrobe", style: "Classic", woodType: "Sheesham (Rosewood)", finish: "Walnut polish", dimensions: '96\" W × 24\" D × 84\" H', shortDesc: "Six-door wardrobe with mirror and internal organisers.", featured: false, bestSeller: false, img: IMG.wardrobe, features: ["Six doors", "Full-length mirror", "Internal drawers & shelves", "Soft-close hinges"] },
  ],
  swings: [
    { name: "Carved Garden Jhula", style: "Traditional", woodType: "Teak", finish: "Weatherproof oil", dimensions: '60\" W seat', shortDesc: "Traditional carved swing for verandah or garden.", featured: false, bestSeller: false, img: IMG.swing, features: ["Weather-resistant teak", "Hand-carved frame", "Heavy-duty chains included"] },
  ],
  "custom-furniture": [
    { name: "Bespoke Project Example", style: "Luxury", woodType: "Sheesham (Rosewood)", finish: "Your choice", dimensions: "Made to measure", shortDesc: "Share your idea — we design and build it to order.", featured: false, bestSeller: false, img: IMG.custom, features: ["Fully made to measure", "Choice of wood & finish", "Design consultation included"] },
  ],
};

const TESTIMONIALS = [
  { author: "Ayesha Khan", role: "Homeowner, Lahore", quote: "The carved bed they made for us is a work of art. The craftsmanship is beyond anything we found in showrooms.", rating: 5, sortOrder: 0 },
  { author: "Bilal Ahmed", role: "Interior Designer", quote: "My go-to workshop for client projects. Quality wood, precise joinery, and they nail custom dimensions every time.", rating: 5, sortOrder: 1 },
  { author: "Fatima Sheikh", role: "Restaurant Owner, Islamabad", quote: "We furnished our entire restaurant with CH Furniture. Sturdy, beautiful, and delivered on schedule.", rating: 5, sortOrder: 2 },
  { author: "Usman Tariq", role: "Homeowner, Sialkot", quote: "From consultation to delivery the team was professional. The dining set is the centrepiece of our home.", rating: 5, sortOrder: 3 },
];

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}

async function main() {
  console.log("🌱 Seeding CH FURNITURE database…");

  // --- Admin ---
  const email = (process.env.ADMIN_EMAIL || "admin@chfurniture.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "ChangeMe!2025";
  const name = process.env.ADMIN_NAME || "CH Furniture Admin";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { email, passwordHash, name },
  });
  console.log(`✓ Admin ready: ${email}`);

  // --- Settings ---
  await prisma.settings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      description: "CH FURNITURE is a premium furniture manufacturer based in Sialkot, Pakistan, crafting custom wooden furniture for homes, offices, hotels and restaurants.",
      aboutStory: "CH FURNITURE began in a small Sialkot workshop with a simple belief: furniture should be built to outlive trends. Today we craft premium wooden furniture for clients across Pakistan and beyond.",
      aboutExperience: "Every piece is made from carefully seasoned hardwood and finished by hand. Our craftsmen combine traditional joinery and hand-carving with modern design.",
      aboutMission: "To craft premium, honest, made-to-last wooden furniture that brings warmth and character to every space.",
      aboutVision: "To carry Pakistani craftsmanship to the world — recognised for quality, integrity and timeless design.",
    },
  });
  console.log("✓ Settings ready");

  // --- Categories + furniture ---
  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];
    const category = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, featured: c.featured, thumbUrl: c.thumb, bannerUrl: c.banner, sortOrder: i },
      create: { slug: c.slug, name: c.name, description: c.description, featured: c.featured, thumbUrl: c.thumb, bannerUrl: c.banner, sortOrder: i },
    });

    const designs = FURNITURE[c.slug] || [];
    for (let j = 0; j < designs.length; j++) {
      const d = designs[j];
      const slug = slugify(d.name);
      const existing = await prisma.furniture.findUnique({ where: { slug } });
      if (existing) continue;
      await prisma.furniture.create({
        data: {
          slug,
          name: d.name,
          categoryId: category.id,
          style: d.style,
          woodType: d.woodType,
          finish: d.finish,
          dimensions: d.dimensions,
          shortDesc: d.shortDesc,
          description: `${d.shortDesc} Handcrafted by CH FURNITURE in Sialkot from premium ${d.woodType}. Each piece can be customised in size, wood and finish — message us on WhatsApp for pricing and options.`,
          features: JSON.stringify(d.features),
          featured: d.featured,
          bestSeller: d.bestSeller,
          published: true,
          sortOrder: j,
          images: { create: [{ url: d.img, publicId: `seed/${slug}`, isPrimary: true, sortOrder: 0, alt: d.name }] },
        },
      });
    }
  }
  console.log(`✓ ${CATEGORIES.length} categories + sample furniture ready`);

  // --- Testimonials ---
  for (const t of TESTIMONIALS) {
    const exists = await prisma.testimonial.findFirst({ where: { author: t.author, quote: t.quote } });
    if (!exists) await prisma.testimonial.create({ data: { ...t, published: true } });
  }
  console.log(`✓ ${TESTIMONIALS.length} testimonials ready`);

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
