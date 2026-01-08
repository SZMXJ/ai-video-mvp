"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

export default function GeneratePage() {
  const params = useSearchParams();
  const prompt = params.get("prompt");
  const style = params.get("style");

  const {
    loggedIn,
    credits,
    login,
    addHistory,
  } = useUser();

  const [status, setStatus] = useState<"loading" | "done">("loading");

  useEffect(() => {
    // 模拟自动登录（后面你可以换成真实登录）
    if (!loggedIn) {
      login();
      return;
    }

    if (credits <= 0 || !prompt || !style) return;

    const timer = setTimeout(() => {
      addHistory({
        time: new Date().toLocaleString(),
        prompt,
        style,
      });
      setStatus("done");
    }, 1500);

    return () => clearTimeout(timer);
  }, [loggedIn, credits, prompt, style, login, addHistory]);

  return (
    <div style={{ padding: 40 }}>
      <h1>AI 视频生成</h1>

      <p>Prompt：{prompt}</p>
      <p>风格：{style}</p>

      <p>
        状态：
        {status === "loading" ? "生成中…" : "生成完成 ✅"}
      </p>
    </div>
  );
}
