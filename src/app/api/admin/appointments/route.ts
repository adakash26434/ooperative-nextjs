import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  try {
    const [items, total] = await Promise.all([
      prisma.grievance.findMany({
        where: { subject: { startsWith: "भेटघाट बुकिङ" } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.grievance.count({ where: { subject: { startsWith: "भेटघाट बुकिङ" } } }),
    ]);
    return NextResponse.json({ items, total, pages: Math.ceil(total / limit) });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    const item = await prisma.grievance.update({ where: { id }, data: { status } });
    return NextResponse.json(item);
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
