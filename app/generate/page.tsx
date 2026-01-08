"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GeneratePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");

  return (
    <main style={{ padding: 24 }}>
      <h1>Generate Page</h1>

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter prompt"
        style={{
          width: "100%",
          padding: 8,
          marginTop: 12,
        }}
      />

      <button
        style={{ marginTop: 12 }}
        onClick={() => {
          alert("Generate: " + prompt);
        }}
      >
        Generate
      </button>
    </main>
  );
}
