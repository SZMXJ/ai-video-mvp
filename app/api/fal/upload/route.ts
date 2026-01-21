// /app/api/fal/upload/route.ts
import { NextResponse } from "next/server";
import { fal } from "@fal-ai/client";
import { requireBetaKey } from "@/lib/gate";
import { imageSize } from "image-size";

function assertFalKey() {
  if (!process.env.FAL_KEY) {
    throw new Error("Missing FAL_KEY. Please set FAL_KEY in .env.local / Vercel env.");
  }
}

export async function POST(req: Request) {
  const g = requireBetaKey(req);
  if (!g.ok) return g.res;

  try {
    assertFalKey();

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());

    // Get dimensions (best-effort)
    let width: number | undefined;
    let height: number | undefined;
    try {
      const dim = imageSize(buf);
      if (typeof dim.width === "number") width = dim.width;
      if (typeof dim.height === "number") height = dim.height;
    } catch {}

    // fal storage upload
    const url = await fal.storage.upload(file);

    const mp = width && height ? (width * height) / 1_000_000 : undefined;

    return NextResponse.json({ url, meta: { width, height, mp } });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "upload error" }, { status: 500 });
  }
}
