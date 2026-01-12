import { NextResponse } from "next/server";

/* ===== 简单词库 ===== */

const SUBJECTS = ["man", "woman", "person", "robot", "soldier", "city"];
const ACTIONS = ["walking", "running", "flying", "standing", "looking"];
const MOODS = ["cinematic", "dramatic", "dark", "epic", "peaceful"];
const ENVIRONMENTS = ["city", "street", "rain", "night", "cyberpunk"];

const STYLE_TEMPLATES: Record<string, string> = {
  Cinematic:
    "cinematic lighting, shallow depth of field, smooth camera movement, film grain, ultra high quality",
  Anime:
    "anime style, vibrant colors, expressive characters, high quality animation",
  Realistic:
    "photorealistic, natural lighting, ultra high resolution",
};

/* ===== 工具函数 ===== */

function extract(text: string, list: string[]) {
  const t = text.toLowerCase();
  return list.find((w) => t.includes(w));
}

/* ===== API ===== */

export async function POST(req: Request) {
  const { prompt, style } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: "No prompt provided" }, { status: 400 });
  }

  const subject = extract(prompt, SUBJECTS) || "a subject";
  const action = extract(prompt, ACTIONS) || "moving";
  const mood = extract(prompt, MOODS) || "cinematic";
  const env = extract(prompt, ENVIRONMENTS) || "a detailed environment";

  const base = `A ${mood} scene of ${subject} ${action} in ${env}`;
  const styleSuffix = STYLE_TEMPLATES[style] || "";

  const result = `${base}, ${styleSuffix}`;

  return NextResponse.json({
    original: prompt,
    enhanced: result,
  });
}
