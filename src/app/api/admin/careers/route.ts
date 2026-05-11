import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const items = await prisma.career.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(items);
  } catch { return NextResponse.json([], { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const item = await prisma.career.create({
      data: {
        title: data.title || data.titleNp,
        titleNp: data.titleNp || null,
        description: data.descriptionNp || data.description || null,
        requirements: data.requirements || null,
        salary: data.salary || null,
        deadline: data.deadline ? new Date(data.deadline) : null,
        isActive: data.isActive !== false,
      },
    });
    return NextResponse.json(item);
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.career.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
