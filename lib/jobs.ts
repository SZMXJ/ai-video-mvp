// /lib/jobs.ts
import { prisma } from "@/lib/prisma";

export type OutputType = "video" | "image";

export function pickOutputFromFal(res: any): { url?: string; type?: OutputType } {
  const data = res?.data ?? res;

  if (data?.video?.url) return { url: data.video.url, type: "video" };
  if (Array.isArray(data?.videos) && data.videos[0]?.url) return { url: data.videos[0].url, type: "video" };

  if (Array.isArray(data?.images) && data.images[0]?.url) return { url: data.images[0].url, type: "image" };
  if (data?.image?.url) return { url: data.image.url, type: "image" };

  return {};
}

export async function ensureUserIdByBetaKey(betaKey: string) {
  const u = await prisma.user.upsert({
    where: { betaKey },
    update: {},
    create: { betaKey, credits: 0 },
    select: { id: true },
  });
  return u.id;
}

export async function createJob(params: {
  betaKey: string;
  mode: string;
  modelId: string;
  requestId: string;
  prompt?: string | null;
  inputJson: any;
  chargedCredits?: number;
}) {
  const userId = await ensureUserIdByBetaKey(params.betaKey);

  return prisma.job.create({
    data: {
      userId,
      mode: params.mode,
      modelId: params.modelId,
      requestId: params.requestId,
      status: "QUEUED",
      prompt: params.prompt ?? null,
      inputJson: params.inputJson,
      // 把 chargedCredits 放进 result，方便历史展示
      result: typeof params.chargedCredits === "number" ? { chargedCredits: params.chargedCredits } : undefined,
    },
    select: { id: true, requestId: true },
  });
}

export async function updateJobStatusByRequestId(requestId: string, status: string) {
  return prisma.job.update({
    where: { requestId },
    data: { status },
    select: { id: true, status: true },
  });
}

export async function completeJobByRequestId(requestId: string, outputJson: any) {
  const { url, type } = pickOutputFromFal(outputJson);
  return prisma.job.update({
    where: { requestId },
    data: {
      status: "COMPLETED",
      outputJson: outputJson?.data ?? outputJson,
      result: {
        ...(typeof outputJson === "object" && outputJson ? {} : {}),
        outputUrl: url,
        outputType: type,
      },
    },
    select: { id: true },
  });
}
