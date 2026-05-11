import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    await prisma.contactMessage.create({ data });
    return NextResponse.json({ success: true, message: "सन्देश पठाइयो।" });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: e.issues }, { status: 422 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
