import type { CreateMode, ModelId } from "@/lib/pricing";
import { durationToFalValue, getModelUI } from "@/lib/modelCatalog";

export function buildFalInput(args: {
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

  // model-specific
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
