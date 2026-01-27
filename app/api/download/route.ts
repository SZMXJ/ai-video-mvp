// /app/api/download/route.ts
import { requireBetaKey } from "@/lib/gate";
import { prisma } from "@/lib/prisma";
import { ensureUserIdByBetaKey } from "@/lib/jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function guessExt(contentType: string | null, url: string) {
  const ct = (contentType || "").toLowerCase();
  if (ct.includes("video")) return "mp4";
  if (ct.includes("png")) return "png";
  if (ct.includes("jpeg") || ct.includes("jpg")) return "jpg";
  if (ct.includes("webp")) return "webp";
  const m = url.split("?")[0].match(/\.([a-z0-9]+)$/i);
  return m?.[1] || "bin";
}

export async function GET(req: Request) {
  const g = requireBetaKey(req);
  if (!g.ok) return g.res;

  const { searchParams } = new URL(req.url);
  const jobId = (searchParams.get("jobId") || "").trim();
  if (!jobId) {
    return new Response(JSON.stringify({ error: "Missing jobId" }), { status: 400 });
  }

  const userId = await ensureUserIdByBetaKey(g.betaKey);

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { userId: true, result: true },
  });

  if (!job || job.userId !== userId) {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  }

  const r = (job.result ?? {}) as any;
  const url = r.outputUrl as string | undefined;
  if (!url) {
    return new Response(JSON.stringify({ error: "No outputUrl yet" }), { status: 400 });
  }

  const upstream = await fetch(url);
  if (!upstream.ok || !upstream.body) {
    return new Response(JSON.stringify({ error: "Upstream fetch failed" }), { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") || "application/octet-stream";
  const ext = guessExt(contentType, url);

  const headers = new Headers();
  headers.set("Content-Type", contentType);
  headers.set("Content-Disposition", `attachment; filename="uniseeai_${jobId}.${ext}"`);

  return new Response(upstream.body, { status: 200, headers });
}
