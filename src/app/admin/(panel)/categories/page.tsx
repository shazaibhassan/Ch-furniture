import { prisma } from "@/lib/prisma";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { furniture: true } } },
  });
  return <CategoriesManager categories={categories} />;
}
