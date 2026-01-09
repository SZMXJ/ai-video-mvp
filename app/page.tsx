"use client";

import { useEffect, useState } from "react";

const HERO_STYLES = [
  "from-cyan-500/40 via-purple-600/30 to-emerald-500/40",
  "from-fuchsia-500/40 via-indigo-600/30 to-cyan-500/40",
  "from-emerald-400/40 via-sky-500/30 to-purple-500/40",
  "from-orange-400/40 via-pink-500/30 to-purple-600/40",
];

export default function HomePage() {
  const [styleIndex, setStyleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStyleIndex((i) => (i + 1) % HERO_STYLES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* ================= HERO ANIMATION BACKGROUND ================= */}
      <div className="absolute inset-0 -z-10">
        {/* animated gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${HERO_STYLES[styleIndex]} transition-all duration-1000`}
        />

        {/* moving light waves */}
        <div className="absolute inset-0 animate-pulse opacity-30 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.15),transparent_40%)]" />
        <div className="absolute inset-0 animate-[spin_40s_linear_infinite] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(0,255,255,0.15),rgba(255,0,255,0.15),rgba(0,255,128,0.15),rgba(0,255,255,0.15))]" />

        {/* particles */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:22px_22px] opacity-30" />

        {/* vignette */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* ================= HEADER ================= */}
      <header className="fixed top-0 z-50 w-full backdrop-blur-xl bg-black/40 border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <div className="text-lg font-semibold tracking-wide">
            <span className="text-cyan-400">Video</span>AI Hub
          </div>

          <nav className="hidden md:flex gap-8 text-sm text-white/80">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#showcase" className="hover:text-white">Showcase</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
          </nav>

          <a
            href="/generate"
            className="rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-6 py-2 text-sm font-semibold text-black hover:scale-105 transition"
          >
            Create Video
          </a>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="flex min-h-screen items-center justify-center text-center px-6">
        <div className="max-w-5xl">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            AI Video Creation
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Without Limits
            </span>
          </h1>

          <p className="mt-8 text-lg text-white/80 max-w-2xl mx-auto">
            Generate cinematic videos from text or images.
            Multiple styles. Infinite creativity.
          </p>

          <div className="mt-12 flex justify-center gap-6">
            <a
              href="/generate"
              className="rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-12 py-4 text-lg font-semibold text-black shadow-xl hover:scale-105 transition"
            >
              Start Creating
            </a>
            <a
              href="#showcase"
              className="rounded-full border border-white/30 px-12 py-4 text-lg hover:bg-white/10"
            >
              Explore Styles
            </a>
          </div>
        </div>
      </section>

      {/* ================= SHOWCASE ================= */}
      <section
        id="showcase"
        className="py-32 bg-black/80 border-t border-white/10"
      >
        <h2 className="text-center text-4xl font-bold mb-20">
          Infinite Visual Styles
        </h2>

        <div className="mx-auto max-w-6xl grid gap-10 md:grid-cols-3 px-6">
          {[
            "Cyberpunk Motion",
            "Abstract Energy",
            "Futuristic UI Flow",
            "Neural Particles",
            "Dreamlike Animation",
            "Hyperreal Movement",
          ].map((label, i) => (
            <div
              key={i}
              className="relative h-48 rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/10 to-white/5"
            >
              <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_45%)]" />
              <div className="absolute inset-0 bg-[conic-gradient(from_90deg,rgba(0,255,255,0.25),rgba(255,0,255,0.25),rgba(0,255,128,0.25))] opacity-40" />
              <div className="absolute bottom-4 left-4 text-sm font-semibold">
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="py-32 px-6">
        <h2 className="text-center text-4xl font-bold mb-20">
          Simple Pricing
        </h2>

        <div className="mx-auto max-w-6xl grid gap-10 md:grid-cols-3">
          {[
            { name: "Free", price: "$0", desc: "Try all styles with basic limits." },
            { name: "Creator", price: "$9", desc: "More styles, longer videos." },
            { name: "Pro", price: "$29", desc: "Unlimited creativity, priority access." },
          ].map((plan) => (
            <div
              key={plan.name}
              className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center hover:border-cyan-400/40 transition"
            >
              <h3 className="text-2xl font-semibold">{plan.name}</h3>
              <p className="mt-6 text-4xl font-bold">{plan.price}</p>
              <p className="mt-6 text-white/70">{plan.desc}</p>
              <a
                href="/generate"
                className="mt-10 inline-block rounded-full bg-white/10 px-8 py-3 hover:bg-white/20"
              >
                Get Started
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 py-10 text-center text-sm text-white/50">
        © 2026 VideoAI Hub. All rights reserved.
      </footer>
    </main>
  );
}
