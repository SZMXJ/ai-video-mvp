import type { CreateMode } from "@/lib/pricing";

export const MODE_TABS: Array<{ mode: CreateMode; label: string; sub: string }> = [
  { mode: "T2V", label: "T2V", sub: "Text → Video" },
  { mode: "I2V", label: "I2V", sub: "Image → Video" },
  { mode: "T2I", label: "T2I", sub: "Text → Image" },
  { mode: "I+T2I", label: "I+T2I", sub: "Image + Text → Image" },
];

export const RECRAFT_STYLES = ["realistic_image", "digital_illustration", "vector_illustration"] as const;

export const RECRAFT_SIZES = [
  "square",
  "square_hd",
  "portrait_4_3",
  "portrait_16_9",
  "landscape_4_3",
  "landscape_16_9",
] as const;

export const ASSIST_BY_MODE: Record<CreateMode, { assist: string; examples: string[] }> = {
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
