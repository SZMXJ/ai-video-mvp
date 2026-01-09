export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* ================= VIDEO HERO BACKGROUND ================= */}
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover opacity-70"
        >
          {/* 临时公开视频，占位用，后期可换成你自己的 AI 视频 */}
          <source
            src="https://cdn.coverr.co/videos/coverr-futuristic-data-stream-4365/1080p.mp4"
            type="video/mp4"
          />
        </video>

        {/* 渐变遮罩（提亮、不压暗） */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />

        {/* 霓虹光效 */}
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/30 blur-[160px]" />
        <div className="absolute bottom-[-200px] right-[-100px] h-[500px] w-[500px] rounded-full bg-purple-500/30 blur-[160px]" />
      </div>

      {/* ================= HEADER ================= */}
      <header className="fixed top-0 z-50 w-full backdrop-blur-md bg-black/30 border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          <div className="text-lg font-semibold tracking-wide">
            <span className="text-cyan-400">Video</span>AI Hub
          </div>
          <nav className="hidden md:flex gap-8 text-sm text-white/80">
            <a href="#" className="hover:text-white">Home</a>
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#gallery" className="hover:text-white">Gallery</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <a href="/generate" className="hover:text-white">Create</a>
          </nav>
          <a
            href="/generate"
            className="rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-2 text-sm font-semibold text-black hover:scale-105 transition"
          >
            Start Creating
          </a>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="flex min-h-screen items-center justify-center px-6 text-center">
        <div className="max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
            Create{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
              AI Videos
            </span>
            <br />
            From Pure Imagination
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
            Transform text or images into cinematic AI videos.
            Built for creators, marketers, and storytellers.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-6">
            <a
              href="/generate"
              className="rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-10 py-4 text-lg font-semibold text-black shadow-lg shadow-cyan-500/30 hover:scale-105 transition"
            >
              Start Creating
            </a>
            <a
              href="#gallery"
              className="rounded-full border border-white/30 px-10 py-4 text-lg text-white/80 hover:bg-white/10"
            >
              View Examples
            </a>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-32">
        <h2 className="text-center text-4xl font-bold mb-16">
          Powerful AI Video Capabilities
        </h2>

        <div className="grid gap-10 md:grid-cols-3">
          {[
            {
              title: "Text to Video",
              desc: "Describe a scene in natural language and generate cinematic AI videos instantly.",
            },
            {
              title: "Image to Motion",
              desc: "Bring still images to life with dynamic camera movement and realism.",
            },
            {
              title: "Future-Ready Models",
              desc: "Built to support next-generation video models as they emerge.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur hover:border-cyan-400/40 transition"
            >
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="mt-4 text-white/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= GALLERY ================= */}
      <section id="gallery" className="bg-black/80 py-32">
        <h2 className="text-center text-4xl font-bold mb-12">
          What Creators Are Making
        </h2>

        <div className="mx-auto max-w-6xl grid gap-6 md:grid-cols-3 px-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-video rounded-xl bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-emerald-500/20 border border-white/10"
            />
          ))}
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="mx-auto max-w-6xl px-6 py-32">
        <h2 className="text-center text-4xl font-bold mb-16">
          Simple, Creator-Friendly Pricing
        </h2>

        <div className="grid gap-10 md:grid-cols-3">
          {[
            { name: "Free", price: "$0", desc: "Try AI video generation with basic limits." },
            { name: "Creator", price: "$9", desc: "Higher quality, longer videos, faster generation." },
            { name: "Pro", price: "$29", desc: "Professional-grade output and priority access." },
          ].map((plan) => (
            <div
              key={plan.name}
              className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center hover:border-cyan-400/40 transition"
            >
              <h3 className="text-2xl font-semibold">{plan.name}</h3>
              <p className="mt-4 text-4xl font-bold">{plan.price}</p>
              <p className="mt-4 text-white/70">{plan.desc}</p>
              <a
                href="/generate"
                className="mt-8 inline-block rounded-full bg-white/10 px-6 py-3 hover:bg-white/20"
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
