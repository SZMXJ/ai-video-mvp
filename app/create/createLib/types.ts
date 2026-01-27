import type { CreateMode, ModelId } from "@/lib/pricing";

export type HistoryStatus = "QUEUED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

export type HistoryItem = {
  id: string; // DB jobId（或临时 id）
  mode: CreateMode;
  modelId: ModelId;
  createdAt: number;
  status: HistoryStatus;
  requestId?: string; // fal request_id
  prompt?: string;
  outputUrl?: string;
  outputType?: "video" | "image";
  input: Record<string, any>;
  chargedCredits?: number;
  imageMeta?: { width?: number; height?: number; mp?: number };
  error?: string;
};
export type UiStatus = "idle" | "loading" | "success" | "error";

export type ModeFormState = {
  modelId: ModelId;

  prompt: string;
  negativePrompt: string;

  aspectRatio: string;
  seconds: number;
  audioEnabled: boolean;

  imageFile: File | null;
  imagePreviewUrl: string | null;
  imageMeta: { width?: number; height?: number; mp?: number } | null;

  recraftStyle: (typeof import("./constants").RECRAFT_STYLES)[number];
  recraftSize: (typeof import("./constants").RECRAFT_SIZES)[number];

  imageSize: (typeof import("./constants").RECRAFT_SIZES)[number];
};
