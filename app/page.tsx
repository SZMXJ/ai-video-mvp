"use client";

import { useRouter } from "next/navigation";
import { useUser } from "./context/UserContext";

export default function HomePage() {
  const router = useRouter();
  const { loggedIn, login } = useUser();

  return (
    <div style={{ padding: 40 }}>
      <h1>AI 视频 MVP</h1>

      {!loggedIn ? (
        <button onClick={login}>登录（模拟）</button>
      ) : (
        <>
          <p>已登录</p>
          <button onClick={() => router.push("/generate")}>
            去生成页面
          </button>
        </>
      )}
    </div>
  );
}
