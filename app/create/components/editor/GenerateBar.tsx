"use client";

import React from "react";

type Props = {
  busy: boolean;
  estText: string; // 例如 "12 credits" or "—"
  onGenerate: () => void;
};

export default function GenerateBar({ busy, estText, onGenerate }: Props) {
  return (
    <>
      <div className="flex items-center gap-3">
        <button
          disabled={busy}
          onClick={onGenerate}
          className={[
            "flex-1 rounded-2xl py-4 font-semibold transition",
            busy ? "bg-white/10 text-white/40" : "bg-cyan-400 text-black hover:bg-cyan-300",
          ].join(" ")}
        >
          {busy ? "Generating..." : "Generate"}
        </button>

        <div className="min-w-[140px] rounded-2xl border border-white/10 bg-black/40 px-3 py-3 text-center">
          <div className="text-[10px] text-white/50">Estimated</div>
          <div className="text-sm font-semibold text-white">{estText}</div>
        </div>
      </div>

      <div className="mt-3 text-xs text-white/40 leading-relaxed">
        Credits are charged on submit. If the job fails, credits are automatically refunded.
      </div>
    </>
  );
}
