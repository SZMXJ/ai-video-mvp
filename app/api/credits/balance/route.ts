import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { STARTER_CREDITS } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id") || null;

  if (!userId) {
    return NextResponse.json({ credits: STARTER_CREDITS, loggedIn: false });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true },
  });

  if (!user) return NextResponse.json({ credits: 0, loggedIn: true });
  return NextResponse.json({ credits: user.credits, loggedIn: true });
}
