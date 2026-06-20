import { Users, Heart, ArrowRight, Shield, Zap, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* ── Hero ── */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* background image */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img src="/images/image5.jpeg" style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="hero" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8, 80, 66, 0.73) 0%, rgba(29, 158, 117, 0.44) 50%, rgba(8, 80, 66, 0.62) 100%)" }} />
        </div>

        {/* contenu */}
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px", maxWidth: 800, margin: "0 auto" }}>
          {/* badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.12)",
            border: "0.5px solid rgba(255,255,255,0.25)",
            borderRadius: 99, padding: "6px 16px",
            marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#9FE1CB", display: "inline-block" }} />
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 12, fontWeight: 500, letterSpacing: "0.05em" }}>
              Plateforme de bénévolat au Maroc
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 700, color: "white", lineHeight: 1.15, marginBottom: 20 }}>
            Rejoignez une communauté<br />
            <span style={{ color: "#9FE1CB" }}>qui fait la différence</span>
          </h1>

          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "rgba(255, 255, 255, 0.9)", marginBottom: 40, lineHeight: 1.7, maxWidth: 560, margin: "0 auto 40px" }}>
            Connectez bénévoles et associations pour créer un impact positif dans vos communautés locales.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/FormBenevolat" style={{ textDecoration: "none" }}>
              <button style={{
                background: "#1D9E75",
                color: "white",
                border: "none",
                borderRadius: 10,
                padding: "14px 28px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#0F6E56"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#1D9E75"}
              >
                <Users size={16} /> Devenir Bénévole
              </button>
            </Link>

            <Link to="/FormAssociation" style={{ textDecoration: "none" }}>
              <button style={{
                background: "rgba(255,255,255,0.12)",
                color: "white",
                border: "0.5px solid rgba(255,255,255,0.3)",
                borderRadius: 10,
                padding: "14px 28px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "all 0.2s",
                backdropFilter: "blur(8px)",
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
              >
                <Heart size={16} /> Inscrire mon Association
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ background: "#f8fafc", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#1D9E75", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
              Pourquoi VolunTree ?
            </p>
            <h2 style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", fontWeight: 700, color: "#0f172a", margin: 0 }}>
              Une plateforme pensée pour vous
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {[
              {
                icon: <Zap size={22} />,
                color: "#1D9E75",
                bg: "#E1F5EE",
                title: "Simple et rapide",
                desc: "Trouvez et rejoignez des missions en quelques clics. Interface intuitive conçue pour tous.",
              },
              {
                icon: <Shield size={22} />,
                color: "#085041",
                bg: "#E1F5EE",
                title: "Associations vérifiées",
                desc: "Toutes les associations sont validées avec récépissé officiel avant publication.",
              },
              {
                icon: <Globe size={22} />,
                color: "#1D9E75",
                bg: "#E1F5EE",
                title: "Impact local",
                desc: "Des missions partout au Maroc. Contribuez à votre ville et votre quartier.",
              },
            ].map((f) => (
              <div key={f.title} style={{
                background: "white",
                borderRadius: 16,
                padding: "28px 24px",
                border: "0.5px solid #e2e8f0",
                transition: "all 0.2s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.07)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: f.bg, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  color: f.color, marginBottom: 16,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <style>{`
        @keyframes scrollDot {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(8px); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default Home;