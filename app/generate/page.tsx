"use client";

export const dynamic = "force-dynamic";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

export default function GeneratePage() {
  const params = useSearchParams();
  const prompt = params.get("prompt");
  const style = params.get("style");

  const { credits, loggedIn, addHistory } = useUser();
  const [status, setStatus] = useState<"loading" | "done">("loading");

  useEffect(() => {
    if (!loggedIn || credits <= 0) return;

    const timer = setTimeout(() => {
      setStatus("done");
      addHistory({
        time: new Date().toISOString(),
        prompt: prompt || "",
        style: style || "",
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [loggedIn, credits, prompt, style, addHistory]);

  return (
    <div style={{ padding: 40 }}>
      <h1>AI 视频生成</h1>

      <p>Prompt：{prompt}</p>
      <p>风格：{style}</p>

      <p>
        状态：
        {status === "loading" ? "生成中..." : "生成完成 ✅"}
      </p>
    </div>
  );
}
