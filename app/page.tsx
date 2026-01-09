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
            AI Video Generation
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70">
            Create cinematic, anime, realistic videos from text or images.
            Powered by next-gen generative AI.
          </p>

          <div className="mt-10 flex gap-6">
            <Link
              href="/create"
              className="rounded-full bg-cyan-400 px-8 py-4 text-lg font-medium text-black hover:bg-cyan-300 transition"
            >
              Start Creating
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-white/20 px-8 py-4 text-lg text-white hover:bg-white/10 transition"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="bg-black py-28 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-16 text-center text-4xl font-semibold">
            Powerful AI Video Tools
          </h2>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Text to Video",
                desc: "Turn prompts into cinematic videos with motion and depth.",
              },
              {
                title: "Image to Video",
                desc: "Animate still images with realistic movement.",
              },
              {
                title: "Camera Motion",
                desc: "Control zoom, pan, and cinematic camera paths.",
              },
              {
                title: "Style Control",
                desc: "Anime, realistic, sci-fi, cinematic styles.",
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
      <section className="bg-gradient-to-b from-black to-neutral-950 py-28 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-14 text-center text-4xl font-semibold">
            What Creators Are Making
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {["Sci-Fi City", "Anime Action", "Realistic Nature"].map((label) => (
              <div
                key={label}
                className="rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div className="mb-4 h-48 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-purple-500/30" />
                <p className="text-sm text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section className="bg-black py-28 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-16 text-center text-4xl font-semibold">
            Simple Pricing
          </h2>

          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                name: "Free",
                price: "$0",
                features: ["Low resolution", "Limited queue", "Watermark"],
              },
              {
                name: "Pro",
                price: "$29",
                features: ["HD video", "Fast queue", "No watermark"],
                highlight: true,
              },
              {
                name: "Studio",
                price: "$99",
                features: ["4K video", "Priority queue", "API access"],
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl border p-8 ${
                  plan.highlight
                    ? "border-cyan-400 bg-cyan-400/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <h3 className="text-xl font-medium">{plan.name}</h3>
                <p className="mt-4 text-4xl font-bold">{plan.price}</p>
                <ul className="mt-6 space-y-2 text-sm text-white/70">
                  {plan.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>

                <Link
                  href="/create"
                  className="mt-8 inline-block w-full rounded-full bg-cyan-400 py-3 text-center font-medium text-black hover:bg-cyan-300 transition"
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
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
