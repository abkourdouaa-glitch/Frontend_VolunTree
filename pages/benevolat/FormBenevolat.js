import { useState } from "react";
import { User, Mail, Lock, MapPin, Calendar, Heart, CheckCircle, Users } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const inputStyle = {
  width: "100%", height: 44, padding: "0 14px",
  border: "0.5px solid #e2e8f0", borderRadius: 10,
  fontSize: 14, outline: "none", boxSizing: "border-box",
  fontFamily: "Inter, sans-serif", transition: "border 0.2s",
  background: "white",
};

const labelStyle = {
  display: "flex", alignItems: "center", gap: 6,
  fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8,
};

const FormBenevolat = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "", email: "", password: "", ville: "", date_naissance: ""
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/inscription-benevole", formData, { withCredentials: true });
      if (response.data.status === "success" || response.data.access_token) {
        localStorage.clear();
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("role", response.data.role);
      }
      toast.success("Inscription réussie !", { description: "Bienvenue dans notre communauté !" });
      setTimeout(() => navigate("/dashboard-benevole"), 1500);
    } catch (error) {
      toast.error("Erreur d'inscription", { description: error.response?.data?.message || "Vérifiez vos informations" });
    }
  };

  const fields = [
    { name: "nom",            type: "text",     icon: <User     size={14} />, placeholder: "Votre nom complet",        label: "Nom complet"       },
    { name: "email",          type: "email",    icon: <Mail     size={14} />, placeholder: "votre@email.com",          label: "Adresse e-mail"    },
    { name: "password",       type: "password", icon: <Lock     size={14} />, placeholder: "••••••••",                 label: "Mot de passe"      },
    { name: "ville",          type: "text",     icon: <MapPin   size={14} />, placeholder: "Casablanca",               label: "Ville"             },
    { name: "date_naissance", type: "date",     icon: <Calendar size={14} />, placeholder: "",                         label: "Date de naissance" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "96px 24px 48px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#E1F5EE", borderRadius: 99, padding: "6px 16px", marginBottom: 16,
          }}>
            <Heart size={12} style={{ color: "#0F6E56" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0F6E56", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Inscription Bénévole
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "#0f172a", margin: "0 0 10px" }}>
            Rejoignez la communauté
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            Créez votre compte et commencez à faire la différence
          </p>
        </div>

        {/* Form */}
        <div style={{
          background: "white", borderRadius: 20,
          padding: "32px 28px", border: "0.5px solid #e2e8f0",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)", marginBottom: 16,
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {fields.map((f) => (
              <div key={f.name}>
                <label style={labelStyle}>
                  <span style={{ color: "#1D9E75" }}>{f.icon}</span>
                  {f.label}
                </label>
                <input
                  type={f.type} name={f.name}
                  value={formData[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  required
                  style={inputStyle}
                  onFocus={(e) => e.target.style.border = "1.5px solid #1D9E75"}
                  onBlur={(e)  => e.target.style.border = "0.5px solid #e2e8f0"}
                />
                {f.name === "password" && (
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: "6px 0 0" }}>Minimum 8 caractères recommandés</p>
                )}
              </div>
            ))}

            <div style={{ borderTop: "0.5px solid #e2e8f0", paddingTop: 20, marginTop: 4 }}>
              <button
                type="submit"
                style={{
                  width: "100%", background: "#085041", color: "white",
                  border: "none", borderRadius: 10, height: 46,
                  fontSize: 14, fontWeight: 600, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#0F6E56"}
                onMouseLeave={(e) => e.currentTarget.style.background = "#085041"}
              >
                <Heart size={15} /> Créer mon compte Bénévole
              </button>
            </div>
          </form>
        </div>

        {/* Login link */}
        <p style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginBottom: 40 }}>
          Déjà inscrit ?{" "}
          <a href="/login" style={{ color: "#0F6E56", fontWeight: 600, textDecoration: "none" }}>
            Se connecter
          </a>
        </p>

        {/* Benefits */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
          {[
            { icon: <Heart size={18} />,       title: "Impact réel",        desc: "Des projets qui changent les choses"      },
            { icon: <Users size={18} />,        title: "Communauté active",  desc: "Des personnes partageant vos valeurs"     },
            { icon: <CheckCircle size={18} />,  title: "Flexibilité",        desc: "Missions selon vos disponibilités"        },
          ].map((b) => (
            <div key={b.title} style={{
              background: "white", borderRadius: 14,
              padding: "18px 16px", textAlign: "center",
              border: "0.5px solid #e2e8f0",
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "#E1F5EE", color: "#0F6E56",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 10px",
              }}>
                {b.icon}
              </div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", margin: "0 0 4px" }}>{b.title}</p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>{b.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default FormBenevolat;
