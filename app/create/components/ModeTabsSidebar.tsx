"use client";

import React from "react";
import type { CreateMode } from "@/lib/pricing";
import { MODE_TABS } from "../createLib/constants";

type Props = {
  mode: CreateMode;
  onSwitch: (m: CreateMode) => void;
};

export default function ModeTabsSidebar({ mode, onSwitch }: Props) {
  return (
    <aside className="hidden shrink-0 border-b border-white/10 bg-black/30 lg:block lg:w-[72px] lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-2 overflow-x-auto p-3 lg:h-full lg:flex-col lg:overflow-x-visible">
        {MODE_TABS.map((t) => {
          const a = t.mode === mode;
          return (
            <button
              key={t.mode}
              onClick={() => onSwitch(t.mode)}
              className={[
                "shrink-0 w-[120px] rounded-xl px-2 py-2 text-center transition lg:w-[56px]",
                a ? "bg-cyan-400 text-black" : "bg-white/5 text-white/70 hover:bg-white/10",
              ].join(" ")}
              title={t.sub}
            >
              <div className="text-xs font-bold">{t.label}</div>
              <div className="mt-1 text-[10px] opacity-80">{t.sub}</div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
