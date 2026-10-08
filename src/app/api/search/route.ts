import { NextResponse } from "next/server";
import { searchFurniture } from "@/lib/queries";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const results = await searchFurniture(q);
  return NextResponse.json({ results });
}
