"use client";

import { useMemo } from "react";
import type { CreateMode } from "@/lib/pricing";
import type { ModeFormState } from "../createLib/types";
import { getModelUI } from "@/lib/modelCatalog";
import { quotePrice } from "@/lib/pricing";
import { buildFalInput } from "../createLib/falInput";

export function useEstimateCredits(args: {
  mode: CreateMode;
  forms: Record<CreateMode, ModeFormState>;
}) {
  const { mode, forms } = args;

  const est = useMemo(() => {
    try {
      const cur = forms[mode];
      const m = getModelUI(cur.modelId);

      // ✅ 需要图但没选图：不显示估算
      if (m.supports.imageInput && !cur.imageFile) return null;

      const placeholderImageUrl = m.supports.imageInput ? "https://example.com/input.png" : undefined;

      const input = buildFalInput({
        mode,
        modelId: cur.modelId,
        prompt: cur.prompt,
        negativePrompt: cur.negativePrompt,
        aspectRatio: cur.aspectRatio,
        seconds: cur.seconds,
        audioEnabled: cur.audioEnabled,
        imageUrl: placeholderImageUrl,
        recraftStyle: cur.recraftStyle,
        recraftSize: cur.recraftSize,
        imageSize: cur.imageSize,
      });

      const q = quotePrice({
        mode,
        modelId: cur.modelId,
        input,
        imageMeta: cur.imageMeta ?? undefined,
      });

      return q;
    } catch {
      return null;
    }
  }, [forms, mode]);

  return { est };
}
