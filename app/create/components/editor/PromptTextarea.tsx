"use client";

import React from "react";
import type { CreateMode } from "@/lib/pricing";
import type { ModeFormState } from "../../createLib/types";

type Props = {
  mode: CreateMode;
  form: ModeFormState;
  modelSupportsPrompt: boolean;
  setForms: React.Dispatch<React.SetStateAction<Record<CreateMode, ModeFormState>>>;
};

export default function PromptTextarea({ mode, form, modelSupportsPrompt, setForms }: Props) {
  if (!modelSupportsPrompt) return null;

  const isOptional = form.modelId === "fal-ai/clarity-upscaler";

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/60">
          Prompt {isOptional ? <span className="text-white/40">(optional)</span> : null}
        </div>
        <div className="text-xs text-white/40">{form.prompt.length} chars</div>
      </div>

      <textarea
        value={form.prompt}
        onChange={(e) =>
          setForms((prev) => ({
            ...prev,
            [mode]: { ...prev[mode], prompt: e.target.value },
          }))
        }
        placeholder={isOptional ? "Optional: add mild quality hints..." : "Describe what you want…"}
        className="mt-2 h-[160px] w-full resize-none rounded-xl border border-white/10 bg-black/40 p-3 text-sm outline-none focus:border-cyan-400"
      />
    </div>
  );
}
