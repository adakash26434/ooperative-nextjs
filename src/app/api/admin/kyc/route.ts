import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  try {
    const [items, total] = await Promise.all([
      prisma.kycApplication.findMany({
        where: status ? { status } : undefined,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.kycApplication.count({ where: status ? { status } : undefined }),
    ]);
    return NextResponse.json({ items, total, pages: Math.ceil(total / limit) });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

export async function PATCH(req: Request) {
  try {
    const { id, status, remarks } = await req.json();
    const updated = await prisma.kycApplication.update({ where: { id }, data: { status, remarks } });
    return NextResponse.json(updated);
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
