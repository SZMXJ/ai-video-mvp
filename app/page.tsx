"use client";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* ================= BACKGROUND VIDEO ================= */}
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-80"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-digital-network-connection-5174/1080p.mp4"
            type="video/mp4"
          />
        </video>

        {/* Neon gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-purple-600/20 to-emerald-500/30" />
        <div className="absolute inset-0 bg-black/40" />

        {/* Glow orbs */}
        <div className="absolute -top-32 left-1/3 h-[500px] w-[500px] rounded-full bg-cyan-400/40 blur-[160px]" />
        <div className="absolute bottom-[-200px] right-[-100px] h-[500px] w-[500px] rounded-full bg-purple-500/40 blur-[180px]" />
      </div>

      {/* ================= HEADER ================= */}
      <header className="fixed top-0 z-50 w-full backdrop-blur-md bg-black/40 border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <div className="text-lg font-semibold tracking-wide">
            <span className="text-cyan-400">Video</span>AI
          </div>

          <nav className="hidden md:flex gap-8 text-sm text-white/80">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#demo" className="hover:text-white">Demo</a>
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
      <section className="flex min-h-screen items-center justify-center px-6 text-center">
        <div className="max-w-5xl">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
            AI Video Creation
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg text-white/80">
            Turn text or images into cinematic AI videos.
            Fast. Simple. Future-ready.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
            <a
              href="/generate"
              className="rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-12 py-4 text-lg font-semibold text-black shadow-xl hover:scale-105 transition"
            >
              Start Creating
            </a>
            <a
              href="#demo"
              className="rounded-full border border-white/30 px-12 py-4 text-lg text-white/90 hover:bg-white/10"
            >
              Watch Demo
            </a>
          </div>
        </div>
      </section>

      {/* ================= LOGO WALL ================= */}
      <section className="py-24 bg-black/70">
        <p className="text-center text-white/50 mb-10">
          Inspired by the future of AI creativity
        </p>
        <div className="flex flex-wrap justify-center gap-10 text-white/30 text-xl font-semibold">
          <span>Runway</span>
          <span>Kling</span>
          <span>Sora</span>
          <span>Pika</span>
          <span>Gen-2</span>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-32">
        <h2 className="text-center text-4xl font-bold mb-20">
          Built for the AI Video Era
        </h2>

        <div className="grid gap-12 md:grid-cols-3">
          {[
            {
              title: "Text to Video",
              desc: "Describe a scene. AI handles camera, motion, and style.",
            },
            {
              title: "Image Animation",
              desc: "Turn still images into dynamic cinematic shots.",
            },
            {
              title: "Next-Gen Models",
              desc: "Designed to integrate future AI video models seamlessly.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-10 backdrop-blur hover:border-cyan-400/40 transition"
            >
              <h3 className="text-2xl font-semibold">{item.title}</h3>
              <p className="mt-6 text-white/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= DEMO ================= */}
      <section id="demo" className="bg-black/80 py-32">
        <h2 className="text-center text-4xl font-bold mb-16">
          See AI Video in Action
        </h2>

        <div className="mx-auto max-w-6xl px-6">
          <div className="aspect-video rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-emerald-500/20 flex items-center justify-center text-white/50">
            Demo video placeholder
          </div>
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-32">
        <h2 className="text-center text-4xl font-bold mb-20">
          Simple Pricing
        </h2>

        <div className="grid gap-10 md:grid-cols-3">
          {[
            { name: "Free", price: "$0", desc: "Limited generations for testing ideas." },
            { name: "Creator", price: "$9", desc: "Longer videos and faster processing." },
            { name: "Pro", price: "$29", desc: "Best quality, priority access." },
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
        © 2026 VideoAI. All rights reserved.
      </footer>
    </main>
  );
}
