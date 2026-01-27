"use client";

import React from "react";
import type { CreateMode } from "@/lib/pricing";
import type { ModeFormState } from "../../createLib/types";
import { RECRAFT_SIZES, RECRAFT_STYLES } from "../../createLib/constants";

type Props = {
  mode: CreateMode;
  form: ModeFormState;
  setForms: React.Dispatch<React.SetStateAction<Record<CreateMode, ModeFormState>>>;
};

export default function RecraftOptions({ mode, form, setForms }: Props) {
  // 只在 T2I + recraft 模型出现
  if (!(mode === "T2I" && form.modelId === "fal-ai/recraft/v3/text-to-image")) return null;

  return (
    <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <div className="mb-2 text-sm text-white/60">Style</div>
        <select
          value={form.recraftStyle}
          onChange={(e) =>
            setForms((prev) => ({
              ...prev,
              [mode]: { ...prev[mode], recraftStyle: e.target.value as any },
            }))
          }
          className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm outline-none focus:border-cyan-400"
        >
          {RECRAFT_STYLES.map((s) => (
            <option key={s} value={s} className="bg-black text-white">
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="mb-2 text-sm text-white/60">Size</div>
        <select
          value={form.recraftSize}
          onChange={(e) =>
            setForms((prev) => ({
              ...prev,
              [mode]: { ...prev[mode], recraftSize: e.target.value as any },
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
    </div>
  );
}
