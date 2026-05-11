import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) map[s.settingKey] = s.settingValue ?? "";
    return NextResponse.json(map);
  } catch {
    return NextResponse.json({}, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const updates: Record<string, string> = await req.json();
    await Promise.all(
      Object.entries(updates).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { settingKey: key },
          update: { settingValue: value },
          create: { settingKey: key, settingValue: value },
        })
      )
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
