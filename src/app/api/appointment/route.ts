import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateTrackingId } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  name:           z.string().min(2),
  phone:          z.string().min(7),
  email:          z.string().email().optional().or(z.literal("")),
  memberId:       z.string().optional(),
  purpose:        z.string().min(1),
  purposeDetail:  z.string().optional(),
  preferredDate:  z.string().optional(),
  preferredTime:  z.string().optional(),
  branch:         z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const trackingId = generateTrackingId("AP");
    await prisma.grievance.create({
      data: {
        trackingId,
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        subject: `भेटघाट बुकिङ — ${data.purpose}`,
        description: `मिति: ${data.preferredDate || "—"}, समय: ${data.preferredTime || "—"}, शाखा: ${data.branch || "—"}\n${data.purposeDetail || ""}`,
      },
    });
    return NextResponse.json({ success: true, trackingId });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: "Invalid data", details: e.issues }, { status: 422 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
