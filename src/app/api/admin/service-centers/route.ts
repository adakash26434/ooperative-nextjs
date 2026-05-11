import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const item = await prisma.serviceCenter.create({
      data: {
        name: data.name || data.nameNp,
        nameNp: data.nameNp || null,
        address: data.address || null,
        phone: data.phone || null,
        email: data.email || null,
        mapUrl: data.mapUrl || null,
        isActive: true,
      },
    });
    return NextResponse.json(item);
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.serviceCenter.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ error: "Server error" }, { status: 500 }); }
}
