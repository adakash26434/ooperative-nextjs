import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;

  try {
    const [items, total] = await Promise.all([
      prisma.member.findMany({
        where: status ? { approvalStatus: status } : undefined,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: { id: true, name: true, email: true, phone: true, sadasyataNumber: true, memberCardNo: true, approvalStatus: true, createdAt: true, isActive: true },
      }),
      prisma.member.count({ where: status ? { approvalStatus: status } : undefined }),
    ]);
    return NextResponse.json({ items, total, page, pages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, approvalStatus, isActive } = await req.json();
    const updated = await prisma.member.update({
      where: { id },
      data: { ...(approvalStatus && { approvalStatus }), ...(isActive !== undefined && { isActive }) },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
