"use client";

import type React from "react";
import type { CreateMode } from "@/lib/pricing";
import type { ModeFormState } from "../createLib/types";

export function useUploadImage(params: {
  betaKey: string;
  forms: Record<CreateMode, ModeFormState>;
  setForms: React.Dispatch<React.SetStateAction<Record<CreateMode, ModeFormState>>>;
}) {
  const { betaKey, forms, setForms } = params;

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

  return { uploadImage };
}
