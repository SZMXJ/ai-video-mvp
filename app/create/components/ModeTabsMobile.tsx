"use client";

import React from "react";
import type { CreateMode } from "@/lib/pricing";
import { MODE_TABS } from "../createLib/constants";

type Props = {
  mode: CreateMode;
  onSwitch: (m: CreateMode) => void;
};

export default function ModeTabsMobile({ mode, onSwitch }: Props) {
  return (
    <div className="lg:hidden border-b border-white/10 bg-black/30">
      <div className="flex items-center gap-2 overflow-x-auto p-2">
        {MODE_TABS.map((t) => {
          const a = t.mode === mode;
          return (
            <button
              key={t.mode}
              onClick={() => onSwitch(t.mode)}
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
  );
}
