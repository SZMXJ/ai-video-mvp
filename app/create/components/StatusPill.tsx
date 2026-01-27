import React from "react";
import type { HistoryStatus } from "../createLib/types";

export default function StatusPill({ s }: { s: HistoryStatus }) {
  const cls =
    s === "COMPLETED"
      ? "bg-emerald-400/15 text-emerald-200 border-emerald-400/25"
      : s === "FAILED"
      ? "bg-rose-400/15 text-rose-200 border-rose-400/25"
      : s === "IN_PROGRESS"
      ? "bg-cyan-400/15 text-cyan-200 border-cyan-400/25"
      : "bg-white/10 text-white/70 border-white/15"; // QUEUED

  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${cls}`}>
      {s}
    </span>
  );
}
