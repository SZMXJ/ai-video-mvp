"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* ================= NAVBAR ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur bg-black/60 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-semibold text-cyan-400">
            VideoAI
          </div>

          <nav className="hidden md:flex gap-8 text-sm text-white/70">
            <a className="hover:text-white" href="#">Features</a>
            <a className="hover:text-white" href="#">Models</a>
            <a className="hover:text-white" href="#">Demo</a>
            <a className="hover:text-white" href="#">Pricing</a>
          </nav>

          <button className="px-4 py-2 rounded-full bg-cyan-400 text-black font-medium">
            Create Video
          </button>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl font-bold leading-tight">
              AI Video Creation <br />
              <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>

            <p className="mt-6 text-white/70 max-w-xl">
              Turn text, images or ideas into cinematic AI videos.
              Camera control, motion intelligence, lighting and storytelling —
              all in one place.
            </p>

            <div className="mt-8 flex gap-4">
              <button className="px-6 py-3 rounded-full bg-cyan-400 text-black font-medium">
                Start Creating
              </button>
              <button className="px-6 py-3 rounded-full border border-white/20 text-white/80">
                Watch Demo
              </button>
            </div>
          </div>

          {/* HERO PREVIEW */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-[420px] rounded-3xl overflow-hidden border border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/40 via-blue-600/30 to-cyan-500/40" />
            <div className="absolute inset-0 flex items-center justify-center text-white/70">
              AI Video Preview (Animated)
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-24 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold mb-12">
            Everything You Need to Create
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              ["Text to Video", "Generate cinematic videos from prompts"],
              ["Image to Video", "Animate images with motion & depth"],
              ["Camera Control", "Dolly, pan, orbit, tracking shots"],
              ["Video Edit", "Extend, remix, upscale, relight"],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <h3 className="text-lg font-medium mb-2">{title}</h3>
                <p className="text-sm text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MODELS ================= */}
      <section className="py-24 px-6 bg-gradient-to-b from-black to-[#060b14]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold mb-12">
            Powerful Video Models
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ["Kling Motion", "Cinematic motion with audio sync"],
              ["Higgsfield DOP", "Professional camera & lighting control"],
              ["Multi-shot Engine", "Storyboard-level generation"],
              ["Relight", "3D lighting placement & intensity"],
              ["Style Transfer", "Anime, cyberpunk, film look"],
              ["Upscale Pro", "4K enhancement & restoration"],
            ].map(([title, desc]) => (
              <div
                key={title}
                className="p-6 rounded-2xl bg-black/40 border border-white/10 hover:border-cyan-400/40 transition"
              >
                <h3 className="text-lg font-medium mb-2">{title}</h3>
                <p className="text-sm text-white/60">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= DEMO ================= */}
      <section className="py-24 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold mb-12">
            Explore Styles & Demos
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {["Cyberpunk Motion", "Abstract Energy", "Cinematic Light"].map(
              (title) => (
                <div
                  key={title}
                  className="h-48 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-end p-4 text-white"
                >
                  {title}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-32 px-6 text-center bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
        <h2 className="text-4xl font-bold mb-6">
          Build the Future of Video
        </h2>
        <p className="text-white/70 mb-8">
          From creators to studios. One platform.
        </p>
        <button className="px-8 py-4 rounded-full bg-cyan-400 text-black font-medium text-lg">
          Get Started Now
        </button>
      </section>
    </main>
  );
}
