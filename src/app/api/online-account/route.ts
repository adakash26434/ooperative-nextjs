import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateTrackingId } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  accountType:            z.string().min(1),
  fullName:               z.string().min(2),
  fullNameEn:             z.string().optional(),
  dobBs:                  z.string().optional(),
  dobAd:                  z.string().optional(),
  gender:                 z.string().optional(),
  maritalStatus:          z.string().optional(),
  mobile:                 z.string().min(7),
  email:                  z.string().email().optional().or(z.literal("")),
  permanentAddress:       z.string().optional(),
  temporaryAddress:       z.string().optional(),
  citizenshipNo:          z.string().optional(),
  citizenshipIssuedDate:  z.string().optional(),
  citizenshipIssuedPlace: z.string().optional(),
  fatherName:             z.string().optional(),
  motherName:             z.string().optional(),
  occupation:             z.string().optional(),
  monthlyIncome:          z.string().optional(),
  initialDeposit:         z.string().optional(),
  nomineeName:            z.string().optional(),
  nomineeRelation:        z.string().optional(),
  nomineePhone:           z.string().optional(),
  branch:                 z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    const trackingId = generateTrackingId("AC");
    const application = await prisma.kycApplication.create({
      data: {
        trackingId,
        fullName: data.fullName,
        phone: data.mobile,
        email: data.email || null,
        formData: JSON.stringify({ type: "account_opening", accountType: data.accountType, fullNameEn: data.fullNameEn, gender: data.gender, dob: data.dobAd, citizenshipNo: data.citizenshipNo, branch: data.branch }),
      },
    });
    return NextResponse.json({ success: true, trackingId: application.trackingId });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: "Invalid data", details: e.issues }, { status: 422 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
