import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json(news);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
