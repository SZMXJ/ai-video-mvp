"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* ===== Top Nav ===== */}
      <header className="flex items-center justify-between px-10 py-6 border-b border-white/10">
        <div className="text-xl font-semibold text-cyan-400">
          VideoAI
        </div>

        <nav className="flex gap-8 text-white/70">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#demo" className="hover:text-white">Demo</a>
          <a href="/pricing" className="hover:text-white">Pricing</a>
        </nav>

        <Link
          href="/generate"
          className="px-6 py-2 rounded-full bg-cyan-400 text-black font-medium hover:bg-cyan-300 transition"
        >
          Create Video
        </Link>
      </header>

      {/* ===== Hero Demo ===== */}
      <section
        id="demo"
        className="px-10 py-20 flex flex-col items-center"
      >
        <motion.div
          className="w-full max-w-5xl h-[320px] rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-600 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="text-white text-xl"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Cyberpunk City · Cinematic Camera Motion
          </motion.div>
        </motion.div>

        {/* Demo styles */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {[
            "Cyberpunk Motion",
            "Abstract Energy",
            "Cinematic Light",
          ].map((text) => (
            <motion.div
              key={text}
              whileHover={{ scale: 1.05 }}
              className="h-40 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-end p-4 text-white/90"
            >
              {text}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="py-10 text-center text-white/40 text-sm">
        © 2026 VideoAI. All rights reserved.
      </footer>
    </main>
  );
}
