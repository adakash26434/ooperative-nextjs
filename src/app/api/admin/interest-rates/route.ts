import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const items = await prisma.interestRate.findMany({ orderBy: [{ category: "asc" }, { displayOrder: "asc" }] });
    return NextResponse.json(items);
  } catch { return NextResponse.json([], { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const item = await prisma.interestRate.create({
      data: {
        category: data.category as "saving" | "loan",
        name: data.name || data.nameNp,
        nameNp: data.nameNp || null,
        rate: parseFloat(data.rate),
        description: data.description || null,
        descriptionNp: data.descriptionNp || null,
        displayOrder: parseInt(data.displayOrder) || 0,
        isActive: data.isActive !== false,
      },
    });
    return NextResponse.json(item);
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.interestRate.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

export async function PATCH(req: Request) {
  try {
    const { id, ...data } = await req.json();
    const item = await prisma.interestRate.update({ where: { id }, data });
    return NextResponse.json(item);
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
