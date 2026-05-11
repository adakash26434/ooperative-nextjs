import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateTrackingId } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  subject: z.string().min(3),
  description: z.string().min(10),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const trackingId = generateTrackingId("GR");
    const grievance = await prisma.grievance.create({
      data: {
        trackingId,
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        subject: data.subject,
        description: data.description,
      },
    });
    return NextResponse.json({ success: true, trackingId: grievance.trackingId });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: e.issues }, { status: 422 });
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
