import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { title, titleNp, content, contentNp, noticeDate, isPopup } = await req.json();
    const notice = await prisma.notice.create({
      data: {
        title: title || titleNp,
        titleNp: titleNp || null,
        content: content || null,
        contentNp: contentNp || null,
        noticeDate: noticeDate ? new Date(noticeDate) : null,
        isPopup: Boolean(isPopup),
      },
    });
    return NextResponse.json(notice);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: [{ noticeDate: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(notices);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
