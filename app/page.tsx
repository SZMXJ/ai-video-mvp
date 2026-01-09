export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Glow */}
        <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-purple-600/30 blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/30 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[20%] h-[600px] w-[600px] rounded-full bg-emerald-500/20 blur-[140px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <h1 className="text-xl font-semibold tracking-wide">
          <span className="text-cyan-400">Video</span>AI Hub
        </h1>
        <nav className="flex gap-8 text-sm text-white/80">
          <a href="#" className="hover:text-white">
            Home
          </a>
          <a href="/generate" className="hover:text-white">
            Create
          </a>
          <a href="#" className="hover:text-white">
            Pricing
          </a>
          <a href="#" className="hover:text-white">
            Blog
          </a>
          <a
            href="#"
            className="rounded-full bg-white/10 px-4 py-2 hover:bg-white/20"
          >
            Sign In
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto mt-24 max-w-5xl px-6 text-center">
        <h2 className="text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
          Create{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
            Cinematic AI Videos
          </span>
          <br />
          In Seconds
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
          Generate stunning, futuristic videos from text or images.
          No editing skills required. Powered by next-gen AI models.
        </p>

        <div className="mt-10 flex justify-center gap-6">
          <a
            href="/generate"
            className="rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-8 py-4 font-semibold text-black shadow-lg shadow-cyan-500/30 transition hover:scale-105"
          >
            Start Creating
          </a>
          <a
            href="#"
            className="rounded-full border border-white/20 px-8 py-4 text-white/80 hover:bg-white/10"
          >
            Watch Demo
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto mt-32 max-w-6xl px-6">
        <div className="grid gap-10 md:grid-cols-3">
          {[
            {
              title: "Text to Video",
              desc: "Turn simple prompts into high-quality AI videos with cinematic motion.",
            },
            {
              title: "Image to Motion",
              desc: "Animate still images into dynamic, futuristic scenes.",
            },
            {
              title: "One-Click Creation",
              desc: "No timeline, no complexity. Just describe and generate.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur hover:border-cyan-400/40"
            >
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-4 text-white/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-32 border-t border-white/10 py-10 text-center text-sm text-white/50">
        © 2026 VideoAI Hub. All rights reserved.
      </footer>
    </main>
  );
}
