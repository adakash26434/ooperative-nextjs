import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const admin = await prisma.adminUser.findUnique({ where: { username } });
    if (!admin || !admin.isActive) {
      return NextResponse.json({ error: "परिचय पत्र मिलेन" }, { status: 401 });
    }
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return NextResponse.json({ error: "परिचय पत्र मिलेन" }, { status: 401 });
    }
    await prisma.adminUser.update({ where: { id: admin.id }, data: { lastLogin: new Date() } });
    return NextResponse.json({ id: admin.id, username: admin.username, fullName: admin.fullName, role: admin.role });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
