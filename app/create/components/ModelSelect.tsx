"use client";

import React from "react";
import type { ModelId } from "@/lib/pricing";

type ModelOption = { id: ModelId; name: string };

type Props = {
  value: ModelId;
  options: ModelOption[];
  onChange: (id: ModelId) => void;
};

export default function ModelSelect({ value, options, onChange }: Props) {
  return (
    <div className="mb-4">
      <div className="mb-2 text-sm text-white/60">Model</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ModelId)}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm text-white outline-none focus:border-cyan-400"
      >
        {options.map((m) => (
          <option key={m.id} value={m.id} className="bg-black text-white">
            {m.name}
          </option>
        ))}
      </select>
    </div>
  );
}
