"use client";

import React from "react";

export default function TopBar(props: {
  betaKey: string;
  onBetaKeyChange: (v: string) => void;
  credits: number;
  onTopUp: (pack: "10" | "30" | "100") => void;
  mobileToggle?: React.ReactNode; // 传入 <MobileCreatePreviewToggle .../> 用
}) {
  const { betaKey, onBetaKeyChange, credits, onTopUp, mobileToggle } = props;

  return (
    <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="text-xl font-semibold">Create</div>
        <div className="text-xs text-white/50">fal models · beta gated · Stripe top-up · real credits</div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
          <div className="mb-1 text-[10px] text-white/50">Beta Key</div>
          <input
            value={betaKey}
            onChange={(e) => onBetaKeyChange(e.target.value)}
            placeholder="beta_xxx"
            className="w-[220px] rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-sm outline-none focus:border-cyan-400"
          />
        </div>

        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
          Credits: <span className="font-semibold text-cyan-300">{credits}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onTopUp("10")}
            className="rounded-full bg-cyan-400 px-3 py-2 font-medium text-black hover:bg-cyan-300"
          >
            Top up $10
          </button>
          <button
            onClick={() => onTopUp("30")}
            className="rounded-full bg-white/10 px-3 py-2 text-white/80 hover:bg-white/15"
          >
            $30
          </button>
          <button
            onClick={() => onTopUp("100")}
            className="rounded-full bg-white/10 px-3 py-2 text-white/80 hover:bg-white/15"
          >
            $100
          </button>
        </div>
      </div>

      {mobileToggle ? mobileToggle : null}
    </div>
  );
}
