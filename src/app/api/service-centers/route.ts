import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const centers = await prisma.serviceCenter.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(centers);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
