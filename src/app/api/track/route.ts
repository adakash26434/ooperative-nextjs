import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")?.trim().toUpperCase();
  if (!id) return NextResponse.json({ error: "Tracking ID required" }, { status: 400 });

  try {
    // Check loan applications
    const loan = await prisma.loanApplication.findUnique({ where: { trackingId: id } });
    if (loan) {
      return NextResponse.json({ type: "loan", trackingId: loan.trackingId, status: loan.status, fullName: loan.fullName, loanType: loan.loanType, createdAt: loan.createdAt, remarks: loan.remarks });
    }
    // Check KYC
    const kyc = await prisma.kycApplication.findUnique({ where: { trackingId: id } });
    if (kyc) {
      return NextResponse.json({ type: "kyc", trackingId: kyc.trackingId, status: kyc.status, fullName: kyc.fullName, createdAt: kyc.createdAt, remarks: kyc.remarks });
    }
    // Check grievances
    const grievance = await prisma.grievance.findUnique({ where: { trackingId: id } });
    if (grievance) {
      return NextResponse.json({ type: "grievance", trackingId: grievance.trackingId, status: grievance.status, name: grievance.name, subject: grievance.subject, createdAt: grievance.createdAt, remarks: grievance.remarks });
    }
    return NextResponse.json({ error: "Tracking ID not found" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
