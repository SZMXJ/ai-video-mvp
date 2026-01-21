// /lib/pricing.ts

export type CreateMode = "T2V" | "I2V" | "T2I" | "I+T2I";

export type ModelId =
  | "fal-ai/kling-video/v2.5-turbo/pro/text-to-video"
  | "wan/v2.6/text-to-video"
  | "fal-ai/veo3/fast"
  | "fal-ai/ltx-2-19b/distilled/text-to-video/lora"
  | "fal-ai/wan-25-preview/image-to-video"
  | "fal-ai/kling-video/v1.6/pro/image-to-video"
  | "fal-ai/ltx-2-19b/distilled/image-to-video/lora"
  | "fal-ai/flux-pro/v1.1-ultra"
  | "fal-ai/recraft/v3/text-to-image"
  | "fal-ai/flux-2/lora/edit"
  | "fal-ai/clarity-upscaler";

/**
 * Credits system
 * 1 credit = $0.01  =>  $1 = 100 credits
 */
export const CREDIT_USD = 0.01;

/**
 * Starter credits for a brand new betaKey / user (Stage 1)
 * You referenced STARTER_CREDITS in /api/credits/balance, so we export it here.
 *
 * Recommended: 0 for public launch; >0 for internal testing.
 */
export const STARTER_CREDITS = 0;

/**
 * Stripe top-up packs (Stage 1, no-login)
 * You can keep pack pricing in Stripe, while credits are granted here via webhook metadata.
 * If later you change pack credits, update both this and your checkout metadata.
 */
export const TOPUP_PACKS = {
  "10": { usd: 10, credits: 1000, label: "$10 → 1000 credits" },
  "30": { usd: 30, credits: 3200, label: "$30 → 3200 credits" },
  "100": { usd: 100, credits: 11500, label: "$100 → 11500 credits" },
} as const;

export type TopUpPackId = keyof typeof TOPUP_PACKS;

// 你选的“方案二”毛利
const MARKUP = {
  video: 2.6,
  image: 2.2,
  edit: 1.9,
} as const;

export type PriceQuote = {
  modelId: ModelId;
  mode: CreateMode;
  falCostUsd: number; // fal 官方成本（估算/按规则）
  sellCostUsd: number; // 你卖给用户的成本（含毛利）
  sellCredits: number; // 你要扣的 credits
  notes?: string[];
};

function ceilCredits(usd: number) {
  return Math.max(1, Math.ceil(usd / CREDIT_USD));
}

// 用于 MP 计费：w*h*frames -> megapixels
export function mpFromVideo(w: number, h: number, frames: number) {
  return (w * h * frames) / 1_000_000;
}

// 你 create 页没有让用户选 resolution/fps，所以我们做“上线可用的默认”
// 以后你想更精确，就把 resolution/fps 做进 UI 参数再传进来
export function defaultVideoDims(aspectRatio: string) {
  // 默认按 720p 档（足够跑 MVP），后面你可按模型细分
  if (aspectRatio === "9:16") return { w: 720, h: 1280 };
  if (aspectRatio === "1:1") return { w: 1024, h: 1024 };
  if (aspectRatio === "4:3") return { w: 960, h: 720 };
  if (aspectRatio === "3:4") return { w: 720, h: 960 };
  // 16:9
  return { w: 1280, h: 720 };
}

export function quotePrice(args: {
  mode: CreateMode;
  modelId: ModelId;
  input: Record<string, any>;
  // 可选：如果我们能从上传时拿到图片尺寸，就传进来更准（用于 edit/upscale）
  imageMeta?: { width?: number; height?: number; mp?: number };
}): PriceQuote {
  const { mode, modelId, input, imageMeta } = args;

  const notes: string[] = [];

  // 统一读取秒数（你前端用 duration_seconds）
  // ✅ 兼容不同模型字段：duration_seconds / duration / "8s"
  const rawDur = input?.duration_seconds ?? input?.duration ?? 5;
  const seconds: number = (() => {
    if (typeof rawDur === "string") {
      // e.g. "8s"
      const m = rawDur.trim().match(/^(\d+(?:\.\d+)?)s$/i);
      if (m) return Number(m[1]);
      const n = Number(rawDur);
      return Number.isFinite(n) ? n : 5;
    }
    const n = Number(rawDur);
    return Number.isFinite(n) ? n : 5;
  })();

  const aspect: string = String(input?.aspect_ratio ?? "16:9");

  // ✅ 兼容不同模型字段：audio_enabled / generate_audio
  const audioEnabled: boolean = Boolean(input?.audio_enabled ?? input?.generate_audio ?? false);


  // ===== fal 成本（usd）=====
  let falCostUsd = 0;

  // 1) Kling 2.5 Turbo Pro (T2V): 5s $0.35, +$0.07 per additional second
  if (modelId === "fal-ai/kling-video/v2.5-turbo/pro/text-to-video") {
    const base = 0.35;
    const extra = Math.max(0, seconds - 5) * 0.07;
    falCostUsd = base + extra;
  }

  // 2) Wan 2.6 (T2V): 720p $0.10/s; 1080p $0.15/s
  else if (modelId === "wan/v2.6/text-to-video") {
    // 你的 UI 没有 resolution 选项，这里默认 720p 成本；你之后可加 UI 选项
    const perSec = 0.1;
    falCostUsd = perSec * seconds;
    notes.push("Wan 2.6 pricing uses 720p default (UI has no resolution selector).");
  }

  // 3) Veo3 Fast (T2V): audio off $0.25/s; audio on $0.40/s
  else if (modelId === "fal-ai/veo3/fast") {
    falCostUsd = (audioEnabled ? 0.4 : 0.25) * seconds;
  }

  // 4) LTX 2 19B (T2V/I2V): $0.001 per MP of generated video data, ceil
  else if (
    modelId === "fal-ai/ltx-2-19b/distilled/text-to-video/lora" ||
    modelId === "fal-ai/ltx-2-19b/distilled/image-to-video/lora"
  ) {
    const { w, h } = defaultVideoDims(aspect);
    const fps = 24; // 默认 24fps
    const frames = Math.max(1, Math.round(seconds * fps));
    const mp = mpFromVideo(w, h, frames);
    falCostUsd = Math.ceil(mp) * 0.001; // “向上取整到最近的百万像素单位”
    notes.push(`LTX MP-based estimate uses ${w}x${h} @${fps}fps.`);
  }

  // 5) Wan 2.5 Preview (I2V): 480p 0.05/s; 720p 0.10/s; 1080p 0.15/s
  else if (modelId === "fal-ai/wan-25-preview/image-to-video") {
    // UI 没 resolution，默认 720p
    falCostUsd = 0.1 * seconds;
    notes.push("Wan 2.5 Preview pricing uses 720p default (UI has no resolution selector).");
  }

  // 6) Kling 1.6 Pro (I2V): $0.095/s
  else if (modelId === "fal-ai/kling-video/v1.6/pro/image-to-video") {
    falCostUsd = 0.095 * seconds;
  }

  // 7) Flux Pro v1.1 Ultra (T2I): $0.06 / image
  else if (modelId === "fal-ai/flux-pro/v1.1-ultra") {
    falCostUsd = 0.06;
  }

  // 8) Recraft v3 (T2I): $0.04 / image (vector style $0.08)
  else if (modelId === "fal-ai/recraft/v3/text-to-image") {
    const style = String(input?.style ?? "realistic_image");
    falCostUsd = style === "vector_illustration" ? 0.08 : 0.04;
  }

  // 9) Flux.2 LoRA Edit (I+T2I): $0.021 per MP (input+output), input resized to 1MP
  else if (modelId === "fal-ai/flux-2/lora/edit") {
    // input 固定算 1MP；output 这里没有 size 选项，先按 1MP
    const outputMp = 1;
    falCostUsd = 0.021 * (1 + outputMp);
    notes.push("Flux.2 edit uses input=1MP (per rule) and output=1MP default.");
  }

  // 10) Clarity Upscaler: $0.03 per MP
  else if (modelId === "fal-ai/clarity-upscaler") {
    const mp = imageMeta?.mp && imageMeta.mp > 0 ? imageMeta.mp : 1;
    falCostUsd = 0.03 * mp;
    if (!imageMeta?.mp) notes.push("Clarity pricing uses 1MP default (no image metadata).");
  }

  else {
    falCostUsd = 0.1;
    notes.push("Unknown model pricing fallback applied.");
  }

  // ===== 你卖给用户的价格（含毛利）=====
  const category =
    mode === "T2V" || mode === "I2V"
      ? "video"
      : modelId === "fal-ai/flux-2/lora/edit" || modelId === "fal-ai/clarity-upscaler"
        ? "edit"
        : "image";

  const sellCostUsd = falCostUsd * MARKUP[category];
  const sellCredits = ceilCredits(sellCostUsd);

  return { modelId, mode, falCostUsd, sellCostUsd, sellCredits, notes };
}
