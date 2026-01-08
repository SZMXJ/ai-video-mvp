"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "./context/UserContext";

export default function HomePage() {
  const router = useRouter();
  const { credits, loggedIn, login } = useContext(UserContext);

  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Cinematic");

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    router.push(
      `/generate?prompt=${encodeURIComponent(prompt)}&style=${style}`
    );
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center">

      {/* Top bar */}
      <div className="w-full max-w-5xl flex justify-between items-center px-6 py-4 text-sm text-gray-400">
        <div>
          Credits: <span className="text-white">{credits}</span>
        </div>
        {!loggedIn ? (
          <button
            onClick={login}
            className="border px-3 py-1 rounded"
          >
            Log in
          </button>
        ) : (
          <span className="text-green-400">Logged in</span>
        )}
      </div>

      {/* HERO */}
      <section className="min-h-[80vh] flex flex-col justify-center items-center px-4 max-w-4xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          Create AI Videos from Text
        </h1>

        <p className="text-gray-400 mb-8 text-center">
          Kling / Sora-style cinematic video generation. No editing skills needed.
        </p>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A cinematic drone shot flying over a futuristic city at sunset..."
          className="w-full h-32 p-4 rounded-lg bg-zinc-900 border border-zinc-700 focus:ring-2 focus:ring-white outline-none"
        />

        {/* Style */}
        <div className="flex gap-2 mt-4">
          {["Cinematic", "Anime", "Realistic", "Sci-Fi"].map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              className={`px-4 py-2 rounded border ${
                style === s
                  ? "bg-white text-black"
                  : "border-zinc-700 text-gray-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          onClick={handleGenerate}
          className="mt-6 w-full bg-white text-black py-4 rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Generate Video
        </button>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-3xl text-center py-20">
        <h2 className="text-3xl font-bold mb-10">How it works</h2>

        <div className="space-y-10 text-gray-300">
          <div>
            <div className="text-2xl mb-2">✍️</div>
            <h3 className="font-semibold text-white">Describe a scene</h3>
            <p>Use natural language prompts.</p>
          </div>

          <div>
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="font-semibold text-white">AI generates the video</h3>
            <p>Our models handle motion & style.</p>
          </div>

          <div>
            <div className="text-2xl mb-2">⬇️</div>
            <h3 className="font-semibold text-white">Download & share</h3>
            <p>Use it anywhere instantly.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
