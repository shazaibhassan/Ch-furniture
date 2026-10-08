import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const DEFAULT_WHATSAPP = "+92 341 6309652";

export const getSettings = unstable_cache(
  async () => {
    const existing = await prisma.settings.findUnique({ where: { id: "singleton" } });
    if (existing) return existing;
    return prisma.settings.create({ data: { id: "singleton" } });
  },
  ["settings"],
  { revalidate: 300, tags: ["settings"] }
);
