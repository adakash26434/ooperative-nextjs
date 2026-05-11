import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  gender: z.string().optional(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const exists = await prisma.member.findFirst({
      where: {
        OR: [
          data.email ? { email: data.email } : {},
          { phone: data.phone },
        ],
      },
    });
    if (exists) {
      return NextResponse.json({ error: "यो फोन वा इमेल पहिले नै दर्ता छ।" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const year = new Date().getFullYear().toString().slice(-2);
    const rand = Math.floor(1000 + Math.random() * 9000);
    const sadasyataNumber = `MEM${year}${rand}`;

    const member = await prisma.member.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        address: data.address || null,
        gender: data.gender || null,
        passwordHash,
        sadasyataNumber,
        approvalStatus: "pending",
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, sadasyataNumber: member.sadasyataNumber });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: "Invalid data", details: e.issues }, { status: 422 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
