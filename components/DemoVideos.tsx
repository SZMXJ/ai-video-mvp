"use client";

import Link from "next/link";

const demos = [
  {
    src: "/demos/DEMO-1.mp4",
    prompt: "A cinematic shot of a futuristic city at night, flying camera",
  },
  {
    src: "/demos/DEMO-2.mp4",
    prompt: "Anime character running through a neon-lit cyberpunk street",
  },
];

export default function DemoVideos() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {demos.map((demo, i) => (
        <div
          key={i}
          className="group rounded-3xl border border-white/10 bg-white/5 p-4 hover:border-cyan-400 transition"
        >
          <video
            src={demo.src}
            autoPlay
            loop
            muted
            playsInline
            className="mb-4 w-full rounded-2xl"
          />

          <p className="mb-2 text-xs text-white/40">Prompt</p>
          <p className="text-sm text-white/70 line-clamp-2">
            {demo.prompt}
          </p>

          <Link
            href="/create"
            className="mt-4 inline-block text-sm text-cyan-400 opacity-0 group-hover:opacity-100 transition"
          >
            → Try this prompt
          </Link>
        </div>
      ))}
    </div>
  );
}
