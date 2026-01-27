"use client";

import React from "react";
import type { CreateMode } from "@/lib/pricing";
import type { ModeFormState } from "../../createLib/types";
import { RECRAFT_SIZES } from "../../createLib/constants";

type Props = {
  mode: CreateMode;
  form: ModeFormState;
  setForms: React.Dispatch<React.SetStateAction<Record<CreateMode, ModeFormState>>>;
};

export default function FluxEditSize({ mode, form, setForms }: Props) {
  // 只在 I+T2I + flux edit 模型出现
  if (!(mode === "I+T2I" && form.modelId === "fal-ai/flux-2/lora/edit")) return null;

  return (
    <div className="mb-4">
      <div className="mb-2 text-sm text-white/60">Output size</div>
      <select
        value={form.imageSize}
        onChange={(e) =>
          setForms((prev) => ({
            ...prev,
            [mode]: { ...prev[mode], imageSize: e.target.value as any },
          }))
        }
        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm outline-none focus:border-cyan-400"
      >
        {RECRAFT_SIZES.map((s) => (
          <option key={s} value={s} className="bg-black text-white">
            {s}
          </option>
        ))}
      </select>
    </div>
  );
}
