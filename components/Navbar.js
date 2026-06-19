import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          zIndex: 9999,
          transition: "all 0.3s",
          background: "rgba(8, 80, 65, 0.97)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "0.5px solid rgba(255,255,255,0.1)" : "none",
          padding: "0 2rem",
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <a href="#home" style={{ textDecoration: "none" }}>
          <span style={{ fontSize: 22, fontWeight: 700, color: "white", letterSpacing: "-0.5px" }}>
            Volun<span style={{ color: "#9FE1CB" }}></span>Tree
          </span>
        </a>

        {/* Desktop links — visibles uniquement lg+ */}
        <ul
          className="hidden lg:flex"
          style={{ alignItems: "center", gap: "8px", listStyle: "none", margin: 0, padding: 0 }}
        >
          {[
            { label: "Accueil",      href: "/#home"         },
            { label: "Présentation", href: "/#presentation" },
            { label: "Contact",      href: "/#contact"      },
          ].map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                style={{
                  color: "rgba(255,255,255,0.85)",
                  textDecoration: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  padding: "6px 14px",
                  borderRadius: 8,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.color = "white")}
                onMouseLeave={(e) => (e.target.style.color = "rgba(255,255,255,0.85)")}
              >
                {l.label}
              </a>
            </li>
          ))}

          {/* Bouton Connexion — desktop uniquement */}
          <li>
            <a
              href="/login"
              style={{
                background: "#1D9E75",
                color: "white",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 600,
                padding: "8px 20px",
                borderRadius: 8,
                marginLeft: 8,
                transition: "all 0.2s",
                display: "inline-block",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#0F6E56")}
              onMouseLeave={(e) => (e.target.style.background = "#1D9E75")}
            >
              Connexion
            </a>
          </li>
        </ul>

        {/* Mobile burger — visible uniquement sur mobile */}
        <button
          className="lg:hidden"
          onClick={() => setOpen(true)}
          style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}
        >
          <Menu size={28} />
        </button>
      </nav>

      {/* Mobile overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 9999,
            backdropFilter: "blur(2px)",
          }}
        />
      )}

      {/* Mobile sidebar — liens seulement, sans bouton Connexion */}
      <div style={{
        position: "fixed",
        top: 0, right: 0,
        width: 280,
        height: "100vh",
        background: "#085041",
        zIndex: 10000,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(.4,0,.2,1)",
        display: "flex",
        flexDirection: "column",
        padding: "24px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <span style={{ color: "white", fontSize: 18, fontWeight: 700 }}>
            Volun<span style={{ color: "#9FE1CB" }}>Tree</span>
          </span>
          <button
            onClick={() => setOpen(false)}
            style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white", borderRadius: 8, padding: "6px 8px", cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "Accueil",      href: "/#home"         },
            { label: "Présentation", href: "/#presentation" },
            { label: "Contact",      href: "/#contact"      },
          ].map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                style={{
                  color: "rgba(255,255,255,0.85)",
                  textDecoration: "none",
                  fontSize: 15,
                  fontWeight: 500,
                  padding: "12px 16px",
                  borderRadius: 10,
                  display: "block",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.1)"; e.target.style.color = "white"; }}
                onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "rgba(255,255,255,0.85)"; }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: "auto" }}>
          <a
            href="/login"
            style={{
              display: "block",
              textAlign: "center",
              background: "#1D9E75",
              color: "white",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
              padding: "12px",
              borderRadius: 10,
            }}
          >
            Connexion
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;