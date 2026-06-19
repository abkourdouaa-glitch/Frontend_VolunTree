import { useEffect, useState } from "react";
import { ArrowRight, Users, Target, Zap } from "lucide-react";

const Presentation = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      id="presentation"
      style={{ background: "#f8fafc", padding: "96px 24px", fontFamily: "Inter, sans-serif" }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 64, alignItems: "center" }}>

          {/* LEFT — contenu */}
          <div>
            {/* badge */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#E1F5EE", borderRadius: 99,
              padding: "6px 16px", marginBottom: 20,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1D9E75", display: "inline-block" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0F6E56", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                À propos de nous
              </span>
            </div>

            <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.6rem)", fontWeight: 700, color: "#0f172a", lineHeight: 1.2, marginBottom: 20 }}>
              Qui sommes-<span style={{ color: "#1D9E75" }}>nous</span> ?
            </h2>

            <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.8, marginBottom: 16 }}>
              Notre plateforme est une solution digitale dédiée à la gestion et à l'organisation du bénévolat. Elle permet de connecter efficacement les associations et les bénévoles à travers un espace centralisé, simple et accessible.
            </p>
            <p style={{ fontSize: 15, color: "#64748b", lineHeight: 1.8, marginBottom: 32 }}>
              Elle offre aux associations la possibilité de publier et gérer leurs missions, tout en facilitant aux bénévoles la recherche d'opportunités adaptées à leurs compétences et disponibilités.
            </p>

            {/* features */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
              {[
                { icon: <Zap size={15} />,    text: "Gestion centralisée et intuitive des activités bénévoles" },
                { icon: <Users size={15} />,  text: "Gestion structurée des inscriptions et participations"    },
                { icon: <Target size={15} />, text: "Suivi efficace des missions et des participations"         },
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: "#E1F5EE",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#0F6E56", flexShrink: 0,
                  }}>
                    {f.icon}
                  </div>
                  <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>{f.text}</span>
                </div>
              ))}
            </div>

            {/* stats */}
            {/* <div style={{
              display: "flex", gap: 32,
              paddingTop: 28, borderTop: "0.5px solid #e2e8f0",
              flexWrap: "wrap",
            }}>
              {[
                { val: "120+", label: "Associations" },
                { val: "850+", label: "Bénévoles"    },
                { val: "300+", label: "Missions"     },
              ].map((s) => (
                <div key={s.label}>
                  <p style={{ fontSize: 22, fontWeight: 700, color: "#085041", margin: 0 }}>{s.val}</p>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0", fontWeight: 500 }}>{s.label}</p>
                </div>
              ))}
            </div> */}
          </div>

          {/* RIGHT — image */}
          <div style={{ position: "relative" }}>
            {/* déco cercle bg */}
            <div style={{
              position: "absolute", top: -24, right: -24,
              width: 200, height: 200, borderRadius: "50%",
              background: "#E1F5EE", zIndex: 0,
            }} />
            {/* déco dots */}
            <div style={{
              position: "absolute", bottom: -16, left: -16,
              width: 80, height: 80, zIndex: 0,
              backgroundImage: "radial-gradient(circle, #9FE1CB 1.5px, transparent 1.5px)",
              backgroundSize: "14px 14px",
            }} />

            <div style={{
              position: "relative", zIndex: 1,
              borderRadius: 24, overflow: "hidden",
              boxShadow: "0 24px 48px rgba(8,80,65,0.15)",
              transform: `translateY(${scrollY * 0.03}px)`,
              transition: "transform 0.1s linear",
            }}>
              <img
                src="/images/image4.jpeg"
                alt="Présentation"
                style={{ width: "100%", height: 440, objectFit: "cover", display: "block" }}
              />
              {/* overlay badge sur image */}
              {/* <div style={{
                position: "absolute", bottom: 20, left: 20,
                background: "rgba(8,80,65,0.92)",
                backdropFilter: "blur(8px)",
                borderRadius: 12, padding: "12px 18px",
                border: "0.5px solid rgba(255,255,255,0.15)",
              }}>
                <p style={{ color: "#9FE1CB", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 3px" }}>
                  Impact réel
                </p>
                <p style={{ color: "white", fontSize: 14, fontWeight: 600, margin: 0 }}>
                  +300 missions réalisées
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Presentation;