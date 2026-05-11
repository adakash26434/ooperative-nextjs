import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const careers = await prisma.career.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(careers);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
