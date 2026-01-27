"use client";

import { useEffect, useState } from "react";
import type { CreateMode, ModelId } from "@/lib/pricing";
import type { HistoryItem } from "../createLib/types";

export function useHistoryDb(args: {
  betaKey: string;
  mode: CreateMode;
  apiFetch: (url: string, init?: RequestInit) => Promise<Response>;
}) {
  const { betaKey, mode, apiFetch } = args;

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  async function fetchHistory(currentMode: CreateMode, cursor?: string) {
    if (!betaKey) return;
    setHistoryLoading(true);

    try {
      const qs = new URLSearchParams({ mode: currentMode, limit: "20" });
      if (cursor) qs.set("cursor", cursor);

      const res = await apiFetch(`/api/history?${qs.toString()}`, { method: "GET" });
      const j = await res.json();
      if (!res.ok) throw new Error(j?.error ?? "History error");

      const items = (j.items ?? []) as any[];

      const mapped: HistoryItem[] = items.map((x) => ({
        id: String(x.id),
        mode: x.mode as CreateMode,
        modelId: x.modelId as ModelId,
        createdAt: Number(x.createdAt),
        status: x.status,
        requestId: x.requestId ?? undefined,
        prompt: x.prompt ?? undefined,
        outputUrl: x.outputUrl ?? undefined,
        outputType: x.outputType ?? undefined,
        chargedCredits: typeof x.chargedCredits === "number" ? x.chargedCredits : Number(x.chargedCredits ?? 0),
        input: {}, // ✅ DB history 只用于展示，不必存 input
        imageMeta: x.imageMeta ?? undefined,
        error: x.error ?? undefined,
      }));

      if (cursor) setHistory((h) => [...h, ...mapped]);
      else setHistory(mapped);

      setNextCursor(j.nextCursor ?? null);
    } finally {
      setHistoryLoading(false);
    }
  }

  useEffect(() => {
    if (!betaKey) return;
    fetchHistory(mode).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [betaKey, mode]);

  function updateHistoryItemById(id: string, patch: Partial<HistoryItem>) {
    setHistory((h) => h.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function updateHistoryItemByRequestId(requestId: string, patch: Partial<HistoryItem>) {
    setHistory((h) => h.map((it) => (it.requestId === requestId ? { ...it, ...patch } : it)));
  }

  return {
    history,
    setHistory,
    nextCursor,
    historyLoading,
    fetchHistory,
    updateHistoryItemById,
    updateHistoryItemByRequestId,
  };
}
