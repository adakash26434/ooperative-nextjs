import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateTrackingId } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal("")),
  loanType: z.string().min(1),
  loanAmount: z.number().positive(),
  loanPurpose: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const trackingId = generateTrackingId("LN");
    const application = await prisma.loanApplication.create({
      data: {
        trackingId,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || null,
        loanType: data.loanType,
        loanAmount: data.loanAmount,
        loanPurpose: data.loanPurpose || null,
      },
    });
    return NextResponse.json({ success: true, trackingId: application.trackingId });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: e.issues }, { status: 422 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
