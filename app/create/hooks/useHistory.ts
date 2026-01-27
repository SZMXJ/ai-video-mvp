"use client";

import { useCallback, useEffect, useState } from "react";
import type { CreateMode } from "@/lib/pricing";
import type { HistoryItem } from "../createLib/types";

export function useHistory(params: {
  betaKey: string;
  mode: CreateMode;
  apiFetch: (url: string, init?: RequestInit) => Promise<Response>;
}) {
  const { betaKey, mode, apiFetch } = params;

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchHistory = useCallback(
    async (currentMode: CreateMode, cursor?: string) => {
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
          mode: x.mode,
          modelId: x.modelId,
          createdAt: Number(x.createdAt),
          status: x.status,
          requestId: x.requestId ?? undefined,
          prompt: x.prompt ?? undefined,
          outputUrl: x.outputUrl ?? undefined,
          outputType: x.outputType ?? undefined,
          chargedCredits: typeof x.chargedCredits === "number" ? x.chargedCredits : Number(x.chargedCredits ?? 0),
          input: {}, // ✅ DB 历史不依赖 input
          imageMeta: x.imageMeta ?? undefined,
          error: x.error ?? undefined,
        }));

        if (cursor) setHistory((h) => [...h, ...mapped]);
        else setHistory(mapped);

        setNextCursor(j.nextCursor ?? null);
      } finally {
        setHistoryLoading(false);
      }
    },
    [apiFetch, betaKey]
  );

  // 自动拉取当前 mode 的历史
  useEffect(() => {
    if (!betaKey) return;
    fetchHistory(mode).catch(() => {});
  }, [betaKey, mode, fetchHistory]);

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
    setNextCursor,
    historyLoading,
    fetchHistory,
    updateHistoryItemById,
    updateHistoryItemByRequestId,
  };
}
