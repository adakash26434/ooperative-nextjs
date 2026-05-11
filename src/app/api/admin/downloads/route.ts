import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const items = await prisma.download.findMany({ orderBy: [{ category: "asc" }, { createdAt: "desc" }] });
    return NextResponse.json(items);
  } catch { return NextResponse.json([], { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const item = await prisma.download.create({
      data: {
        title: data.title || data.titleNp,
        titleNp: data.titleNp || null,
        file: data.fileUrl || data.file,
        category: data.category || "general",
        isActive: true,
      },
    });
    return NextResponse.json(item);
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.download.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
