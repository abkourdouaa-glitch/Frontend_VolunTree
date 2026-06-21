import { useState } from "react";
import { Building2, Mail, Lock, MapPin, FileText, Upload, CheckCircle, Phone } from "lucide-react";
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

const FormAssociation = () => {
  const navigate  = useNavigate();
  const [fileName, setFileName] = useState("");
  const [formData, setFormData] = useState({
    nom: "", email: "", password: "", telephone: "", ville: "", description: "", recepisse: null
  });

  const handleChange     = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setFileName(file.name); setFormData({ ...formData, recepisse: file }); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    try {
      const response = await axios.post("https://backend-volun-tree.vercel.app/api/inscription-association", data, {
        headers: { "Content-Type": "multipart/form-data" }, withCredentials: true,
      });
      if (response.data.status === "success" || response.data.access_token) {
        localStorage.clear();
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("role", response.data.role);
      }
      toast.success("Inscription réussie !", { description: "Votre association a été enregistrée." });
      setTimeout(() => navigate("/dashboard-association"), 1500);
    } catch (error) {
      toast.error("Erreur d'inscription", { description: error.response?.data?.message || "Vérifiez les données." });
    }
  };

  const fields = [
    { name: "nom",       type: "text",     icon: <Building2 size={14} />, placeholder: "Association Solidaire", label: "Nom de l'association"    },
    { name: "email",     type: "email",    icon: <Mail      size={14} />, placeholder: "contact@asso.ma",       label: "Adresse e-mail"           },
    { name: "password",  type: "password", icon: <Lock      size={14} />, placeholder: "••••••••",              label: "Mot de passe"             },
    { name: "telephone", type: "tel",      icon: <Phone     size={14} />, placeholder: "06XXXXXXXX",            label: "Numéro de téléphone"      },
    { name: "ville",     type: "text",     icon: <MapPin    size={14} />, placeholder: "Casablanca",            label: "Ville"                    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "96px 24px 48px", fontFamily: "Inter, sans-serif" }}>
      <div style={{ maxWidth: 580, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#E1F5EE", borderRadius: 99, padding: "6px 16px", marginBottom: 16,
          }}>
            <Building2 size={12} style={{ color: "#0F6E56" }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0F6E56", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Inscription Association
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "#0f172a", margin: "0 0 10px" }}>
            Rejoignez notre réseau
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            Publiez vos missions et trouvez des bénévoles engagés
          </p>
        </div>

        {/* Form */}
        <div style={{
          background: "white", borderRadius: 20,
          padding: "32px 28px", border: "0.5px solid #e2e8f0",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Champs simples */}
            {fields.map((f) => (
              <div key={f.name}>
                <label style={labelStyle}>
                  <span style={{ color: "#1D9E75" }}>{f.icon}</span> {f.label}
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

            {/* Description */}
            <div>
              <label style={labelStyle}>
                <span style={{ color: "#1D9E75" }}><FileText size={14} /></span> Description
              </label>
              <textarea
                name="description" value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez les missions et objectifs de votre association..."
                rows={4} required
                style={{
                  ...inputStyle, height: "auto",
                  padding: "12px 14px", resize: "none",
                }}
                onFocus={(e) => e.target.style.border = "1.5px solid #1D9E75"}
                onBlur={(e)  => e.target.style.border = "0.5px solid #e2e8f0"}
              />
            </div>

            {/* Upload récépissé */}
            {/* 
            <div>
              <label style={labelStyle}>
                <span style={{ color: "#1D9E75" }}><Upload size={14} /></span> Récépissé de déclaration
              </label>
              <input
                id="recepisse" type="file" name="recepisse"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                required style={{ display: "none" }}
              />
              <label htmlFor="recepisse" style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                width: "100%", height: 110,
                border: "1.5px dashed #cbd5e1",
                borderRadius: 12, cursor: "pointer",
                transition: "all 0.2s", background: "#fafafa",
                boxSizing: "border-box",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1D9E75"; e.currentTarget.style.background = "#E1F5EE"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.background = "#fafafa"; }}
              >
                {fileName ? (
                  <>
                    <CheckCircle size={22} style={{ color: "#0F6E56", marginBottom: 6 }} />
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#0F6E56", margin: "0 0 2px" }}>Fichier sélectionné</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, maxWidth: 260, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fileName}</p>
                  </>
                ) : (
                  <>
                    <Upload size={22} style={{ color: "#94a3b8", marginBottom: 6 }} />
                    <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 2px", fontWeight: 500 }}>Cliquez pour télécharger</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>PDF, JPG ou PNG (max. 10MB)</p>
                  </>
                )}
              </label>
            </div>
             */}

            {/* Submit */}
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
                <Building2 size={15} /> Créer mon compte Association
              </button>
            </div>

          </form>
        </div>

        {/* Login link */}
        <p style={{ textAlign: "center", fontSize: 13, color: "#64748b", marginTop: 16 }}>
          Déjà inscrit ?{" "}
          <a href="/login" style={{ color: "#0F6E56", fontWeight: 600, textDecoration: "none" }}>
            Se connecter
          </a>
        </p>

      </div>
    </div>
  );
};

export default FormAssociation;