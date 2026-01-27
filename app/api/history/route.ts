// /app/api/history/route.ts
import { NextResponse } from "next/server";
import { requireBetaKey } from "@/lib/gate";
import { prisma } from "@/lib/prisma";
import { ensureUserIdByBetaKey } from "@/lib/jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const g = requireBetaKey(req);
  if (!g.ok) return g.res;

  const { searchParams } = new URL(req.url);
  const mode = (searchParams.get("mode") || "").trim();
  const limit = Math.min(Number(searchParams.get("limit") || 20), 50);
  const cursor = searchParams.get("cursor"); // createdAt millis string (optional)

  if (!mode) {
    return NextResponse.json({ error: "Missing mode" }, { status: 400 });
  }

  const userId = await ensureUserIdByBetaKey(g.betaKey);

  const where: any = { userId, mode };
  if (cursor) {
    const ms = Number(cursor);
    if (!Number.isNaN(ms)) {
      where.createdAt = { lt: new Date(ms) };
    }
  }

  const rows = await prisma.job.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    select: {
      id: true,
      mode: true,
      modelId: true,
      requestId: true,
      status: true,
      prompt: true,
      inputJson: true,
      outputJson: true,
      result: true,
      createdAt: true,
    },
  });

  const hasMore = rows.length > limit;
  const items = rows.slice(0, limit).map((r) => {
    const resultObj = (r.result ?? {}) as any;
    return {
      id: r.id,
      mode: r.mode,
      modelId: r.modelId,
      requestId: r.requestId,
      status: r.status,
      prompt: r.prompt ?? "",
      outputUrl: resultObj.outputUrl,
      outputType: resultObj.outputType,
      chargedCredits: resultObj.chargedCredits,
      createdAt: r.createdAt.getTime(),
    };
  });

  const nextCursor = hasMore ? String(items[items.length - 1]?.createdAt ?? "") : null;

  return NextResponse.json({ items, nextCursor });
}
