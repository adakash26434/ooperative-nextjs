import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  try {
    const [items, total] = await Promise.all([
      prisma.news.findMany({ orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
      prisma.news.count(),
    ]);
    return NextResponse.json({ items, total, pages: Math.ceil(total / limit) });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const item = await prisma.news.create({
      data: {
        title: data.title || data.titleNp,
        titleNp: data.titleNp || null,
        slug: (data.titleNp || data.title).toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "").substring(0, 80) + "-" + Date.now(),
        content: data.content || null,
        contentNp: data.contentNp || null,
        image: data.image || null,
        isActive: data.isActive !== false,
      },
    });
    return NextResponse.json(item);
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.news.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
