import { prisma } from "@/lib/prisma";
import { TestimonialsManager } from "@/components/admin/TestimonialsManager";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
  return <TestimonialsManager testimonials={testimonials} />;
}
