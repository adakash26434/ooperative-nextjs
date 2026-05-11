import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code")?.trim();
    if (!code) return NextResponse.json({ error: "Code आवश्यक छ" }, { status: 400 });

    // Search by sadasyataNumber or memberCardNo
    const member = await prisma.member.findFirst({
      where: {
        OR: [
          { sadasyataNumber: code },
          { memberCardNo: code },
        ],
        isActive: true,
        approvalStatus: "approved",
      },
      select: { name: true, sadasyataNumber: true, memberCardNo: true, approvalStatus: true, phone: true },
    });

    if (!member) {
      return NextResponse.json({ found: false });
    }
    return NextResponse.json({ found: true, ...member });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
