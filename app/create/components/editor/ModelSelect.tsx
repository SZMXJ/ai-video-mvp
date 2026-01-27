"use client";

import React from "react";
import type { CreateMode, ModelId } from "@/lib/pricing";
import type { ModeFormState } from "../../createLib/types";

type ModelOption = { id: ModelId; name: string };

type Props = {
  mode: CreateMode;
  form: ModeFormState;
  models: ModelOption[];
  setModelId: (nextId: ModelId) => void;
};

export default function ModelSelect({ form, models, setModelId }: Props) {
  const current = (form as any).modelId as ModelId | undefined;

  return (
    <div className="mb-4">
      <div className="mb-2 text-sm text-white/60">Model</div>

      <select
        value={current ?? models[0]?.id ?? ""}
        onChange={(e) => {
          const next = e.target.value as ModelId;
          setModelId(next);
        }}
        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm text-white outline-none focus:border-cyan-400"
        disabled={models.length === 0}
      >
        {models.length === 0 ? (
          <option value="" className="bg-black text-white">
            No models available
          </option>
        ) : (
          models.map((m) => (
            <option key={m.id} value={m.id} className="bg-black text-white">
              {m.name}
            </option>
          ))
        )}
      </select>
    </div>
  );
}
