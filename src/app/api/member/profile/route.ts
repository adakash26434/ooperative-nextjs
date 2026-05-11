import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
  try {
    const { id, name, phone, address, gender, currentPassword, newPassword } = await req.json();
    if (!id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    if (gender !== undefined) updateData.gender = gender;

    if (newPassword && currentPassword) {
      const member = await prisma.member.findUnique({ where: { id: Number(id) } });
      if (!member?.passwordHash) return NextResponse.json({ error: "पुरानो पासवर्ड मिलेन" }, { status: 400 });
      const valid = await bcrypt.compare(currentPassword, member.passwordHash);
      if (!valid) return NextResponse.json({ error: "पुरानो पासवर्ड गलत" }, { status: 400 });
      updateData.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    const updated = await prisma.member.update({
      where: { id: Number(id) },
      data: updateData,
      select: { id: true, name: true, email: true, phone: true, address: true, gender: true, sadasyataNumber: true, memberCardNo: true, approvalStatus: true },
    });
    return NextResponse.json(updated);
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const member = await prisma.member.findUnique({
      where: { id: Number(id) },
      select: {
        id: true, name: true, email: true, phone: true, address: true, gender: true,
        sadasyataNumber: true, memberCardNo: true, approvalStatus: true,
        loanApplications: { orderBy: { createdAt: "desc" }, take: 5, select: { id: true, trackingId: true, loanType: true, status: true, createdAt: true } },
        kycApplications: { orderBy: { createdAt: "desc" }, take: 3, select: { id: true, trackingId: true, status: true, createdAt: true } },
        grievances: { orderBy: { createdAt: "desc" }, take: 5, select: { id: true, trackingId: true, subject: true, status: true, createdAt: true } },
      },
    });
    if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(member);
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
