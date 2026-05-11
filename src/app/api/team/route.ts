import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const team = await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { displayOrder: "asc" }],
    });
    return NextResponse.json(team);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
