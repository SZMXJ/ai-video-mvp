"use client";

import { useEffect } from "react";
import type { HistoryItem } from "../createLib/types";

export function useAutoResume(args: {
  betaKey: string;
  history: HistoryItem[];
  resumeOne: (item: HistoryItem) => Promise<void>;
}) {
  const { betaKey, history, resumeOne } = args;

  useEffect(() => {
    if (!betaKey) return;
    if (!history.length) return;

    const toResume = history
      .slice(0, 10)
      .filter((it) => it.requestId && !it.outputUrl && it.status !== "FAILED");

    if (!toResume.length) return;

    let cancelled = false;

    (async () => {
      for (const it of toResume) {
        if (cancelled) return;
        try {
          await resumeOne(it);
        } catch {
          // ignore
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [betaKey, history.length]); // ✅ 与你旧版保持一致（只监听长度）
}
