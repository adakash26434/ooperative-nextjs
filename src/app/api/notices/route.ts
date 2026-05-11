import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const notices = await prisma.notice.findMany({
      where: { isActive: true },
      orderBy: [{ noticeDate: "desc" }, { createdAt: "desc" }],
      take: 50,
    });
    return NextResponse.json(notices);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
