"use client";

import { motion } from "framer-motion";

export default function GeneratePage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl border border-white/10 rounded-3xl p-8 bg-white/5 backdrop-blur"
      >
        <h1 className="text-3xl font-semibold mb-2">
          Create Your AI Video
        </h1>
        <p className="text-white/60 mb-8">
          Describe your idea. Our AI will turn it into a cinematic video.
        </p>

        {/* Prompt input */}
        <textarea
          placeholder="A futuristic city at night, neon lights, cinematic camera movement..."
          className="w-full h-40 rounded-xl bg-black/60 border border-white/10 p-4 text-white placeholder-white/30 focus:outline-none focus:border-cyan-400 transition"
        />

        {/* Options */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <select className="bg-black/60 border border-white/10 rounded-xl p-3 text-white">
            <option>Cyberpunk</option>
            <option>Cinematic</option>
            <option>Anime</option>
            <option>Realistic</option>
          </select>

          <select className="bg-black/60 border border-white/10 rounded-xl p-3 text-white">
            <option>16:9</option>
            <option>9:16</option>
            <option>1:1</option>
          </select>
        </div>

        {/* Generate button */}
        <button className="mt-8 w-full py-4 rounded-full bg-cyan-400 text-black font-medium text-lg hover:bg-cyan-300 transition">
          Generate Video
        </button>

        {/* Placeholder result */}
        <div className="mt-10 h-48 rounded-2xl border border-white/10 flex items-center justify-center text-white/40">
          Video preview will appear here
        </div>
      </motion.div>
    </main>
  );
}
