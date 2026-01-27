"use client";

import type { CreateMode } from "@/lib/pricing";
import type { HistoryItem } from "../createLib/types";
import { pickOutputUrl } from "../createLib/output";

export function useResumeOne(args: {
  betaKey: string;
  apiFetch: (url: string, init?: RequestInit) => Promise<Response>;
  refreshCredits: () => Promise<void>;
  fetchHistory: (mode: CreateMode, cursor?: string) => Promise<void>;
  updateHistoryItemByRequestId: (requestId: string, patch: Partial<HistoryItem>) => void;
}) {
  const { betaKey, apiFetch, refreshCredits, fetchHistory, updateHistoryItemByRequestId } = args;

  async function resumeOne(item: HistoryItem) {
    if (!betaKey) return;
    if (!item.requestId) return;
    if (item.outputUrl) return;

    const statusRes = await apiFetch("/api/fal/status", {
      method: "POST",
      body: JSON.stringify({
        modelId: item.modelId,
        requestId: item.requestId,
        chargedCredits: item.chargedCredits ?? 0,
      }),
    });

    const statusJson = await statusRes.json();
    const st = statusJson.status as HistoryItem["status"];
    updateHistoryItemByRequestId(item.requestId, { status: st });

    if (st === "COMPLETED") {
      const resultRes = await apiFetch("/api/fal/result", {
        method: "POST",
        body: JSON.stringify({ modelId: item.modelId, requestId: item.requestId }),
      });

      const resultJson = await resultRes.json();
      const data = resultJson?.data ?? resultJson;
      const { url, type } = pickOutputUrl(data);

      updateHistoryItemByRequestId(item.requestId, {
        status: "COMPLETED",
        outputUrl: url,
        outputType: type,
      });

      await refreshCredits();
      await fetchHistory(item.mode);
      return;
    }

    if (st === "FAILED") {
      updateHistoryItemByRequestId(item.requestId, {
        status: "FAILED",
        error: statusJson?.error ?? "FAILED",
      });

      await refreshCredits();
      await fetchHistory(item.mode);
      return;
    }
  }

  return { resumeOne };
}
