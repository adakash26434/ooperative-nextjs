import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const items = await prisma.teamMember.findMany({ orderBy: [{ category: "asc" }, { displayOrder: "asc" }] });
    return NextResponse.json(items);
  } catch { return NextResponse.json([], { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const item = await prisma.teamMember.create({
      data: {
        name: data.name,
        nameEn: data.nameEn || null,
        position: data.position || data.positionNp || null,
        positionNp: data.positionNp || null,
        category: (data.category as "board" | "management" | "staff") || "staff",
        phone: data.phone || null,
        email: data.email || null,
        displayOrder: parseInt(data.displayOrder) || 0,
        isActive: true,
      },
    });
    return NextResponse.json(item);
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.teamMember.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
