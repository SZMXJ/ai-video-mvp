"use client";

import { useEffect, useMemo, useState } from "react";
import type { CreateMode, ModelId } from "@/lib/pricing";
import {
  cheapestModelId,
  getModelUI,
  modelsByMode,
  normalizeAspect,
  normalizeSeconds,
} from "@/lib/modelCatalog";

import type { ModeFormState } from "../createLib/types";

export function useCreateForms(makeDefaultForm: (mode: CreateMode) => ModeFormState) {
  const [mode, setMode] = useState<CreateMode>("T2V");

  const [forms, setForms] = useState<Record<CreateMode, ModeFormState>>(() => {
    const initial: Record<CreateMode, ModeFormState> = {
      T2V: makeDefaultForm("T2V"),
      I2V: makeDefaultForm("I2V"),
      T2I: makeDefaultForm("T2I"),
      "I+T2I": makeDefaultForm("I+T2I"),
    };

    try {
      const raw = localStorage.getItem("create_forms_v1");
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Record<CreateMode, Partial<ModeFormState>>>;
        (Object.keys(initial) as CreateMode[]).forEach((k) => {
          const s = saved?.[k];
          if (!s) return;
          initial[k] = {
            ...initial[k],
            ...s,
            imageFile: null,
            imagePreviewUrl: null,
            imageMeta: null,
          };
        });
      }
    } catch {}

    return initial;
  });

  // persist (只存可序列化字段)
  useEffect(() => {
    const serializable: any = {};
    (Object.keys(forms) as CreateMode[]).forEach((k) => {
      const f = forms[k];
      serializable[k] = {
        modelId: f.modelId,
        prompt: f.prompt,
        negativePrompt: f.negativePrompt,
        aspectRatio: f.aspectRatio,
        seconds: f.seconds,
        audioEnabled: f.audioEnabled,
        recraftStyle: f.recraftStyle,
        recraftSize: f.recraftSize,
        imageSize: f.imageSize,
      };
    });
    localStorage.setItem("create_forms_v1", JSON.stringify(serializable));
  }, [forms]);

  const form = forms[mode];

  const modelUI = useMemo(() => getModelUI(form.modelId), [form.modelId]);
  const models = useMemo(() => modelsByMode(mode), [mode]);

  function switchMode(next: CreateMode) {
    setMode(next);
    setForms((prev) => {
      const cur = prev[next] ?? makeDefaultForm(next);
      return {
        ...prev,
        [next]: {
          ...cur,
          aspectRatio: normalizeAspect(cur.modelId, cur.aspectRatio),
          seconds: normalizeSeconds(cur.modelId, cur.seconds),
        },
      };
    });
  }

  function setModelId(nextId: ModelId) {
    setForms((prev) => {
      const cur = prev[mode];
      const fixedAspect = normalizeAspect(nextId, cur.aspectRatio);
      const fixedSeconds = normalizeSeconds(nextId, cur.seconds);

      return {
        ...prev,
        [mode]: {
          ...cur,
          modelId: nextId,
          aspectRatio: fixedAspect,
          seconds: fixedSeconds,
          // ✅ veo3 才允许保持 audioEnabled，否则强制 false
          audioEnabled: nextId === "fal-ai/veo3/fast" ? cur.audioEnabled : false,
        },
      };
    });
  }

  // per-mode image preview objectURL
  useEffect(() => {
    const f = forms[mode];
    if (!f.imageFile) return;

    const url = URL.createObjectURL(f.imageFile);
    setForms((prev) => ({
      ...prev,
      [mode]: { ...prev[mode], imagePreviewUrl: url },
    }));

    return () => URL.revokeObjectURL(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forms[mode].imageFile]);

  return {
    mode,
    setMode,
    forms,
    setForms,
    form,
    modelUI,
    models,
    switchMode,
    setModelId,
  };
}
