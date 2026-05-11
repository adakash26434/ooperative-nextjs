import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const faqs = await prisma.faq.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { displayOrder: "asc" }],
    });
    return NextResponse.json(faqs);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
