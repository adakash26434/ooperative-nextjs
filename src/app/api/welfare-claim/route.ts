import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { generateTrackingId } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  memberId: z.string().optional(),
  claimType: z.string().min(2),
  description: z.string().min(5),
  bankAccount: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const trackingId = generateTrackingId("WF");
    const claim = await prisma.welfareClaim.create({
      data: {
        trackingId,
        name: body.name,
        phone: body.phone,
        sadasyataNo: body.memberId || null,
        claimType: body.claimType,
        description: body.description,
        bankAccount: body.bankAccount || null,
      },
    });
    return NextResponse.json({ trackingId: claim.trackingId });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: "Invalid data" }, { status: 422 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
