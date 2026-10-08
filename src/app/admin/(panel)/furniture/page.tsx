import { prisma } from "@/lib/prisma";
import { FurnitureList } from "@/components/admin/FurnitureList";

export const dynamic = "force-dynamic";

export default async function FurniturePage() {
  const items = await prisma.furniture.findMany({
    orderBy: { sortOrder: "asc" },
    include: { category: { select: { name: true } }, images: true },
  });
  return <FurnitureList items={items} />;
}
