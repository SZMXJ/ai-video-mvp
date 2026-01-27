"use client";

import type React from "react";
import type { CreateMode, ModelId } from "@/lib/pricing";
import { getModelUI } from "@/lib/modelCatalog";
import type { HistoryItem, ModeFormState } from "../createLib/types";
import { pickOutputUrl } from "../createLib/output";
import { buildFalInput } from "../createLib/falInput";

export function useRunGeneration(args: {
  betaKey: string;
  mode: CreateMode;
  forms: Record<CreateMode, ModeFormState>;
  setForms: React.Dispatch<React.SetStateAction<Record<CreateMode, ModeFormState>>>;
  setBusy: (v: boolean) => void;

  apiFetch: (url: string, init?: RequestInit) => Promise<Response>;
  refreshCredits: () => Promise<void>;
  fetchHistory: (mode: CreateMode, cursor?: string) => Promise<void>;

  // history helpers
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  updateHistoryItemById: (id: string, patch: Partial<HistoryItem>) => void;
  updateHistoryItemByRequestId: (requestId: string, patch: Partial<HistoryItem>) => void;

  // mobile view
  setMobileView: (v: "create" | "preview") => void;

  // image upload
  uploadImage: (currentMode: CreateMode) => Promise<{ url: string; meta?: any }>;
}) {
  const {
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
  } = args;

  async function run() {
    setBusy(true);
    try {
      if (!betaKey) throw new Error("Please enter your Beta Key first.");

      const current = forms[mode];

      // ✅ 临时 id：提交成功后替换为 DB jobId
      const tempId = crypto.randomUUID();

      const base: HistoryItem = {
        id: tempId,
        mode,
        modelId: current.modelId,
        createdAt: Date.now(),
        status: "QUEUED",
        prompt: current.prompt,
        input: {},
      };

      let imageUrl: string | undefined;
      let metaForBilling: any = null;

      const m = getModelUI(current.modelId);
      if (m.supports.imageInput) {
        const up = await uploadImage(mode);
        imageUrl = up.url;
        metaForBilling = up.meta || null;
        if (metaForBilling) base.imageMeta = metaForBilling;
      }

      const input = buildFalInput({
        mode,
        modelId: current.modelId,
        prompt: current.prompt,
        negativePrompt: current.negativePrompt,
        aspectRatio: current.aspectRatio,
        seconds: current.seconds,
        audioEnabled: current.audioEnabled,
        imageUrl,
        recraftStyle: current.recraftStyle,
        recraftSize: current.recraftSize,
        imageSize: current.imageSize,
      });

      base.input = input;

      // ✅ 先插入 Preview 顶部
      setHistory((h) => [base, ...h]);
      setMobileView("preview");

      // ✅ submit
      const submitRes = await apiFetch("/api/fal/submit", {
        method: "POST",
        body: JSON.stringify({
          mode,
          modelId: current.modelId as ModelId,
          input,
          imageMeta: metaForBilling,
        }),
      });

      const submitJson = await submitRes.json();
      if (!submitRes.ok) throw new Error(submitJson?.error ?? "Submit failed");

      const requestId = String(submitJson.requestId ?? "");
      const jobId = String(submitJson.jobId ?? "");
      const chargedCredits = Number(submitJson.chargedCredits ?? 0);

      if (!requestId || !jobId) throw new Error("Missing jobId/requestId from submit.");

      // ✅ 用 jobId 替换临时 id
      updateHistoryItemById(tempId, { id: jobId, requestId, chargedCredits });

      await refreshCredits();

      // ✅ 清空输入框（你最新版要求）
      setForms((prev) => ({
        ...prev,
        [mode]: { ...prev[mode], prompt: "", negativePrompt: "" },
      }));

      // ✅ 轮询
      let done = false;
      while (!done) {
        await new Promise((r) => setTimeout(r, 1500));

        const statusRes = await apiFetch("/api/fal/status", {
          method: "POST",
          body: JSON.stringify({
            modelId: current.modelId,
            requestId,
            chargedCredits,
          }),
        });

        const statusJson = await statusRes.json();
        const st = statusJson.status as HistoryItem["status"];

        updateHistoryItemByRequestId(requestId, { status: st });

        if (st === "COMPLETED") {
          const resultRes = await apiFetch("/api/fal/result", {
            method: "POST",
            body: JSON.stringify({ modelId: current.modelId, requestId }),
          });

          const resultJson = await resultRes.json();
          const data = resultJson?.data ?? resultJson;

          const { url, type } = pickOutputUrl(data);
          updateHistoryItemByRequestId(requestId, {
            status: "COMPLETED",
            outputUrl: url,
            outputType: type,
          });

          done = true;
          await refreshCredits();
          await fetchHistory(mode); // ✅ DB 同步
        }

        if (st === "FAILED") {
          updateHistoryItemByRequestId(requestId, {
            status: "FAILED",
            error: statusJson?.error ?? "FAILED",
          });

          done = true;
          await refreshCredits();
          await fetchHistory(mode); // ✅ DB 同步
        }
      }
    } catch (e: any) {
      alert(e?.message ?? "Generation failed");
    } finally {
      setBusy(false);
    }
  }

  return { run };
}
