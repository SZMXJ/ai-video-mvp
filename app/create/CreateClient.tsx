"use client";

import React, { useMemo, useRef, useState } from "react";
import type { CreateMode, ModelId } from "@/lib/pricing";
import { quotePrice } from "@/lib/pricing";
import { getModelUI, modelsByMode } from "@/lib/modelCatalog";

import type { HistoryItem, ModeFormState } from "./createLib/types";
import { buildFalInput } from "./createLib/falInput";

import TopBar from "./components/TopBar";
import ModeTabsMobile from "./components/ModeTabsMobile";
import ModeTabsSidebar from "./components/ModeTabsSidebar";
import EditorPanel from "./components/EditorPanel";
import PreviewPanel from "./components/PreviewPanel";

import { useBetaKey } from "./hooks/useBetaKey";
import { useResizableSplit } from "./hooks/useResizableSplit";
import { useCredits } from "./hooks/useCredits";
import { useCreateForms } from "./hooks/useCreateForms";
import { useHistory } from "./hooks/useHistory";

import { useUploadImage } from "./hooks/useUploadImage";
import { useRunGeneration } from "./hooks/useRunGeneration";
import { useResumeOne } from "./hooks/useResumeOne";
import { useUpgrade } from "./hooks/useUpgrade";

/** ✅ 给 useCreateForms 用的默认表单（避免 undefined） */
function makeDefaultForm(mode: CreateMode): ModeFormState {
  const first = modelsByMode(mode)[0]?.id as ModelId;

  return {
    modelId: first,
    prompt: "",
    negativePrompt: "",
    aspectRatio: "Auto",
    seconds: 4,
    audioEnabled: false,

    imageFile: null,
    imagePreviewUrl: null,
    imageMeta: null,

    recraftStyle: "realistic_image" as any,
    recraftSize: "square" as any,
    imageSize: "square" as any,
  } as ModeFormState;
}

export default function CreateClient() {
  /* ---------- beta key + api ---------- */
  const { betaKey, saveBetaKey, apiFetch } = useBetaKey();

  /* ---------- layout split ---------- */
  const shellRef = useRef<HTMLDivElement>(null!);
  const { splitPct, dividerHandlers } = useResizableSplit(shellRef);

  /* ---------- forms hook（你的真实签名：useCreateForms(makeDefaultForm)） ---------- */
  const {
    mode,
    forms,
    setForms,
    form,
    modelUI,
    models, // Array<{id,name}>
    switchMode,
    setModelId,
  } = useCreateForms(makeDefaultForm);

  /* ---------- credits ---------- */
  const { credits, refreshCredits } = useCredits(betaKey);

  /* ---------- mobile view ---------- */
  const [mobileView, setMobileView] = useState<"create" | "preview">("create");

  /* ---------- history（你刚刚贴过 return 字段） ---------- */
  const {
    history,
    setHistory,
    nextCursor,
    historyLoading,
    fetchHistory,
    updateHistoryItemById,
    updateHistoryItemByRequestId,
  } = useHistory({ betaKey, apiFetch, mode });

  /* ---------- upgrade（你的真实 hook 需要 apiFetch 参数） ---------- */
  const { onUpgrade } = useUpgrade(apiFetch);

  /* ---------- busy ---------- */
  const [busy, setBusy] = useState(false);

  /* ---------- upload image ---------- */
  const { uploadImage } = useUploadImage({
    betaKey,
    forms,
    setForms,
  });

  /* ---------- run generation ---------- */
  const { run } = useRunGeneration({
    betaKey,
    mode,
    forms,
    setForms,
    setBusy,
    apiFetch,
    refreshCredits,
    fetchHistory,
    setHistory,
    updateHistoryItemById,
    updateHistoryItemByRequestId,
    setMobileView,
    uploadImage,
  });

  /* ---------- resume one ---------- */
  const { resumeOne } = useResumeOne({
    betaKey,
    apiFetch,
    refreshCredits,
    fetchHistory,
    updateHistoryItemByRequestId,
  });

  /* ---------- feed ---------- */
  const feed = useMemo<HistoryItem[]>(() => {
    return [...history].sort((a, b) => b.createdAt - a.createdAt);
  }, [history]);

  /* ---------- editor options / assist（兜底稳定版） ---------- */
  const aspectOptions = useMemo(
    () => ["Auto", "1:1", "16:9", "9:16", "4:3", "21:9"],
    []
  );
  const durationOptions = useMemo(() => [4, 8, 12], []);
  const assist = useMemo(
    () => ({
      assist: "Add subject + camera + lighting + motion. Be specific for best results.",
      examples: [
        "cinematic close-up portrait, soft rim light, shallow depth of field, 35mm film grain",
        "wide shot, neon cyberpunk street in rain, volumetric light, high contrast",
      ],
    }),
    []
  );

  /* ---------- patch form（EditorPanel 需要 Partial<ModeFormState>） ---------- */
  const onPatchForm = (patch: Partial<ModeFormState>) => {
    setForms((prev) => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        ...patch,
      },
    }));
  };

  /* ---------- estimate credits ---------- */
  const est = useMemo(() => {
    try {
      const cur = forms[mode];
      const m = getModelUI(cur.modelId);

      if (m.supports.imageInput && !cur.imageFile) return null;

      const input = buildFalInput({
        mode,
        modelId: cur.modelId,
        prompt: cur.prompt,
        negativePrompt: cur.negativePrompt,
        aspectRatio: cur.aspectRatio,
        seconds: cur.seconds,
        audioEnabled: cur.audioEnabled,
        imageUrl: m.supports.imageInput ? "https://example.com/input.png" : undefined,
        recraftStyle: cur.recraftStyle,
        recraftSize: cur.recraftSize,
        imageSize: cur.imageSize,
      });

      return quotePrice({
        mode,
        modelId: cur.modelId,
        input,
        imageMeta: cur.imageMeta ?? undefined,
      });
    } catch {
      return null;
    }
  }, [forms, mode]);

  return (
    <main className="min-h-[calc(100vh-72px)] bg-black text-white">
      <div className="mx-auto w-full px-3 py-3 sm:px-4 sm:py-4 2xl:px-10">
        {/* TopBar 对齐你给的 TopBar.tsx */}
        <TopBar
          betaKey={betaKey}
          onBetaKeyChange={saveBetaKey}
          credits={credits}
          onTopUp={onUpgrade}
          mobileToggle={
            <button
              type="button"
              onClick={() => setMobileView((v) => (v === "create" ? "preview" : "create"))}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10 lg:hidden"
            >
              {mobileView === "create" ? "Preview" : "Create"}
            </button>
          }
        />

        <div
          ref={shellRef}
          className="w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] lg:grid"
          style={{
            gridTemplateColumns: `72px minmax(420px, ${splitPct}%) 8px minmax(520px, ${
              100 - splitPct
            }%)`,
          }}
        >
          {/* Mobile tabs（只在移动端显示） */}
          <div className="lg:hidden">
            <ModeTabsMobile mode={mode} onSwitch={switchMode} />
          </div>

          {/* Desktop sidebar（只在桌面显示） */}
          <div className="hidden lg:block">
            <ModeTabsSidebar mode={mode} onSwitch={switchMode} />
          </div>

          {/* Editor */}
          <EditorPanel
            mode={mode}
            form={form}
            modelUI={modelUI}
            modelOptions={models}
            aspectOptions={aspectOptions}
            durationOptions={durationOptions}
            assist={assist}
            est={est}
            busy={busy}
            onRun={run}
            onSetModelId={setModelId}
            onPatchForm={onPatchForm}
          />

          {/* Divider */}
          <div className="hidden lg:block">
            <div
              {...dividerHandlers}
              className="relative h-full w-[8px] cursor-col-resize bg-white/5 hover:bg-white/10"
              title="Drag to resize"
            />
          </div>

          {/* Preview */}
          <PreviewPanel mobileView={mobileView} feed={feed} onRefresh={resumeOne} />

          {/* 如果你未来想做“加载更多”，你可以在 PreviewPanel 内部用 nextCursor/historyLoading */}
          {/* <div className="hidden">{String(nextCursor)}{String(historyLoading)}</div> */}
        </div>
      </div>
    </main>
  );
}
