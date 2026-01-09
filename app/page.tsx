export default function HomePage() {
  return (
    <main style={{ position: "relative", minHeight: "100vh" }}>
      {/* Animated background */}
      <div className="futuristic-bg" />

      {/* Header */}
      <header style={{
        position: "relative",
        zIndex: 10,
        padding: "20px 48px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <h1 style={{ color: "#00f0ff" }}>VideoAI</h1>
        <button className="btn-primary">Create Video</button>
      </header>

      {/* Hero */}
      <section style={{
        position: "relative",
        zIndex: 10,
        height: "90vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: 24
      }}>
        <h2 style={{ fontSize: 64, fontWeight: 800 }}>
          AI Video Creation <br />
          <span className="gradient-text">Reimagined</span>
        </h2>
        <p style={{ maxWidth: 680, opacity: .8 }}>
          Turn text or images into cinematic AI videos. Fast. Simple. Future-ready.
        </p>
        <div style={{ display: "flex", gap: 16 }}>
          <button className="btn-primary">Start Creating</button>
          <button className="btn-outline">Watch Demo</button>
        </div>
      </section>

      {/* Demo */}
      <section style={{ padding: "0 48px 120px", position: "relative", zIndex: 10 }}>
        <div className="demo-panel" />
      </section>

      {/* Gallery */}
      <section style={{
        padding: "0 48px 120px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
        gap: 24,
        position: "relative",
        zIndex: 10
      }}>
        <div className="motion-card" />
        <div className="motion-card" />
        <div className="motion-card" />
        <div className="motion-card" />
      </section>
    </main>
  );
}
