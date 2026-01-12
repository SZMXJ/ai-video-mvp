import Link from "next/link";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* ================= HERO ================= */}
      <section className="py-24 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-semibold">
          Simple, usage-based pricing
        </h1>
        <p className="mt-4 text-white/60 max-w-2xl mx-auto">
          You only pay for what you generate.  
          Start free. Upgrade when you’re ready.
        </p>
      </section>

      {/* ================= PLANS ================= */}
      <section className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-3">
        {/* ===== Free ===== */}
        <PlanCard
          name="Free"
          price="$0"
          desc="Perfect for trying things out"
          features={[
            "Free credits included",
            "Basic video quality",
            "Standard generation speed",
          ]}
          cta="Start Creating"
          href="/create"
        />

        {/* ===== Pro ===== */}
        <PlanCard
          highlight
          name="Pro"
          price="$29 / month"
          desc="For creators who generate regularly"
          features={[
            "More monthly credits",
            "Higher video quality",
            "Faster generation queue",
            "No watermark",
          ]}
          cta="Upgrade to Pro"
          href="/create"
        />

        {/* ===== Studio ===== */}
        <PlanCard
          name="Studio"
          price="$99 / month"
          desc="For teams & heavy usage"
          features={[
            "Large credit allocation",
            "Priority generation",
            "Commercial usage",
            "Future API access",
          ]}
          cta="Get Started"
          href="/create"
        />
      </section>

      {/* ================= CREDITS EXPLAIN ================= */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-6">
          How credits work
        </h2>

        <div className="grid gap-6 md:grid-cols-3">
          <CreditBox title="4s video" desc="≈ 8 credits" />
          <CreditBox title="8s video" desc="≈ 16 credits" />
          <CreditBox title="12s video" desc="≈ 24 credits" />
        </div>

        <p className="mt-6 text-sm text-white/50">
          Credits are only used when you generate a video.
          No hidden costs.
        </p>
      </section>

      {/* ================= CTA ================= */}
      <section className="pb-28 text-center">
        <h3 className="text-2xl font-medium mb-4">
          Try it before you decide
        </h3>
        <Link
          href="/create"
          className="inline-block rounded-full bg-cyan-400 px-10 py-4 text-black font-medium hover:bg-cyan-300 transition"
        >
          🎬 Create Your First Video
        </Link>
        <p className="mt-4 text-sm text-white/50">
          Free credits · No credit card required
        </p>
      </section>
    </main>
  );
}

/* ================= COMPONENTS ================= */

function PlanCard({
  name,
  price,
  desc,
  features,
  cta,
  href,
  highlight = false,
}: any) {
  return (
    <div
      className={`rounded-3xl border p-8 ${
        highlight
          ? "border-cyan-400 bg-cyan-400/10"
          : "border-white/10 bg-white/5"
      }`}
    >
      <h3 className="text-xl font-medium">{name}</h3>
      <p className="mt-2 text-sm text-white/60">{desc}</p>

      <div className="mt-6 text-4xl font-bold">{price}</div>

      <ul className="mt-6 space-y-2 text-sm text-white/70">
        {features.map((f: string) => (
          <li key={f}>• {f}</li>
        ))}
      </ul>

      <Link
        href={href}
        className={`mt-8 inline-block w-full rounded-full py-3 text-center font-medium transition ${
          highlight
            ? "bg-cyan-400 text-black hover:bg-cyan-300"
            : "bg-white/10 hover:bg-white/20"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}

function CreditBox({ title, desc }: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="text-lg font-medium">{title}</div>
      <div className="mt-2 text-sm text-white/60">{desc}</div>
    </div>
  );
}
