import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  auctionId: z.number().int().positive(),
  bidderName: z.string().min(2),
  bidderPhone: z.string().min(7),
  bidderEmail: z.string().email().optional().or(z.literal("")),
  bidAmount: z.number().positive(),
  note: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const bid = await prisma.auctionBid.create({
      data: {
        auctionId: body.auctionId,
        bidderName: body.bidderName,
        bidderPhone: body.bidderPhone,
        bidderEmail: body.bidderEmail || null,
        bidAmount: body.bidAmount,
        note: body.note || null,
      },
    });
    return NextResponse.json({ success: true, id: bid.id });
  } catch (e) {
    if (e instanceof z.ZodError) return NextResponse.json({ error: "Invalid data" }, { status: 422 });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const auctions = await prisma.auctionNotice.findMany({
      where: { isActive: true },
      orderBy: { auctionDate: "desc" },
    });
    return NextResponse.json(auctions);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
