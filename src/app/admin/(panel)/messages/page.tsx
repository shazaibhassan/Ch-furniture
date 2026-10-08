import { prisma } from "@/lib/prisma";
import { MessagesManager } from "@/components/admin/MessagesManager";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return <MessagesManager messages={messages} />;
}
