"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import type { CreateMode, ModelId } from "@/lib/pricing";
import { quotePrice } from "@/lib/pricing";
import {
  cheapestModelId,
  durationToFalValue,
  getModelUI,
  modelsByMode,
  normalizeAspect,
  normalizeSeconds,
} from "@/lib/modelCatalog";

type HistoryItem = {
  id: string; // client id
  mode: CreateMode;
  modelId: ModelId;
  createdAt: number;
  status: "QUEUED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  requestId?: string; // fal request_id
  prompt?: string;
  outputUrl?: string;
  outputType?: "video" | "image";
  input: Record<string, any>;
  chargedCredits?: number;
  imageMeta?: { width?: number; height?: number; mp?: number };
  error?: string;
};

const MODE_TABS: Array<{ mode: CreateMode; label: string; sub: string }> = [
  { mode: "T2V", label: "T2V", sub: "Text → Video" },
  { mode: "I2V", label: "I2V", sub: "Image → Video" },
  { mode: "T2I", label: "T2I", sub: "Text → Image" },
  { mode: "I+T2I", label: "I+T2I", sub: "Image + Text → Image" },
];

const RECRAFT_STYLES = ["realistic_image", "digital_illustration", "vector_illustration"] as const;
const RECRAFT_SIZES = ["square", "square_hd", "portrait_4_3", "portrait_16_9", "landscape_4_3", "landscape_16_9"] as const;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function pickOutputUrl(data: any): { url?: string; type?: "video" | "image" } {
  if (data?.video?.url) return { url: data.video.url, type: "video" };
  if (Array.isArray(data?.videos) && data.videos[0]?.url) return { url: data.videos[0].url, type: "video" };
  if (Array.isArray(data?.images) && data.images[0]?.url) return { url: data.images[0].url, type: "image" };
  if (data?.image?.url) return { url: data.image.url, type: "image" };
  return {};
}

/** ===== 每个 mode 独立表单 ===== */
type ModeFormState = {
  modelId: ModelId;

  prompt: string;
  negativePrompt: string;

  aspectRatio: string;
  seconds: number;
  audioEnabled: boolean;

  imageFile: File | null;
  imagePreviewUrl: string | null;
  imageMeta: { width?: number; height?: number; mp?: number } | null;

  recraftStyle: (typeof RECRAFT_STYLES)[number];
  recraftSize: (typeof RECRAFT_SIZES)[number];

  imageSize: (typeof RECRAFT_SIZES)[number];
};

function makeDefaultForm(mode: CreateMode): ModeFormState {
  const defaultModel = cheapestModelId(mode);
  const m = getModelUI(defaultModel);

  const defaultAspect = m.defaults?.aspectRatio ?? (m.aspectRatios?.[0] ?? "16:9");
  const defaultSeconds = m.defaults?.seconds ?? (m.durations?.[0]?.seconds ?? 5);

  return {
    modelId: defaultModel,
    prompt: "",
    negativePrompt: "",
    aspectRatio: defaultAspect,
    seconds: defaultSeconds,
    audioEnabled: false,
    imageFile: null,
    imagePreviewUrl: null,
    imageMeta: null,
    recraftStyle: "realistic_image",
    recraftSize: "square",
    imageSize: "square",
  };
}

const ASSIST_BY_MODE: Record<CreateMode, { assist: string; examples: string[] }> = {
  T2V: {
    assist: "Tip: describe subject + action + camera + lighting + style + mood + constraints. Keep it concrete.",
    examples: [
      "A cinematic close-up of a chef torching crème brûlée, shallow depth of field, warm tungsten lighting, slow handheld camera, 35mm film grain.",
      "A playful mini trailer: a tiny fox director runs a film set inside a shoebox city, dynamic camera moves, vivid colors, premium look.",
      "Street interview style on a busy NYC sidewalk, natural daylight, subtle camera shake, crisp audio ambience (if supported).",
    ],
  },
  I2V: {
    assist: "Tip: use the prompt to guide motion and camera. Mention what should move, what must stay stable, and the vibe.",
    examples: [
      "Continue naturally: gentle camera push-in, soft wind moves hair and fabric, keep the face identity consistent, cinematic lighting.",
      "Snowflakes falling as a car moves along the road at night, headlights reflecting on wet asphalt, smooth tracking shot.",
      "Subtle parallax and micro-movements only: preserve composition, no object deformation, realistic motion blur.",
    ],
  },
  T2I: {
    assist: "Tip: specify composition + materials + lighting + lens + background. Add quality constraints if needed.",
    examples: [
      "Extreme close-up of a tiger eye, macro lens, dramatic rim light, ultra-detailed iris texture, photorealistic.",
      "A red panda eating bamboo in front of a vintage poster, soft studio lighting, high detail, natural colors.",
      "Minimalist product shot of a matte black gadget on a gradient backdrop, softbox reflections, clean shadows.",
    ],
  },
  "I+T2I": {
    assist: "Tip: say what to change and what to keep. For upscaling, keep prompt empty or only add mild quality hints.",
    examples: [
      "Make this donut look photorealistic: realistic glaze, subtle imperfections, studio lighting, keep shape unchanged.",
      "Change the background to a neon cyberpunk street, keep the subject pose and face exactly the same.",
      "Upscale with clarity, preserve details, avoid oversharpening, keep colors natural.",
    ],
  },
};

function StatusPill({ s }: { s: HistoryItem["status"] }) {
  const cls =
    s === "COMPLETED"
      ? "bg-emerald-400/15 text-emerald-200 border-emerald-400/25"
      : s === "FAILED"
      ? "bg-rose-400/15 text-rose-200 border-rose-400/25"
      : s === "IN_PROGRESS"
      ? "bg-cyan-400/15 text-cyan-200 border-cyan-400/25"
      : "bg-white/10 text-white/70 border-white/15";

  const label = s === "QUEUED" ? "QUEUED" : s === "IN_PROGRESS" ? "IN PROGRESS" : s === "COMPLETED" ? "COMPLETED" : "FAILED";

  return <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${cls}`}>{label}</span>;
}

export default function CreatePage() {
  // ----- Gate (beta key) -----
  const [betaKey, setBetaKey] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("beta_key") || "";
    setBetaKey(saved);
  }, []);

  function saveBetaKey(v: string) {
    const k = v.trim();
    setBetaKey(k);
    localStorage.setItem("beta_key", k);
  }

  async function apiFetch(url: string, init?: RequestInit) {
    if (!betaKey) throw new Error("Please enter your Beta Key first.");
    const headers = new Headers(init?.headers || {});
    if (!(init?.body instanceof FormData)) {
      headers.set("Content-Type", headers.get("Content-Type") || "application/json");
    }
    headers.set("x-beta-key", betaKey);
    return fetch(url, { ...init, headers });
  }

  // ---------------- Layout (resizable desktop) ----------------
  const shellRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);

  // ✅ 默认让 Preview 更大一点（右侧更宽）
  const [splitPct, setSplitPct] = useState(42); // 左侧编辑占比（越小预览越大）

  function setSplitFromClientX(clientX: number) {
    const shell = shellRef.current;
    if (!shell) return;
    const rect = shell.getBoundingClientRect();

    const sidebarPx = 72;
    const dividerPx = 8;

    const x = clientX - rect.left;

    const minEditorPx = 420;
    const minRightPx = 560; // ✅ Preview 更宽
    const minX = sidebarPx + minEditorPx;
    const maxX = rect.width - minRightPx - dividerPx;

    const clampedX = clamp(x, minX, maxX);
    const pct = (clampedX / rect.width) * 100;
    setSplitPct(clamp(pct, 32, 68));
  }

  function onDividerPointerDown(e: React.PointerEvent) {
    draggingRef.current = true;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  }
  function onDividerPointerMove(e: React.PointerEvent) {
    if (!draggingRef.current) return;
    setSplitFromClientX(e.clientX);
  }
  function onDividerPointerUp() {
    draggingRef.current = false;
  }

  // ---------------- App state ----------------
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
          audioEnabled: nextId === "fal-ai/veo3/fast" ? cur.audioEnabled : false,
        },
      };
    });
  }

  // image preview URL per-mode
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

  // busy
  const [busy, setBusy] = useState(false);

  // credits
  const [credits, setCredits] = useState<number>(0);

  async function refreshCredits() {
    if (!betaKey) return;
    const res = await fetch("/api/billing/balance", {
      method: "GET",
      headers: { "x-beta-key": betaKey },
    });
    if (res.ok) {
      const j = await res.json();
      setCredits(Number(j.credits ?? 0));
    }
  }

  useEffect(() => {
    refreshCredits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [betaKey]);

  // ==========================
  // ✅ History (local) + Resume
  // ==========================
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("create_history");
    if (raw) {
      const arr = JSON.parse(raw) as HistoryItem[];
      setHistory(arr);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("create_history", JSON.stringify(history));
  }, [history]);

  // ✅ Higgsfield-like on mobile/tablet: Create / Preview toggle
  const [mobileView, setMobileView] = useState<"create" | "preview">("create");

  function updateHistoryItem(id: string, patch: Partial<HistoryItem>) {
    setHistory((h) => h.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  async function resumeOne(item: HistoryItem) {
    if (!betaKey) return;
    if (!item.requestId) return;

    // 已有输出，不需要恢复
    if (item.outputUrl) return;

    const statusRes = await apiFetch("/api/fal/status", {
      method: "POST",
      body: JSON.stringify({
        modelId: item.modelId,
        requestId: item.requestId,
        chargedCredits: item.chargedCredits ?? 0,
      }),
    });

    const statusJson = await statusRes.json();
    const st = statusJson.status as HistoryItem["status"];
    updateHistoryItem(item.id, { status: st });

    if (st === "COMPLETED") {
      const resultRes = await apiFetch("/api/fal/result", {
        method: "POST",
        body: JSON.stringify({ modelId: item.modelId, requestId: item.requestId }),
      });
      const resultJson = await resultRes.json();
      const data = resultJson?.data ?? resultJson;
      const { url, type } = pickOutputUrl(data);

      updateHistoryItem(item.id, {
        status: "COMPLETED",
        outputUrl: url,
        outputType: type,
      });
      await refreshCredits();
    }

    if (st === "FAILED") {
      updateHistoryItem(item.id, { status: "FAILED", error: statusJson?.error ?? "FAILED" });
      await refreshCredits();
    }
  }

  // ✅ 页面加载后自动恢复：把“后台已经完成但前台没拿到 outputUrl”的任务补回来
  useEffect(() => {
    if (!betaKey) return;
    if (!history.length) return;

    const toResume = history
      .slice(0, 10)
      .filter((it) => it.requestId && !it.outputUrl && it.status !== "FAILED");

    if (!toResume.length) return;

    let cancelled = false;

    (async () => {
      for (const it of toResume) {
        if (cancelled) return;
        try {
          await resumeOne(it);
        } catch {
          // ignore
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [betaKey, history.length]);

  // ---------------- Upload ----------------
  async function uploadImage(currentMode: CreateMode): Promise<{ url: string; meta?: any }> {
    const f = forms[currentMode];
    if (!f.imageFile) throw new Error("Please upload an image first.");
    if (!betaKey) throw new Error("Missing Beta Key.");

    const fd = new FormData();
    fd.append("file", f.imageFile);

    const res = await fetch("/api/fal/upload", {
      method: "POST",
      headers: { "x-beta-key": betaKey },
      body: fd,
    });

    if (!res.ok) throw new Error(await res.text());
    const j = await res.json();

    setForms((prev) => ({
      ...prev,
      [currentMode]: {
        ...prev[currentMode],
        imageMeta: j?.meta ?? prev[currentMode].imageMeta,
      },
    }));

    return { url: j.url, meta: j.meta };
  }

  async function onUpgrade(pack: "10" | "30" | "100") {
    const res = await apiFetch("/api/billing/create-checkout", {
      method: "POST",
      body: JSON.stringify({ pack }),
    });
    const j = await res.json();
    if (!res.ok) throw new Error(j?.error ?? "Checkout error");
    if (j?.url) window.location.href = j.url;
  }

  /** 把 UI 表单 -> fal input（按 modelCatalog 映射） */
  function buildFalInput(args: {
    mode: CreateMode;
    modelId: ModelId;
    prompt: string;
    negativePrompt: string;
    aspectRatio: string;
    seconds: number;
    audioEnabled: boolean;
    imageUrl?: string;
    recraftStyle: string;
    recraftSize: string;
    imageSize: string;
  }) {
    const m = getModelUI(args.modelId);
    const input: Record<string, any> = {};

    if (m.supports.prompt) {
      const p = (args.prompt ?? "").trim();
      if (p.length > 0) input.prompt = p;
    }

    if (m.supports.imageInput && args.imageUrl && m.inputKeys.imageUrl) {
      input[m.inputKeys.imageUrl] = args.imageUrl;
    }

    if (m.supports.negativePrompt && args.negativePrompt && m.inputKeys.negativePrompt) {
      input[m.inputKeys.negativePrompt] = args.negativePrompt;
    }

    if (m.supports.aspectRatio && m.inputKeys.aspectRatio) {
      input[m.inputKeys.aspectRatio] = args.aspectRatio;
    }

    if (m.supports.duration && m.inputKeys.duration) {
      const v = durationToFalValue(args.modelId, args.seconds);
      input[m.inputKeys.duration] = v;
    }

    if (m.supports.audio && m.inputKeys.audio) {
      input[m.inputKeys.audio] = Boolean(args.audioEnabled);
    }

    if (args.mode === "T2I" && args.modelId === "fal-ai/recraft/v3/text-to-image") {
      input.style = args.recraftStyle;
      input.size = args.recraftSize;
    }

    if (args.mode === "I+T2I" && args.modelId === "fal-ai/flux-2/lora/edit") {
      input.image_size = args.imageSize;
    }

    if (args.mode === "I+T2I" && args.modelId === "fal-ai/clarity-upscaler") {
      input.scale = 2;
    }

    return input;
  }

  /** ✅ 即时预计 credits（本地 quotePrice） */
  const est = useMemo(() => {
    try {
      const cur = forms[mode];
      const m = getModelUI(cur.modelId);

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

  async function run() {
    setBusy(true);
    try {
      if (!betaKey) throw new Error("Please enter your Beta Key first.");

      const current = forms[mode];
      const id = crypto.randomUUID();

      const base: HistoryItem = {
        id,
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

      // ✅ 新任务插到最上面（Preview feed 顶部）
      setHistory((h) => [base, ...h]);

      // 移动端：生成后自动跳到 Preview 看进度
      setMobileView("preview");

      const submitRes = await apiFetch("/api/fal/submit", {
        method: "POST",
        body: JSON.stringify({ mode, modelId: current.modelId, input, imageMeta: metaForBilling }),
      });

      const submitJson = await submitRes.json();
      if (!submitRes.ok) throw new Error(submitJson?.error ?? "Submit failed");

      const requestId = (submitJson.requestId ?? submitJson.jobId) as string;
      const chargedCredits = Number(submitJson.chargedCredits ?? 0);

      updateHistoryItem(id, { requestId, chargedCredits });
      await refreshCredits();

      // ✅ 轮询：实时更新（刷新也不怕，因为我们有 resume）
      let done = false;
      while (!done) {
        await new Promise((r) => setTimeout(r, 1500));

        const statusRes = await apiFetch("/api/fal/status", {
          method: "POST",
          body: JSON.stringify({ modelId: current.modelId, requestId, chargedCredits }),
        });
        const statusJson = await statusRes.json();
        const st = statusJson.status as HistoryItem["status"];

        updateHistoryItem(id, { status: st });

        if (st === "COMPLETED") {
          const resultRes = await apiFetch("/api/fal/result", {
            method: "POST",
            body: JSON.stringify({ modelId: current.modelId, requestId }),
          });
          const resultJson = await resultRes.json();
          const data = resultJson?.data ?? resultJson;

          const { url, type } = pickOutputUrl(data);
          updateHistoryItem(id, { status: "COMPLETED", outputUrl: url, outputType: type });
          done = true;
          await refreshCredits();
        }

        if (st === "FAILED") {
          updateHistoryItem(id, { status: "FAILED", error: statusJson?.error ?? "FAILED" });
          done = true;
          await refreshCredits();
        }
      }
    } catch (e: any) {
      alert(e?.message ?? "Generation failed");
    } finally {
      setBusy(false);
    }
  }

  // UI options based on model
  const aspectOptions = useMemo(() => {
    const m = getModelUI(form.modelId);
    return m.aspectRatios ?? ["16:9", "9:16", "1:1", "4:3", "3:4"];
  }, [form.modelId]);

  const durationOptions = useMemo(() => {
    const m = getModelUI(form.modelId);
    const list = m.durations?.map((d) => d.seconds);
    return list && list.length ? list : [5, 8, 10, 12];
  }, [form.modelId]);

  const assist = ASSIST_BY_MODE[mode];

  // ✅ Preview feed：按时间倒序（新在上面）
  const feed = useMemo(() => {
    return [...history].sort((a, b) => b.createdAt - a.createdAt);
  }, [history]);

  return (
    <main className="min-h-[calc(100vh-72px)] bg-black text-white">
      <div className="mx-auto w-full px-3 py-3 sm:px-4 sm:py-4 2xl:px-10">
        {/* top bar */}
        <div className="mb-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xl font-semibold">Create</div>
            <div className="text-xs text-white/50">fal models · beta gated · Stripe top-up · real credits</div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              <div className="mb-1 text-[10px] text-white/50">Beta Key</div>
              <input
                value={betaKey}
                onChange={(e) => saveBetaKey(e.target.value)}
                placeholder="beta_xxx"
                className="w-[220px] rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-sm outline-none focus:border-cyan-400"
              />
            </div>

            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
              Credits: <span className="font-semibold text-cyan-300">{credits}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpgrade("10")}
                className="rounded-full bg-cyan-400 px-3 py-2 font-medium text-black hover:bg-cyan-300"
              >
                Top up $10
              </button>
              <button onClick={() => onUpgrade("30")} className="rounded-full bg-white/10 px-3 py-2 text-white/80 hover:bg-white/15">
                $30
              </button>
              <button onClick={() => onUpgrade("100")} className="rounded-full bg-white/10 px-3 py-2 text-white/80 hover:bg-white/15">
                $100
              </button>
            </div>
          </div>

          {/* ✅ Mobile / Tablet toggle (Higgsfield-like) */}
          <div className="flex w-full items-center justify-between gap-2 rounded-2xl border border-white/10 bg-white/5 p-1 lg:hidden">
            <button
              onClick={() => setMobileView("create")}
              className={[
                "flex-1 rounded-2xl px-3 py-2 text-sm font-semibold transition",
                mobileView === "create" ? "bg-cyan-400 text-black" : "text-white/80 hover:bg-white/10",
              ].join(" ")}
            >
              Create
            </button>
            <button
              onClick={() => setMobileView("preview")}
              className={[
                "flex-1 rounded-2xl px-3 py-2 text-sm font-semibold transition",
                mobileView === "preview" ? "bg-cyan-400 text-black" : "text-white/80 hover:bg-white/10",
              ].join(" ")}
            >
              Preview
            </button>
          </div>
        </div>

        {/* shell: desktop two-panel / mobile single-panel */}
        <div
          ref={shellRef}
          id="editor-shell"
          className={[
            "w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02]",
            "lg:grid",
          ].join(" ")}
          style={{
            gridTemplateColumns: `72px minmax(420px, ${splitPct}%) 8px minmax(520px, ${100 - splitPct}%)`,
          }}
        >
          {/* left sidebar (desktop only) */}
          <aside className="hidden shrink-0 border-b border-white/10 bg-black/30 lg:block lg:w-[72px] lg:border-b-0 lg:border-r">
            <div className="flex items-center gap-2 overflow-x-auto p-3 lg:h-full lg:flex-col lg:overflow-x-visible">
              {MODE_TABS.map((t) => {
                const a = t.mode === mode;
                return (
                  <button
                    key={t.mode}
                    onClick={() => switchMode(t.mode)}
                    className={[
                      "shrink-0 w-[120px] rounded-xl px-2 py-2 text-center transition lg:w-[56px]",
                      a ? "bg-cyan-400 text-black" : "bg-white/5 text-white/70 hover:bg-white/10",
                    ].join(" ")}
                    title={t.sub}
                  >
                    <div className="text-xs font-bold">{t.label}</div>
                    <div className="mt-1 text-[10px] opacity-80">{t.sub}</div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* mobile mode tabs */}
          <div className="lg:hidden border-b border-white/10 bg-black/30">
            <div className="flex items-center gap-2 overflow-x-auto p-2">
              {MODE_TABS.map((t) => {
                const a = t.mode === mode;
                return (
                  <button
                    key={t.mode}
                    onClick={() => switchMode(t.mode)}
                    className={[
                      "shrink-0 rounded-2xl px-3 py-2 text-xs font-bold transition",
                      a ? "bg-cyan-400 text-black" : "bg-white/5 text-white/70 hover:bg-white/10",
                    ].join(" ")}
                    title={t.sub}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* middle editor */}
          <section
            className={[
              "relative overflow-auto p-4 sm:p-5 lg:h-full",
              // ✅ mobile: show/hide
              "lg:block",
              mobileView === "create" ? "block" : "hidden",
            ].join(" ")}
          >
            {/* Model */}
            <div className="mb-4">
              <div className="mb-2 text-sm text-white/60">Model</div>
              <select
                value={form.modelId}
                onChange={(e) => setModelId(e.target.value as ModelId)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm text-white outline-none focus:border-cyan-400"
              >
                {models.map((m) => (
                  <option key={m.id} value={m.id} className="bg-black text-white">
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Prompt Assist */}
            <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs font-semibold text-white/80">Prompt Assist</div>
              <div className="mt-1 text-xs text-white/60 leading-relaxed">{assist.assist}</div>

              <div className="mt-3 grid gap-2">
                {assist.examples.slice(0, 3).map((ex, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setForms((prev) => ({
                        ...prev,
                        [mode]: { ...prev[mode], prompt: ex },
                      }))
                    }
                    className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-left text-xs text-white/70 hover:bg-black/40"
                    title="Click to use this example"
                  >
                    Try: {ex}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt */}
            {modelUI.supports.prompt && (
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/60">
                    Prompt {form.modelId === "fal-ai/clarity-upscaler" ? <span className="text-white/40">(optional)</span> : null}
                  </div>
                  <div className="text-xs text-white/40">{form.prompt.length} chars</div>
                </div>
                <textarea
                  value={form.prompt}
                  onChange={(e) => setForms((prev) => ({ ...prev, [mode]: { ...prev[mode], prompt: e.target.value } }))}
                  placeholder={form.modelId === "fal-ai/clarity-upscaler" ? "Optional: add mild quality hints..." : "Describe what you want…"}
                  className="mt-2 h-[160px] w-full resize-none rounded-xl border border-white/10 bg-black/40 p-3 text-sm outline-none focus:border-cyan-400"
                />
              </div>
            )}

            {/* image upload */}
            {modelUI.supports.imageInput && (
              <div className="mb-4">
                <div className="mb-2 text-sm text-white/60">Image input</div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setForms((prev) => ({
                      ...prev,
                      [mode]: { ...prev[mode], imageFile: file, imageMeta: null },
                    }));
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

            {/* video options */}
            {(modelUI.supports.aspectRatio || modelUI.supports.duration) && (
              <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {modelUI.supports.aspectRatio && (
                  <div>
                    <div className="mb-2 text-sm text-white/60">Aspect ratio</div>
                    <select
                      value={form.aspectRatio}
                      onChange={(e) =>
                        setForms((prev) => ({
                          ...prev,
                          [mode]: { ...prev[mode], aspectRatio: e.target.value },
                        }))
                      }
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

                {modelUI.supports.duration && (
                  <div>
                    <div className="mb-2 text-sm text-white/60">Duration</div>
                    <select
                      value={form.seconds}
                      onChange={(e) =>
                        setForms((prev) => ({
                          ...prev,
                          [mode]: { ...prev[mode], seconds: Number(e.target.value) },
                        }))
                      }
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

                {modelUI.supports.audio && form.modelId === "fal-ai/veo3/fast" && (
                  <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm text-white/70 sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={form.audioEnabled}
                      onChange={(e) =>
                        setForms((prev) => ({
                          ...prev,
                          [mode]: { ...prev[mode], audioEnabled: e.target.checked },
                        }))
                      }
                    />
                    Enable audio (Veo3 Fast)
                  </label>
                )}
              </div>
            )}

            {/* negative prompt */}
            {modelUI.supports.negativePrompt && (
              <div className="mb-4">
                <div className="mb-2 text-sm text-white/60">Negative prompt (optional)</div>
                <input
                  value={form.negativePrompt}
                  onChange={(e) =>
                    setForms((prev) => ({
                      ...prev,
                      [mode]: { ...prev[mode], negativePrompt: e.target.value },
                    }))
                  }
                  placeholder="e.g. blurry, watermark…"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm outline-none focus:border-cyan-400"
                />
              </div>
            )}

            {/* Recraft */}
            {mode === "T2I" && form.modelId === "fal-ai/recraft/v3/text-to-image" && (
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
            )}

            {/* Flux edit size */}
            {mode === "I+T2I" && form.modelId === "fal-ai/flux-2/lora/edit" && (
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
            )}

            {/* Generate */}
            <div className="flex items-center gap-3">
              <button
                disabled={busy}
                onClick={run}
                className={[
                  "flex-1 rounded-2xl py-4 font-semibold transition",
                  busy ? "bg-white/10 text-white/40" : "bg-cyan-400 text-black hover:bg-cyan-300",
                ].join(" ")}
              >
                {busy ? "Generating..." : "Generate"}
              </button>

              <div className="min-w-[140px] rounded-2xl border border-white/10 bg-black/40 px-3 py-3 text-center">
                <div className="text-[10px] text-white/50">Estimated</div>
                <div className="text-sm font-semibold text-white">{est ? `${est.sellCredits} credits` : "—"}</div>
              </div>
            </div>

            <div className="mt-3 text-xs text-white/40 leading-relaxed">
              Credits are charged on submit. If the job fails, credits are automatically refunded.
            </div>
          </section>

          {/* divider (desktop) */}
          <div className="hidden lg:block">
            <div
              onPointerDown={onDividerPointerDown}
              onPointerMove={onDividerPointerMove}
              onPointerUp={onDividerPointerUp}
              onPointerCancel={onDividerPointerUp}
              className="relative h-full w-[8px] cursor-col-resize bg-white/5 hover:bg-white/10"
              title="Drag to resize"
            >
              <div className="absolute left-1/2 top-1/2 h-12 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded bg-white/20" />
            </div>
          </div>

          {/* right preview feed */}
          <section
            className={[
              "flex flex-1 flex-col border-t border-white/10 bg-black/20 lg:border-l lg:border-t-0",
              "lg:block",
              mobileView === "preview" ? "block" : "hidden",
            ].join(" ")}
          >
            <div className="border-b border-white/10 px-4 py-3">
              <div className="text-sm font-semibold">Preview</div>
              <div className="text-xs text-white/50">Latest results · newest on top (Kling-like feed)</div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              {!feed.length ? (
                <div className="flex h-full items-center justify-center text-white/40">
                  No generation yet. Create something on the left →
                </div>
              ) : (
                <div className="grid gap-4">
                  {feed.map((it) => {
                    const isVideo = it.outputType === "video";
                    const isImage = it.outputType === "image";
                    const dt = new Date(it.createdAt);

                    return (
                      <div key={it.id} className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
                        <div className="flex flex-col gap-2 border-b border-white/10 bg-black/30 px-4 py-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="text-xs text-white/50">
                              {dt.toLocaleString()} · <span className="text-white/70">{it.mode}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <StatusPill s={it.status} />
                              {typeof it.chargedCredits === "number" && (
                                <span className="text-[11px] text-white/50">Charged: {it.chargedCredits}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-sm font-medium">{it.modelId}</div>
                          {it.prompt ? <div className="text-xs text-white/60 line-clamp-3">{it.prompt}</div> : null}
                          {it.error ? <div className="text-xs text-rose-200/90">Error: {it.error}</div> : null}
                        </div>

                        <div className="p-3 sm:p-4">
                          {it.outputUrl ? (
                            isVideo ? (
                              <video
                                src={it.outputUrl}
                                controls
                                playsInline
                                preload="metadata"
                                className="w-full rounded-xl border border-white/10 bg-black"
                              />
                            ) : isImage ? (
                              <img
                                src={it.outputUrl}
                                className="w-full rounded-xl border border-white/10"
                                alt="output"
                              />
                            ) : (
                              <div className="flex h-[320px] items-center justify-center text-white/40">
                                Output ready, but type unknown.
                              </div>
                            )
                          ) : (
                            <div className="flex h-[320px] items-center justify-center text-white/40">
                              Waiting for output…
                            </div>
                          )}

                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                            <div className="text-xs text-white/40">
                              {it.requestId ? (
                                <span>
                                  request_id: <span className="text-white/60">{it.requestId}</span>
                                </span>
                              ) : (
                                <span>request_id: —</span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {it.requestId && !it.outputUrl && it.status !== "FAILED" ? (
                                <button
                                  onClick={() => resumeOne(it)}
                                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/10"
                                >
                                  Refresh result
                                </button>
                              ) : null}

                              {it.outputUrl ? (
                                <a
                                  href={it.outputUrl}
                                  target="_blank"
                                  className="rounded-full bg-cyan-400 px-3 py-1.5 text-xs font-semibold text-black hover:bg-cyan-300"
                                  rel="noreferrer"
                                >
                                  Open →
                                </a>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
