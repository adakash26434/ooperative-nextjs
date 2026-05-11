import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const downloads = await prisma.download.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { displayOrder: "asc" }],
    });
    return NextResponse.json(downloads);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
