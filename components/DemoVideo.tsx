"use client";

import Link from "next/link";

export default function DemoVideo({
  src,
  prompt,
}: {
  src: string;
  prompt: string;
}) {
  return (
    <Link
      href="/create"
      className="group block rounded-3xl border border-white/10 bg-white/5 p-4 hover:border-cyan-400 transition"
    >
      <video
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className="mb-4 h-48 w-full rounded-2xl object-cover"
      />

      <p className="text-xs text-white/40 mb-1">Prompt</p>
      <p className="text-sm text-white/70 line-clamp-2 group-hover:text-white">
        {prompt}
      </p>

      <div className="mt-3 text-xs text-cyan-400 opacity-0 group-hover:opacity-100 transition">
        Click to recreate →
      </div>
    </Link>
  );
}
