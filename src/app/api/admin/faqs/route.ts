import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const items = await prisma.faq.findMany({ orderBy: [{ category: "asc" }, { displayOrder: "asc" }] });
    return NextResponse.json(items);
  } catch { return NextResponse.json([], { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const item = await prisma.faq.create({
      data: {
        question: data.question || data.questionNp,
        questionNp: data.questionNp || null,
        answer: data.answer || data.answerNp,
        answerNp: data.answerNp || null,
        category: data.category || null,
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
    await prisma.faq.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
