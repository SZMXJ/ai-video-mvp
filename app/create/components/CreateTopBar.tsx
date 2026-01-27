"use client";

import React from "react";
import type { CreateMode } from "@/lib/pricing";
import type { HistoryItem } from "../createLib/types";
import { MODE_TABS } from "../createLib/constants";

type Props = {
  betaKey: string;
  onBetaKeyChange: (v: string) => void;

  credits: number;

  onUpgrade: (pack: "10" | "30" | "100") => void;

  mode: CreateMode;
  onSwitchMode: (m: CreateMode) => void;

  mobileView: "create" | "preview";
  setMobileView: (v: "create" | "preview") => void;

  // 仅用于显示副标题，可不传
  subtitle?: string;

  // 可选：将来你要在 topbar 放 “刷新/恢复”等动作也方便
  busy?: boolean;
  history?: HistoryItem[];
};

export default function CreateTopBar(props: Props) {
  const {
    betaKey,
    onBetaKeyChange,
    credits,
    onUpgrade,
    mode,
    onSwitchMode,
    mobileView,
    setMobileView,
    subtitle = "fal models · beta gated · Stripe top-up · real credits",
  } = props;

  return (
    <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="text-xl font-semibold">Create</div>
        <div className="text-xs text-white/50">{subtitle}</div>
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
            onClick={() => onUpgrade("10")}
            className="rounded-full bg-cyan-400 px-3 py-2 font-medium text-black hover:bg-cyan-300"
          >
            Top up $10
          </button>
          <button
            onClick={() => onUpgrade("30")}
            className="rounded-full bg-white/10 px-3 py-2 text-white/80 hover:bg-white/15"
          >
            $30
          </button>
          <button
            onClick={() => onUpgrade("100")}
            className="rounded-full bg-white/10 px-3 py-2 text-white/80 hover:bg-white/15"
          >
            $100
          </button>
        </div>
      </div>

      {/* ✅ Mobile / Tablet: Create / Preview toggle */}
      <div className="flex w-full items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/5 p-1 lg:hidden">
        <button
          onClick={() => setMobileView("create")}
          className={[
            "flex-1 rounded-2xl px-3 py-2 text-sm font-semibold transition",
            mobileView === "create" ? "bg-cyan-400 text-black" : "text-white/80 hover:bg-white/10",
          ].join(" ")}
        >
          Create
        </button>
        <button
          onClick={() => setMobileView("preview")}
          className={[
            "flex-1 rounded-2xl px-3 py-2 text-sm font-semibold transition",
            mobileView === "preview" ? "bg-cyan-400 text-black" : "text-white/80 hover:bg-white/10",
          ].join(" ")}
        >
          Preview
        </button>
      </div>

      {/* ✅ Mobile mode tabs（横向滚动） */}
      <div className="lg:hidden border-b border-white/10 bg-black/30 rounded-2xl overflow-hidden">
        <div className="flex items-center gap-2 overflow-x-auto p-2">
          {MODE_TABS.map((t) => {
            const a = t.mode === mode;
            return (
              <button
                key={t.mode}
                onClick={() => onSwitchMode(t.mode)}
                className={[
                  "shrink-0 rounded-2xl px-3 py-2 text-xs font-bold transition",
                  a ? "bg-cyan-400 text-black" : "bg-white/5 text-white/70 hover:bg-white/10",
                ].join(" ")}
                title={t.sub}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
