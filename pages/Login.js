import { useState } from "react";
import { Mail, Lock, Heart, CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login", formData);
      if (response.data.status === "success") {
        localStorage.clear();
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("role", response.data.role);
        toast.success("Connexion réussie !");
        setTimeout(() => {
          window.location.href = response.data.role === "association"
            ? "/dashboard-association"
            : "/dashboard-benevole";
        }, 1000);
      }
    } catch (err) {
      console.log("Erreur Complète ", err);
      console.log("Réponse du Backend", err.response?.data);
      console.log("Code Status", err.response?.status);
      toast.error("Erreur", { description: err.response?.data?.message || "Erreur de connexion" });
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#f8fafc",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px", fontFamily: "Inter, sans-serif",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Logo + titre */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>

          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", margin: "60px 0 6px" }}>
            Bienvenue sur Volun-Tree
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            Connectez-vous à votre espace
          </p>
        </div>

        {/* Form card */}
        <div style={{
          background: "white", borderRadius: 20,
          padding: "32px 28px",
          border: "0.5px solid #e2e8f0",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Email */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                <Mail size={14} style={{ color: "#1D9E75" }} /> Adresse e-mail
              </label>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="votre@email.com" required
                style={{
                  width: "100%", height: 44, padding: "0 14px",
                  border: "0.5px solid #e2e8f0", borderRadius: 10,
                  fontSize: 14, outline: "none", boxSizing: "border-box",
                  transition: "border 0.2s",
                }}
                onFocus={(e) => e.target.style.border = "1.5px solid #1D9E75"}
                onBlur={(e)  => e.target.style.border = "0.5px solid #e2e8f0"}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                <Lock size={14} style={{ color: "#1D9E75" }} /> Mot de passe
              </label>
              <input
                type="password" name="password" value={formData.password}
                onChange={handleChange} placeholder="••••••••" required
                style={{
                  width: "100%", height: 44, padding: "0 14px",
                  border: "0.5px solid #e2e8f0", borderRadius: 10,
                  fontSize: 14, outline: "none", boxSizing: "border-box",
                  transition: "border 0.2s",
                }}
                onFocus={(e) => e.target.style.border = "1.5px solid #1D9E75"}
                onBlur={(e)  => e.target.style.border = "0.5px solid #e2e8f0"}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{
                background: "#085041", color: "white",
                border: "none", borderRadius: 10,
                height: 46, fontSize: 14, fontWeight: 600,
                cursor: "pointer", display: "flex",
                alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all 0.2s", marginTop: 4,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#0F6E56"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#085041"}
            >
              Se connecter <ArrowRight size={15} />
            </button>
          </form>
        </div>

        {/* Inscription cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
          {[
            { href: "/FormBenevolat",   icon: <Heart size={20} />,        label: "Bénévole",    sub: "S'inscrire", color: "#E1F5EE", iconColor: "#0F6E56" },
            { href: "/FormAssociation", icon: <CheckCircle size={20} />,  label: "Association", sub: "S'inscrire", color: "#E1F5EE", iconColor: "#085041" },
          ].map((c) => (
            <a key={c.label} href={c.href} style={{ textDecoration: "none" }}>
              <div style={{
                background: "white", borderRadius: 16,
                padding: "20px 16px", textAlign: "center",
                border: "0.5px solid #e2e8f0",
                transition: "all 0.2s", cursor: "pointer",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1D9E75"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(8,80,65,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: c.color, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  margin: "0 auto 10px", color: c.iconColor,
                }}>
                  {c.icon}
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", margin: "0 0 3px" }}>{c.label}</p>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{c.sub}</p>
              </div>
            </a>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Login;