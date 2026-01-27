"use client";

import React, { useMemo } from "react";
import type { CreateMode, ModelId } from "@/lib/pricing";
import type { ModeFormState } from "../createLib/types";

import ModelSelect from "./ModelSelect";
import PromptAssistCard from "./PromptAssistCard";

const RECRAFT_SIZES = ["square", "square_hd", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"] as const;
const RECRAFT_STYLES = ["realistic_image", "digital_illustration", "vector_illustration"] as const;

type Est = { sellCredits: number } | null;

type Props = {
  mode: CreateMode;

  form: ModeFormState;

  // 来自 getModelUI(form.modelId)
  modelUI: any;

  // 来自 modelsByMode(mode)
  modelOptions: Array<{ id: ModelId; name: string }>;

  aspectOptions: string[];
  durationOptions: number[];

  assist: { assist: string; examples: string[] };

  est: Est;

  busy: boolean;
  onRun: () => void;

  // 父组件里用 setModelId(nextId)
  onSetModelId: (id: ModelId) => void;

  // 父组件里 setForms((prev)=>({...prev,[mode]:{...prev[mode],...patch}}))
  onPatchForm: (patch: Partial<ModeFormState>) => void;
};

export default function EditorPanel({
  mode,
  form,
  modelUI,
  modelOptions,
  aspectOptions,
  durationOptions,
  assist,
  est,
  busy,
  onRun,
  onSetModelId,
  onPatchForm,
}: Props) {
  const showPrompt = Boolean(modelUI?.supports?.prompt);
  const showImageInput = Boolean(modelUI?.supports?.imageInput);
  const showAspect = Boolean(modelUI?.supports?.aspectRatio);
  const showDuration = Boolean(modelUI?.supports?.duration);
  const showAudio = Boolean(modelUI?.supports?.audio) && form.modelId === "fal-ai/veo3/fast";
  const showNegative = Boolean(modelUI?.supports?.negativePrompt);

  const showRecraft = mode === "T2I" && form.modelId === "fal-ai/recraft/v3/text-to-image";
  const showFluxEditSize = mode === "I+T2I" && form.modelId === "fal-ai/flux-2/lora/edit";

  const promptOptional = form.modelId === "fal-ai/clarity-upscaler";

  const canShowEst = useMemo(() => {
    // 如果模型需要图片但没传，就不显示估算
    if (showImageInput && !form.imageFile) return false;
    return true;
  }, [showImageInput, form.imageFile]);

  return (
    <section className="relative overflow-auto p-4 sm:p-5 lg:h-full">
      <ModelSelect value={form.modelId} options={modelOptions} onChange={onSetModelId} />

      <PromptAssistCard
        assist={assist.assist}
        examples={assist.examples}
        onPickExample={(text) => onPatchForm({ prompt: text })}
      />

      {/* Prompt */}
      {showPrompt && (
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/60">
              Prompt {promptOptional ? <span className="text-white/40">(optional)</span> : null}
            </div>
            <div className="text-xs text-white/40">{(form.prompt ?? "").length} chars</div>
          </div>

          <textarea
            value={form.prompt}
            onChange={(e) => onPatchForm({ prompt: e.target.value })}
            placeholder={promptOptional ? "Optional: add mild quality hints..." : "Describe what you want…"}
            className="mt-2 h-[160px] w-full resize-none rounded-xl border border-white/10 bg-black/40 p-3 text-sm outline-none focus:border-cyan-400"
          />
        </div>
      )}

      {/* Image input */}
      {showImageInput && (
        <div className="mb-4">
          <div className="mb-2 text-sm text-white/60">Image input</div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              onPatchForm({ imageFile: file, imageMeta: null });
            }}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm text-white/70"
          />

          {form.imagePreviewUrl && (
            <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-3">
              <div className="mb-2 text-xs text-white/50">Preview</div>
              <img
                src={form.imagePreviewUrl}
                alt="input preview"
                className="max-h-[240px] w-full rounded-xl border border-white/10 object-contain"
              />
              {form.imageMeta?.width && form.imageMeta?.height && (
                <div className="mt-2 text-xs text-white/50">
                  {form.imageMeta.width}×{form.imageMeta.height} ({(form.imageMeta.mp ?? 0).toFixed(2)} MP)
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Video options */}
      {(showAspect || showDuration) && (
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {showAspect && (
            <div>
              <div className="mb-2 text-sm text-white/60">Aspect ratio</div>
              <select
                value={form.aspectRatio}
                onChange={(e) => onPatchForm({ aspectRatio: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm outline-none focus:border-cyan-400"
              >
                {aspectOptions.map((a) => (
                  <option key={a} value={a} className="bg-black text-white">
                    {a}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showDuration && (
            <div>
              <div className="mb-2 text-sm text-white/60">Duration</div>
              <select
                value={form.seconds}
                onChange={(e) => onPatchForm({ seconds: Number(e.target.value) })}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm outline-none focus:border-cyan-400"
              >
                {durationOptions.map((s) => (
                  <option key={s} value={s} className="bg-black text-white">
                    {s}s
                  </option>
                ))}
              </select>
            </div>
          )}

          {showAudio && (
            <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm text-white/70 sm:col-span-2">
              <input
                type="checkbox"
                checked={form.audioEnabled}
                onChange={(e) => onPatchForm({ audioEnabled: e.target.checked })}
              />
              Enable audio (Veo3 Fast)
            </label>
          )}
        </div>
      )}

      {/* Negative prompt */}
      {showNegative && (
        <div className="mb-4">
          <div className="mb-2 text-sm text-white/60">Negative prompt (optional)</div>
          <input
            value={form.negativePrompt}
            onChange={(e) => onPatchForm({ negativePrompt: e.target.value })}
            placeholder="e.g. blurry, watermark…"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm outline-none focus:border-cyan-400"
          />
        </div>
      )}

      {/* Recraft */}
      {showRecraft && (
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <div className="mb-2 text-sm text-white/60">Style</div>
            <select
              value={form.recraftStyle}
              onChange={(e) => onPatchForm({ recraftStyle: e.target.value as any })}
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
              onChange={(e) => onPatchForm({ recraftSize: e.target.value as any })}
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
      )}

      {/* Flux edit size */}
      {showFluxEditSize && (
        <div className="mb-4">
          <div className="mb-2 text-sm text-white/60">Output size</div>
          <select
            value={form.imageSize}
            onChange={(e) => onPatchForm({ imageSize: e.target.value as any })}
            className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm outline-none focus:border-cyan-400"
          >
            {RECRAFT_SIZES.map((s) => (
              <option key={s} value={s} className="bg-black text-white">
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Generate */}
      <div className="flex items-center gap-3">
        <button
          disabled={busy}
          onClick={onRun}
          className={[
            "flex-1 rounded-2xl py-4 font-semibold transition",
            busy ? "bg-white/10 text-white/40" : "bg-cyan-400 text-black hover:bg-cyan-300",
          ].join(" ")}
        >
          {busy ? "Generating..." : "Generate"}
        </button>

        <div className="min-w-[140px] rounded-2xl border border-white/10 bg-black/40 px-3 py-3 text-center">
          <div className="text-[10px] text-white/50">Estimated</div>
          <div className="text-sm font-semibold text-white">
            {canShowEst && est ? `${est.sellCredits} credits` : "—"}
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-white/40 leading-relaxed">
        Credits are charged on submit. If the job fails, credits are automatically refunded.
      </div>
    </section>
  );
}
