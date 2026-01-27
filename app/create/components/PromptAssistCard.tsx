"use client";

import React from "react";

type Props = {
  title?: string;
  assist: string;
  examples: string[];
  onPickExample: (text: string) => void;
};

export default function PromptAssistCard({ title = "Prompt Assist", assist, examples, onPickExample }: Props) {
  return (
    <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="text-xs font-semibold text-white/80">{title}</div>
      <div className="mt-1 text-xs text-white/60 leading-relaxed">{assist}</div>

      <div className="mt-3 grid gap-2">
        {examples.slice(0, 3).map((ex, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onPickExample(ex)}
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
