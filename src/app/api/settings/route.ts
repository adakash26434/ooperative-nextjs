import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.settingKey] = s.settingValue ?? "";
    }
    return NextResponse.json(map);
  } catch {
    return NextResponse.json({}, { status: 500 });
  }
}
