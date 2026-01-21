// /lib/modelCatalog.ts
import type { CreateMode, ModelId } from "@/lib/pricing";

/**
 * 统一把「UI 选项」和「fal 入参字段」做一层映射：
 * - 不同模型的 duration 字段可能叫 duration 或 duration_seconds
 * - 有些模型根本没有 aspect_ratio（例如 wan-25-preview I2V 文档里没有这个字段）
 * - Veo3 fast 的 duration 枚举是 "4s/6s/8s"（我们 UI 用数字秒，提交时转成字符串）
 */

export type DurationOpt =
  | { kind: "number"; seconds: number } // 提交时仍是 number
  | { kind: "suffixS"; seconds: number }; // 提交时变成 `${seconds}s`

export type ModelUIConfig = {
  id: ModelId;
  mode: CreateMode;
  name: string;

  // UI 支持哪些项
  supports: {
    prompt: boolean;
    negativePrompt?: boolean;
    imageInput?: boolean;
    aspectRatio?: boolean;
    duration?: boolean;
    audio?: boolean; // Veo3 Fast
    recraft?: boolean; // Recraft style/size
    t2iAspect?: boolean; // Flux Pro 用 aspect ratio
    imageSize?: boolean; // Flux edit / recraft size
  };

  // UI 可选值（缺省就用“通用默认”）
  aspectRatios?: string[];
  durations?: DurationOpt[];

  // 生成时，字段名映射（非常重要）
  inputKeys: {
    duration?: "duration" | "duration_seconds";
    aspectRatio?: "aspect_ratio";
    negativePrompt?: "negative_prompt" | "negative";
    audio?: "audio_enabled" | "generate_audio";
    imageUrl?: "image_url";
  };

  // 默认值
  defaults?: {
    aspectRatio?: string;
    seconds?: number;
  };

  // 选最便宜模型用（在每个 mode 内）
  // 这里用“你 pricing.ts 的卖价逻辑”算最便宜也可以，但为了稳定，我们先手动给一个排序权重。
  // 数字越小越便宜（大概率）
  priceHintRank: number;
};

export const MODEL_CATALOG: ModelUIConfig[] = [
  // ===== T2V =====
  {
    id: "fal-ai/kling-video/v2.5-turbo/pro/text-to-video",
    mode: "T2V",
    name: "Kling 2.5 Turbo Pro (T2V)",
    supports: { prompt: true, negativePrompt: true, aspectRatio: true, duration: true },
    aspectRatios: ["16:9", "9:16", "1:1"],
    durations: [
      { kind: "number", seconds: 5 },
      { kind: "number", seconds: 10 },
    ],
    inputKeys: { duration: "duration", aspectRatio: "aspect_ratio", negativePrompt: "negative_prompt" },
    defaults: { aspectRatio: "16:9", seconds: 5 },
    priceHintRank: 30,
  },
  {
    id: "wan/v2.6/text-to-video",
    mode: "T2V",
    name: "Wan 2.6 (T2V)",
    supports: { prompt: true, aspectRatio: true, duration: true },
    aspectRatios: ["16:9", "9:16", "1:1", "4:3", "3:4"],
    durations: [
      { kind: "number", seconds: 5 },
      { kind: "number", seconds: 10 },
      { kind: "number", seconds: 15 },
    ],
    inputKeys: { duration: "duration_seconds", aspectRatio: "aspect_ratio" },
    defaults: { aspectRatio: "16:9", seconds: 5 },
    priceHintRank: 10,
  },
  {
    id: "fal-ai/veo3/fast",
    mode: "T2V",
    name: "Google Veo 3 Fast (T2V)",
    supports: { prompt: true, aspectRatio: true, duration: true, audio: true },
    aspectRatios: ["16:9", "9:16"],
    // 文档是 4s/6s/8s
    durations: [
      { kind: "suffixS", seconds: 4 },
      { kind: "suffixS", seconds: 6 },
      { kind: "suffixS", seconds: 8 },
    ],
    inputKeys: { duration: "duration", aspectRatio: "aspect_ratio", audio: "generate_audio" },
    defaults: { aspectRatio: "16:9", seconds: 8 },
    priceHintRank: 40,
  },
  {
    id: "fal-ai/ltx-2-19b/distilled/text-to-video/lora",
    mode: "T2V",
    name: "LTX 2 19B Distilled LoRA (T2V)",
    supports: { prompt: true, aspectRatio: true, duration: true },
    // LTX 文档是 float duration + video_size enum，我们 MVP 先仍用 seconds + aspect（按你现有输入）
    aspectRatios: ["16:9", "9:16", "1:1", "4:3", "3:4"],
    durations: [
      { kind: "number", seconds: 5 },
      { kind: "number", seconds: 8 },
      { kind: "number", seconds: 10 },
      { kind: "number", seconds: 12 },
    ],
    inputKeys: { duration: "duration_seconds", aspectRatio: "aspect_ratio" },
    defaults: { aspectRatio: "16:9", seconds: 8 },
    priceHintRank: 15,
  },

  // ===== I2V =====
  {
    id: "fal-ai/wan-25-preview/image-to-video",
    mode: "I2V",
    name: "Wan 2.5 Preview (I2V)",
    supports: { prompt: true, imageInput: true, duration: true },
    // 文档里没有 aspect_ratio，所以我们不显示也不发送
    durations: [
      { kind: "number", seconds: 5 },
      { kind: "number", seconds: 10 },
    ],
    inputKeys: { duration: "duration", imageUrl: "image_url" },
    defaults: { seconds: 5 },
    priceHintRank: 12,
  },
  {
    id: "fal-ai/kling-video/v1.6/pro/image-to-video",
    mode: "I2V",
    name: "Kling 1.6 Pro (I2V)",
    supports: { prompt: true, negativePrompt: true, imageInput: true, aspectRatio: true, duration: true },
    aspectRatios: ["16:9", "9:16", "1:1"],
    durations: [
      { kind: "number", seconds: 5 },
      { kind: "number", seconds: 10 },
    ],
    inputKeys: { duration: "duration", aspectRatio: "aspect_ratio", negativePrompt: "negative_prompt", imageUrl: "image_url" },
    defaults: { aspectRatio: "16:9", seconds: 5 },
    priceHintRank: 20,
  },
  {
    id: "fal-ai/ltx-2-19b/distilled/image-to-video/lora",
    mode: "I2V",
    name: "LTX 2 19B Distilled LoRA (I2V)",
    supports: { prompt: true, imageInput: true, aspectRatio: true, duration: true },
    aspectRatios: ["16:9", "9:16", "1:1", "4:3", "3:4"],
    durations: [
      { kind: "number", seconds: 5 },
      { kind: "number", seconds: 8 },
      { kind: "number", seconds: 10 },
      { kind: "number", seconds: 12 },
    ],
    inputKeys: { duration: "duration_seconds", aspectRatio: "aspect_ratio", imageUrl: "image_url" },
    defaults: { aspectRatio: "16:9", seconds: 8 },
    priceHintRank: 14,
  },

  // ===== T2I =====
  {
    id: "fal-ai/flux-pro/v1.1-ultra",
    mode: "T2I",
    name: "FLUX Pro v1.1 Ultra (T2I)",
    supports: { prompt: true, t2iAspect: true },
    // Flux Pro 的“比例”更像 aspect_ratio（21:9 等）
    aspectRatios: ["21:9", "16:9", "4:3", "3:2", "1:1", "2:3", "3:4", "4:5", "9:16", "16:9"],
    inputKeys: { aspectRatio: "aspect_ratio" },
    defaults: { aspectRatio: "1:1" },
    priceHintRank: 25,
  },
  {
    id: "fal-ai/recraft/v3/text-to-image",
    mode: "T2I",
    name: "Recraft V3 (T2I)",
    supports: { prompt: true, recraft: true, imageSize: true },
    inputKeys: {},
    priceHintRank: 18,
  },

  // ===== I+T2I =====
  {
    id: "fal-ai/flux-2/lora/edit",
    mode: "I+T2I",
    name: "FLUX.2 LoRA Edit (I+T2I)",
    supports: { prompt: true, imageInput: true, imageSize: true },
    inputKeys: { imageUrl: "image_url" },
    priceHintRank: 22,
  },
  {
    id: "fal-ai/clarity-upscaler",
    mode: "I+T2I",
    name: "Clarity Upscaler (I2I / Upscale)",
    supports: { prompt: true, imageInput: true },
    inputKeys: { imageUrl: "image_url" },
    priceHintRank: 8,
  },
];

export function modelsByMode(mode: CreateMode) {
  return MODEL_CATALOG.filter((m) => m.mode === mode);
}

export function getModelUI(id: ModelId) {
  const m = MODEL_CATALOG.find((x) => x.id === id);
  if (!m) throw new Error(`Unknown modelId: ${id}`);
  return m;
}

// 每个 mode 默认选“最便宜”（rank 最小）
export function cheapestModelId(mode: CreateMode): ModelId {
  const list = modelsByMode(mode).slice().sort((a, b) => a.priceHintRank - b.priceHintRank);
  if (!list[0]) throw new Error(`No models for mode ${mode}`);
  return list[0].id;
}

export function normalizeAspect(modelId: ModelId, current: string) {
  const m = getModelUI(modelId);
  const opts = m.aspectRatios;
  if (!opts || opts.length === 0) return current;
  return opts.includes(current) ? current : (m.defaults?.aspectRatio ?? opts[0]);
}

export function normalizeSeconds(modelId: ModelId, current: number) {
  const m = getModelUI(modelId);
  const opts = m.durations;
  if (!opts || opts.length === 0) return current;
  const secList = opts.map((d) => d.seconds);
  return secList.includes(current) ? current : (m.defaults?.seconds ?? secList[0]);
}

export function durationToFalValue(modelId: ModelId, seconds: number): string | number {
  const m = getModelUI(modelId);
  const opts = m.durations;
  if (!opts) return seconds;
  const found = opts.find((x) => x.seconds === seconds);
  if (!found) return seconds;
  return found.kind === "suffixS" ? `${seconds}s` : seconds;
}
