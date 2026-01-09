export default function HomePage() {
  return (
    <main className="bg-black text-white min-h-screen overflow-hidden">
      {/* HERO */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10 animated-bg" />

        <header className="absolute top-0 left-0 w-full flex justify-between items-center px-8 py-6">
          <h1 className="text-xl font-bold text-cyan-400">VideoAI Hub</h1>
          <button className="px-6 py-2 rounded-full bg-cyan-400 text-black font-semibold hover:scale-105 transition">
            Create Video
          </button>
        </header>

        <h2 className="text-6xl font-extrabold leading-tight">
          Creation <br />
          <span className="gradient-text">Without Limits</span>
        </h2>

        <p className="mt-6 max-w-xl text-gray-300 text-lg">
          Generate cinematic AI videos from text or images.
          Multiple styles. Infinite creativity.
        </p>

        <div className="mt-10 flex gap-6">
          <button className="px-8 py-4 rounded-full bg-gradient-to-r from-cyan-400 to-green-400 text-black font-bold text-lg hover:scale-110 transition">
            Start Creating
          </button>
          <button className="px-8 py-4 rounded-full border border-gray-500 hover:border-cyan-400 transition">
            Explore Styles
          </button>
        </div>
      </section>

      {/* ANIMATED STYLE GALLERY */}
      <section className="py-24 px-10 space-y-12">
        <h3 className="text-4xl font-bold text-center mb-12">
          Live AI Motion Styles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <AnimatedCard title="Cyberpunk Motion" variant="cyber" />
          <AnimatedCard title="Abstract Energy" variant="energy" />
          <AnimatedCard title="Neural Flow" variant="neural" />
          <AnimatedCard title="Dreamlike Art" variant="dream" />
        </div>
      </section>

      {/* INLINE STYLES */}
      <style jsx>{`
        .animated-bg {
          background: linear-gradient(
            120deg,
            #00f5ff,
            #7f00ff,
            #00ff99
          );
          background-size: 300% 300%;
          animation: bgMove 15s ease infinite;
          filter: blur(80px);
          opacity: 0.6;
        }

        @keyframes bgMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .gradient-text {
          background: linear-gradient(to right, #00f5ff, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .card {
          position: relative;
          height: 260px;
          border-radius: 20px;
          overflow: hidden;
          background: #111;
        }

        .card::before {
          content: "";
          position: absolute;
          inset: -50%;
          background: linear-gradient(
            60deg,
            rgba(0,255,255,0.4),
            rgba(255,0,255,0.3),
            rgba(0,255,153,0.4)
          );
          animation: rotate 12s linear infinite;
        }

        .card::after {
          content: "";
          position: absolute;
          inset: 3px;
          background: #0a0a0a;
          border-radius: 16px;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}

/* Card Component */
function AnimatedCard({ title, variant }: { title: string; variant: string }) {
  return (
    <div className="card flex items-end p-6">
      <h4 className="relative z-10 text-xl font-semibold">{title}</h4>
    </div>
  );
}
