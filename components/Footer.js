import { Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin, ArrowUp, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer style={{ background: "#085041", fontFamily: "Inter, sans-serif" }}>

      {/* Main */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 24px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 40 }}>

          {/* Brand */}
          <div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 22, fontWeight: 700, color: "white", letterSpacing: "-0.5px" }}>
                Volun<span style={{ color: "#9FE1CB" }}>-</span>Tree
              </span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
              Connecter bénévoles et associations pour créer un impact positif dans nos communautés.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { href: "https://web.facebook.com/", icon: <Facebook size={16} /> },
                { href: "https://x.com/",            icon: <Twitter   size={16} /> },
                { href: "https://www.instagram.com/",icon: <Instagram size={16} /> },
                { href: "https://www.linkedin.com/", icon: <Linkedin  size={16} /> },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noreferrer" style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: "rgba(255,255,255,0.1)",
                  border: "0.5px solid rgba(255,255,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "rgba(255,255,255,0.75)",
                  transition: "all 0.2s", textDecoration: "none",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#1D9E75"; e.currentTarget.style.color = "white"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 style={{ color: "white", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>
              Navigation
            </h3>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Accueil",      href: "/#home"         },
                { label: "Présentation", href: "/#presentation" },
                { label: "Contact",      href: "/#contact"      },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} style={{
                    color: "rgba(255,255,255,0.6)", fontSize: 14,
                    textDecoration: "none", transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "white"; e.currentTarget.style.paddingLeft = "4px"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.paddingLeft = "0"; }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h3 style={{ color: "white", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>
              Ressources
            </h3>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Devenir Bénévole",       href: "/FormBenevolat"   },
                { label: "Inscrire une Association", href: "/FormAssociation" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} style={{
                    color: "rgba(255,255,255,0.6)", fontSize: 14,
                    textDecoration: "none", transition: "all 0.2s",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "white"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ color: "white", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>
              Contact
            </h3>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { icon: <MapPin size={14} />, text: "123 Rue de la Solidarité, Rabat, Maroc" },
                { icon: <Phone  size={14} />, text: "+212 1 23 05 67 74",  href: "tel:+212123056774" },
                { icon: <Mail   size={14} />, text: "contact@Volun-Tree.ma",   href: "mailto:contact@g-asso.ma" },
              ].map((c, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ color: "#9FE1CB", marginTop: 2, flexShrink: 0 }}>{c.icon}</span>
                  {c.href ? (
                    <a href={c.href} style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, textDecoration: "none", lineHeight: 1.5 }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "white"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
                    >{c.text}</a>
                  ) : (
                    <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.5 }}>{c.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.1)" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          padding: "20px 24px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: 16,
        }}>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0 }}>
            © 2026 VolunTree. Fait avec <Heart size={12} style={{ display: "inline", color: "#9FE1CB", margin: "0 3px" }} /> au Maroc.
          </p>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {["Confidentialité", "Conditions d'utilisation", "Mentions légales"].map((l) => (
              <a key={l} href="#" style={{
                color: "rgba(255,255,255,0.4)", fontSize: 12,
                textDecoration: "none", transition: "color 0.2s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.8)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
              >{l}</a>
            ))}
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              width: 36, height: 36, borderRadius: 8,
              background: "rgba(255,255,255,0.1)",
              border: "0.5px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#1D9E75"; e.currentTarget.style.color = "white"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
          >
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;