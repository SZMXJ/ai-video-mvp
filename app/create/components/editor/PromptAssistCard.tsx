"use client";

import React from "react";
import type { CreateMode } from "@/lib/pricing";
import type { ModeFormState } from "../../createLib/types";
import { ASSIST_BY_MODE } from "../../createLib/constants";

type Props = {
  mode: CreateMode;
  form: ModeFormState;
  setForms: React.Dispatch<React.SetStateAction<Record<CreateMode, ModeFormState>>>;
};

export default function PromptAssistCard({ mode, setForms }: Props) {
  const assist = ASSIST_BY_MODE[mode];

  return (
    <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="text-xs font-semibold text-white/80">Prompt Assist</div>
      <div className="mt-1 text-xs text-white/60 leading-relaxed">{assist.assist}</div>

      <div className="mt-3 grid gap-2">
        {assist.examples.slice(0, 3).map((ex, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() =>
              setForms((prev) => ({
                ...prev,
                [mode]: { ...prev[mode], prompt: ex },
              }))
            }
            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-left text-xs text-white/70 hover:bg-black/40"
            title="Click to use this example"
          >
            Try: {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
