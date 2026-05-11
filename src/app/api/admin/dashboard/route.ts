import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [totalMembers, pendingMembers, totalLoans, pendingLoans, totalKyc, pendingKyc, totalGrievances, openGrievances] = await Promise.all([
      prisma.member.count(),
      prisma.member.count({ where: { approvalStatus: "pending" } }),
      prisma.loanApplication.count(),
      prisma.loanApplication.count({ where: { status: "pending" } }),
      prisma.kycApplication.count(),
      prisma.kycApplication.count({ where: { status: "pending" } }),
      prisma.grievance.count(),
      prisma.grievance.count({ where: { status: "pending" } }),
    ]);
    return NextResponse.json({
      totalMembers, pendingMembers,
      totalLoans, pendingLoans,
      totalKyc, pendingKyc,
      totalGrievances, openGrievances,
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
