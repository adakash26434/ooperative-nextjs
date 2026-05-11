import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { generateTrackingId } from "@/lib/utils";

const schema = z.object({
  companyName: z.string().min(2),
  ownerName: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  panNo: z.string().optional(),
  businessType: z.string().optional(),
  description: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const trackingId = generateTrackingId("VND");
    const vendor = await prisma.vendorEnlistment.create({
      data: {
        trackingId,
        companyName: body.companyName,
        ownerName: body.ownerName,
        phone: body.phone,
        email: body.email || null,
        address: body.address || null,
        panNo: body.panNo || null,
        businessType: body.businessType || null,
        description: body.description || null,
      },
    });
    return NextResponse.json({ trackingId: vendor.trackingId });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: "Invalid data" }, { status: 422 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
