import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { User, MapPin, CheckCircle, AlertCircle, Calendar, Camera, Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";

const api = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 99999,
      display: "flex", alignItems: "center", gap: 10,
      padding: "12px 18px", borderRadius: 12,
      background: type === "success" ? "#E1F5EE" : "#FEE2E2",
      border: `1px solid ${type === "success" ? "#9FE1CB" : "#FECACA"}`,
      color: type === "success" ? "#085041" : "#991B1B",
      fontWeight: 600, fontSize: 13,
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      animation: "slideIn 0.3s ease",
    }}>
      {type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {msg}
    </div>
  );
};

const InputField = ({ label, icon: Icon, type = "text", value, onChange, placeholder, disabled }) => {
  const [focused, setFocused] = useState(false);
  const borderColor = focused ? "#1D9E75" : "#e2e8f0";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "flex", alignItems: "center", gap: 5 }}>
        {Icon && <Icon size={13} style={{ color: "#1D9E75" }} />}{label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", height: 44, padding: "0 14px",
            border: `1.5px solid ${borderColor}`, borderRadius: 10, fontSize: 14,
            outline: "none", boxSizing: "border-box",
            background: disabled ? "#f8fafc" : "white", color: disabled ? "#94a3b8" : "#0f172a",
            transition: "border 0.2s",
          }}
        />
      </div>
    </div>
  );
};

const SectionCard = ({ title, icon: Icon, iconColor = "#1D9E75", children }) => (
  <div style={{ background: "white", borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.04)", overflow: "hidden" }}>
    <div style={{ padding: "16px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: "#E1F5EE", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={17} style={{ color: iconColor }} />
      </div>
      <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{title}</span>
    </div>
    <div style={{ padding: 24 }}>{children}</div>
  </div>
);

const ProfileBenevole = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({ nom: "", ville: "", date_naissance: "" });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("https://backend-volun-tree.vercel.app/api/benevole/profile", api(token));
        const p = res.data.data || res.data;

        setForm({
          nom: p.nom || "",
          ville: p.ville || "",
          date_naissance: p.date_naissance || ""
        });

        if (p.photo_profile_url) {
          setAvatarPreview(p.photo_profile_url);
        }
      } catch {
        setToast({ msg: "Erreur de chargement", type: "error" });
      } finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("nom", form.nom);
      formData.append("ville", form.ville);
      formData.append("date_naissance", form.date_naissance);
      formData.append("_method", "PUT");

      if (avatarFile) {
        formData.append("photo_profile", avatarFile);
      }

      const res = await axios.post("https://backend-volun-tree.vercel.app/api/benevole/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      const updatedUser = { ...user, ...form };
      if (res.data.photo_profile_url) {
        updatedUser.photo_profile_url = res.data.photo_profile_url;
        setAvatarPreview(res.data.photo_profile_url);
      }
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setToast({ msg: "Profil enregistré !", type: "success" });
    } catch {
      setToast({ msg: "Erreur lors de l'enregistrement", type: "error" });
    } finally { setSaving(false); }
  };

  if (loading) return <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", color:"#1D9E75", fontWeight:600 }}>Chargement...</div>;

  const getLayoutStyles = () => {
    if (isMobile) {
      return { marginLeft: 0, paddingLeft: 0 };
    }
    return { marginLeft: sidebarOpen ? 256 : 80 };
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "Inter, sans-serif", display: "flex" }}>
      <style>{`
        @keyframes slideIn { from { opacity:0; transform: translateX(20px); } to { opacity:1; transform: translateX(0); } }
        @media (max-width: 1023px) {
          .mobile-sidebar-container {
            position: fixed !important;
            z-index: 10000 !important; /* t-zada l-z-index fo9 l-overlay */
            height: 100vh !important;
            box-shadow: 4px 0 24px rgba(0,0,0,0.15) !important;
          }
        }
      `}</style>

      {/* Sidebar  */}
      <div className={isMobile ? "mobile-sidebar-container" : ""} style={{ display: isMobile && !sidebarOpen ? "none" : "block" }}>
        <Sidebar isOpen={sidebarOpen} onToggleCollapse={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {isMobile && sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 9999 }}
        />
      )}

      <div style={{ flex: 1, transition: "margin 0.3s ease", ...getLayoutStyles(), width: "100%" }}>
        
        {/* Banner with responsive fixes */}
        <div style={{ 
          background: "linear-gradient(135deg, #085041 0%, #1D9E75 100%)", 
          padding: isMobile ? "80px 24px 80px" : "32px 24px 80px", 
          position: "relative" 
        }}>
          
          {isMobile && (
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                position: "absolute", top: 24, right: 24,
                background: "rgba(255, 255, 255, 0.15)", border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 10, width: 40, height: 40, display: "flex",
                alignItems: "center", justifyContent: "center", cursor: "pointer",
                color: "white", backdropFilter: "blur(4px)", zIndex: 10010
              }}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}

          <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: 0 }}>Mon Profil Bénévole</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4 }}>Gérez vos informations personnelles</p>
        </div>

        <div style={{ padding: "0 16px 32px", maxWidth: 880, margin: "0 auto" }}>
          {/* Card User Info */}        
        <div style={{
          background: "white", borderRadius: 16, border: "1px solid #e2e8f0",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)", padding: "20px 24px",
          marginTop: -48, marginBottom: 24, display: "flex", alignItems: "center", gap: 16,
          position: "relative", zIndex: 1, flexWrap: "wrap",
          }}>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: "none" }} />

          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              style={{
                width: 72, height: 72, borderRadius: "50%", overflow: "hidden",
                background: avatarPreview ? "transparent" : "linear-gradient(135deg, #085041, #1D9E75)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: 26, fontWeight: 800,
                boxShadow: "0 4px 16px rgba(8,80,65,0.25)",
                border: "3px solid white", cursor: "pointer", position: "relative",
              }}
              onClick={() => fileInputRef.current.click()}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {avatarPreview
                ? <img src={avatarPreview} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span>{form.nom?.[0]?.toUpperCase() || user.nom?.[0]?.toUpperCase() || "A"}</span>
              }
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "rgba(0,0,0,0.5)", display: "flex",
                alignItems: "center", justifyContent: "center",
                opacity: isHovered ? 1 : 0, transition: "opacity 0.2s",
              }}>
                <Camera size={18} color="white" />
              </div>
            </div>

            <div onClick={() => fileInputRef.current.click()} style={{
              position: "absolute", bottom: 0, right: 0,
              width: 22, height: 22, borderRadius: "50%",
              background: "#1D9E75", border: "2.5px solid white",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}>
              <span style={{ color: "white", fontSize: 14, fontWeight: 700, lineHeight: 1 }}>+</span>
            </div>
        </div>

            <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontSize: 19, fontWeight: 800, color: "#0F172A", margin: "0 0 3px" }}>
                  {form.nom || user.nom}
                </h2>
                <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>{user.email}</p>
              </div>
              <span style={{ padding: "6px 14px", background: "#E1F5EE", color: "#085041", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>✦ Bénévole</span>
            </div>
          </div>

          {/* Form Content */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20 }}>
            <SectionCard title="Informations Personnelles" icon={User}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
                <InputField label="Nom complet" icon={User} value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Votre nom complet" />
                <InputField label="Ville" icon={MapPin} value={form.ville} onChange={e => setForm({ ...form, ville: e.target.value })} placeholder="Votre ville" />
                <InputField label="Date de naissance" icon={Calendar} type="date" value={form.date_naissance} onChange={e => setForm({ ...form, date_naissance: e.target.value })} />
              </div>
              <button onClick={handleSaveProfile} disabled={saving} style={{
                marginTop: 25, height: 44, padding: "0 28px",
                width: isMobile ? "100%" : "auto", 
                background: saving ? "#94a3b8" : "#085041", color: "white",
                border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer", transition: "all 0.2s",
              }}>
                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </SectionCard>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfileBenevole;