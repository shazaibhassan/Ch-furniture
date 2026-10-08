"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Enter a valid email.").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  message: z.string().min(5, "Tell us a little about what you need."),
});

export type ContactState = { ok: boolean; error?: string };

export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0]?.message ?? "Please check the form." };
  }

  await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      message: parsed.data.message,
    },
  });

  return { ok: true };
}
