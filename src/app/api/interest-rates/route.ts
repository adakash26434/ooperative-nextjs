import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const rates = await prisma.interestRate.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { displayOrder: "asc" }],
    });
    return NextResponse.json(rates);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
