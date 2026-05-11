import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const items = await prisma.gallery.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
