"use client";

import { useEffect, useState } from "react";

export function useCredits(betaKey: string) {
  const [credits, setCredits] = useState<number>(0);

  async function refreshCredits() {
    if (!betaKey) return;

    const res = await fetch("/api/billing/balance", {
      method: "GET",
      headers: { "x-beta-key": betaKey },
    });

    if (res.ok) {
      const j = await res.json();
      setCredits(Number(j.credits ?? 0));
    }
  }

  useEffect(() => {
    refreshCredits().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [betaKey]);

  return { credits, setCredits, refreshCredits };
}
