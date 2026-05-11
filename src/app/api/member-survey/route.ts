import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  memberId: z.string().optional(),
  satisfaction: z.number().min(1).max(5),
  suggestion: z.string().optional(),
  complaint: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    await prisma.memberSurvey.create({
      data: {
        name: body.name,
        phone: body.phone,
        memberId: body.memberId || null,
        satisfaction: body.satisfaction,
        suggestion: body.suggestion || null,
        complaint: body.complaint || null,
      },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: "Invalid data" }, { status: 422 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
