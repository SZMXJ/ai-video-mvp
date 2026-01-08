"use client";

import { useUser } from "./context/UserContext";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const { loggedIn, credits, login } = useUser();

  return (
    <div style={{ padding: 40 }}>
      <h1>AI 视频 MVP</h1>

      <p>登录状态：{loggedIn ? "已登录" : "未登录"}</p>
      <p>积分：{credits}</p>

      {!loggedIn && (
        <button onClick={login} style={{ marginRight: 12 }}>
          登录
        </button>
      )}

      <button onClick={() => router.push("/generate")}>
        去生成页面
      </button>
    </div>
  );
}
