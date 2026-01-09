"use client";

import { useState } from "react";

export default function CreatePage() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("cinematic");
  const [ratio, setRatio] = useState("16:9");
  const [duration, setDuration] = useState(5);
  const [camera, setCamera] = useState("static");
  const [style, setStyle] = useState("realistic");
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      alert("Please enter a prompt");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(
        `(Mock) Video generation started\nModel: ${model}\nStyle: ${style}\nCamera: ${camera}`
      );
    }, 1800);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-2 text-3xl font-semibold">Create AI Video</h1>
      <p className="mb-8 text-white/60">
        Generate cinematic AI videos from text. Similar to Kling AI workflow.
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ================= LEFT PANEL ================= */}
        <div className="space-y-6 lg:col-span-1">
          {/* Prompt */}
          <div>
            <label className="mb-2 block text-sm text-white/70">
              Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A cinematic drone shot flying through a futuristic city at sunset..."
              className="h-36 w-full rounded-xl border border-white/10 bg-white/5 p-4 focus:border-cyan-400 focus:outline-none"
            />
            <div className="mt-2 text-xs text-white/40">
              Tip: Describe subject, motion, lighting, camera angle.
            </div>
          </div>

          {/* Model */}
          <div>
            <label className="mb-2 block text-sm text-white/70">
              Generation Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <option value="cinematic">Cinematic Pro</option>
              <option value="anime">Anime V2</option>
              <option value="realistic">Ultra Realistic</option>
              <option value="motion">Motion Control</option>
            </select>
          </div>

          {/* Style */}
          <div>
            <label className="mb-2 block text-sm text-white/70">
              Visual Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <option value="realistic">Realistic</option>
              <option value="cinema">Cinema Film</option>
              <option value="cyberpunk">Cyberpunk</option>
              <option value="fantasy">Fantasy</option>
            </select>
          </div>

          {/* Camera */}
          <div>
            <label className="mb-2 block text-sm text-white/70">
              Camera Movement
            </label>
            <select
              value={camera}
              onChange={(e) => setCamera(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <option value="static">Static</option>
              <option value="pan">Pan</option>
              <option value="zoom">Zoom In</option>
              <option value="drone">Drone Fly</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="mb-2 block text-sm text-white/70">
              Duration (seconds)
            </label>
            <input
              type="range"
              min={3}
              max={10}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full"
            />
            <div className="mt-1 text-sm text-white/60">
              {duration}s
            </div>
          </div>

          {/* Ratio */}
          <div>
            <label className="mb-2 block text-sm text-white/70">
              Aspect Ratio
            </label>
            <select
              value={ratio}
              onChange={(e) => setRatio(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <option>16:9</option>
              <option>9:16</option>
              <option>1:1</option>
            </select>
          </div>

          {/* Generate */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full rounded-xl bg-cyan-400 py-3 font-medium text-black transition hover:bg-cyan-300 disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Video"}
          </button>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="lg:col-span-2">
          <div className="relative flex h-[460px] items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-br from-purple-600/30 to-cyan-600/30">
            {loading ? (
              <div className="animate-pulse text-white/70">
                AI is generating your video…
              </div>
            ) : (
              <div className="text-center text-white/60">
                <div className="mb-2 text-lg font-medium">
                  Video Preview
                </div>
                <div className="text-sm">
                  Generated video will appear here
                </div>
              </div>
            )}
          </div>

          {/* Task Info */}
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
            Status: Idle · Resolution: 1080p · FPS: 24
          </div>
        </div>
      </div>
    </div>
  );
}
