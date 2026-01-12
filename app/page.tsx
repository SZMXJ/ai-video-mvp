import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative h-[100vh] w-full bg-black text-white">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-700/40 via-black to-cyan-600/40 animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,255,255,0.15),transparent_40%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,rgba(168,85,247,0.2),transparent_40%)]" />
        </div>

        <div className="mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Turn Text into Stunning AI Videos
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-white/70">
            Describe your idea. Choose a style.  
            Let AI generate your video in seconds.
          </p>

          {/* NEW: example prompt */}
          <p className="mt-4 text-sm text-white/40">
            Example prompt: “A cinematic shot of a futuristic city at night,
            flying camera”
          </p>

          <div className="mt-10 flex gap-6">
            <Link
              href="/create"
              className="rounded-full bg-cyan-400 px-8 py-4 text-lg font-medium text-black hover:bg-cyan-300 transition"
            >
              🎬 Create Video
            </Link>
            <Link
              href="#examples"
              className="rounded-full border border-white/20 px-8 py-4 text-lg text-white hover:bg-white/10 transition"
            >
              ▶ See Examples
            </Link>
          </div>

          <p className="mt-6 text-sm text-white/50">
            Free credits included · No credit card required
          </p>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-black py-28 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-16 text-center text-4xl font-semibold">
            Create your first video in 3 steps
          </h2>

          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                title: "Write what you imagine",
                desc: "Just type naturally. No prompt skills required.",
              },
              {
                title: "Pick style & duration",
                desc: "Cinematic, Anime, Realistic · 4s, 8s, 12s",
              },
              {
                title: "Click Generate",
                desc: "AI handles motion, camera and visuals for you.",
              },
            ].map((step, i) => (
              <div
                key={step.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-8"
              >
                <div className="mb-4 text-3xl font-bold text-cyan-400">
                  {i + 1}
                </div>
                <h3 className="text-xl font-medium">{step.title}</h3>
                <p className="mt-2 text-sm text-white/60">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="bg-black py-28 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-16 text-center text-4xl font-semibold">
            Built for creators, not editors
          </h2>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Text to Video",
                desc: "Turn simple prompts into cinematic videos.",
              },
              {
                title: "Image to Video",
                desc: "Animate still images with realistic motion.",
              },
              {
                title: "Prompt Assist",
                desc: "Automatically improves your prompt for better results.",
              },
              {
                title: "Style Control",
                desc: "Cinematic, Anime, Realistic, Sci-Fi and more.",
              },
            ].map((item) => (
              <Link
                key={item.title}
                href="/create"
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 hover:border-cyan-400 transition"
              >
                <div className="mb-4 h-32 rounded-2xl bg-gradient-to-br from-purple-600/40 to-cyan-600/40" />
                <h3 className="text-xl font-medium group-hover:text-cyan-400">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-white/60">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SHOWCASE ================= */}
      <section
        id="examples"
        className="bg-gradient-to-b from-black to-neutral-950 py-28 text-white"
      >
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-14 text-center text-4xl font-semibold">
            Try these example prompts
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              "A cyberpunk city at night, neon lights, rain",
              "Anime character running through the city",
              "Cinematic drone shot over mountains",
            ].map((prompt) => (
              <Link
                key={prompt}
                href="/create"
                className="rounded-3xl border border-white/10 bg-white/5 p-6 hover:border-cyan-400 transition"
              >
                <div className="mb-4 h-48 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30" />
                <p className="text-xs text-white/40 mb-1">Prompt example</p>
                <p className="text-sm text-white/70 line-clamp-2">
                  {prompt}
                </p>
                <p className="mt-3 text-xs text-cyan-400">
                  → Use this prompt
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="bg-black py-28 text-white text-center">
        <h2 className="text-4xl font-semibold mb-6">
          Ready to create your first AI video?
        </h2>
        <Link
          href="/create"
          className="inline-block rounded-full bg-cyan-400 px-10 py-4 text-lg font-medium text-black hover:bg-cyan-300 transition"
        >
          🎬 Start Creating
        </Link>
        <p className="mt-4 text-sm text-white/50">
          Free credits included · Start in seconds
        </p>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 bg-black py-12 text-white/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 md:flex-row md:justify-between">
          <p>© 2026 VideoAI. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#">Privacy</Link>
            <Link href="#">Terms</Link>
            <Link href="#">Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
