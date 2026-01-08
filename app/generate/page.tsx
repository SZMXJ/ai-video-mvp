"use client";

export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

export default function GeneratePage() {
  const searchParams = useSearchParams();
  const prompt = searchParams.get("prompt");
  const style = searchParams.get("style");

  const { credits } = useUser();
  const [status, setStatus] = useState<"loading" | "done">("loading");

  useEffect(() => {
    if (!prompt || credits <= 0) return;

    const timer = setTimeout(() => {
      setStatus("done");
    }, 2000);

    return () => clearTimeout(timer);
  }, [prompt, credits]);

  return (
    <div style={{ padding: 40 }}>
      <h1>AI 视频生成</h1>

      <p>Prompt：{prompt}</p>
      <p>风格：{style}</p>

      <p>
        状态：
        {status === "loading" ? " 生成中..." : " 生成完成 ✅"}
      </p>
    </div>
  );
}
