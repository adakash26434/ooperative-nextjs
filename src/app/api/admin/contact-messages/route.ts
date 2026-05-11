import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  try {
    const [items, total] = await Promise.all([
      prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
      prisma.contactMessage.count(),
    ]);
    return NextResponse.json({ items, total, pages: Math.ceil(total / limit) });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
