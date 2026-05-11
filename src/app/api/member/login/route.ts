import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json();
    const member = await prisma.member.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier },
          { sadasyataNumber: identifier },
        ],
        isActive: true,
      },
    });
    if (!member || !member.passwordHash) {
      return NextResponse.json({ error: "परिचय पत्र मिलेन" }, { status: 401 });
    }
    const valid = await bcrypt.compare(password, member.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "परिचय पत्र मिलेन" }, { status: 401 });
    }
    await prisma.member.update({ where: { id: member.id }, data: { lastLogin: new Date() } });
    return NextResponse.json({
      id: member.id,
      name: member.name,
      email: member.email,
      sadasyataNumber: member.sadasyataNumber,
      memberCardNo: member.memberCardNo,
      approvalStatus: member.approvalStatus,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
