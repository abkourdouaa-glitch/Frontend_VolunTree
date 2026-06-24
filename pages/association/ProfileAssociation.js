
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Building2, MapPin, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Users, Target, FileText, Phone, Menu } from "lucide-react";
import SideBar from "./SideBar";
import { Camera } from "lucide-react";
 
const api = (token) => ({ headers: { Authorization: `Bearer ${token}` } });
 
const Toast = ({ msg, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 9999,
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
 
const InputField = ({ label, icon: Icon, type = "text", value, onChange, placeholder, disabled, multiline }) => {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isPassword = type === "password";
  const borderColor = focused ? "#1D9E75" : "#e2e8f0";
 
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", display: "flex", alignItems: "center", gap: 5 }}>
        {Icon && <Icon size={13} style={{ color: "#1D9E75" }} />}{label}
      </label>
      <div style={{ position: "relative" }}>
        {multiline ? (
          <textarea
            value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            rows={4}
            style={{
              width: "100%", padding: "12px 14px", border: `1.5px solid ${borderColor}`,
              borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box",
              background: disabled ? "#f8fafc" : "white", color: disabled ? "#94a3b8" : "#0f172a",
              transition: "border 0.2s", resize: "vertical", fontFamily: "inherit",
            }}
          />
        ) : (
          <input
            type={isPassword ? (showPass ? "text" : "password") : type}
            value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={{
              width: "100%", height: 44, padding: isPassword ? "0 40px 0 14px" : "0 14px",
              border: `1.5px solid ${borderColor}`, borderRadius: 10, fontSize: 14,
              outline: "none", boxSizing: "border-box",
              background: disabled ? "#f8fafc" : "white", color: disabled ? "#94a3b8" : "#0f172a",
              transition: "border 0.2s",
            }}
          />
        )}
        {isPassword && (
          <button type="button" onClick={() => setShowPass(!showPass)} style={{
            position: "absolute", right: 12, top: multiline ? 12 : "50%",
            transform: multiline ? "none" : "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0,
          }}>
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
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
 
const ProfileAssociation = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  

  const [form, setForm] = useState({ nom: "", ville: "", description: "", telephone: "" });
  const [passForm, setPassForm] = useState({ current: "", newPass: "", confirm: "" });
  const [missions, setMissions] = useState([]);
  

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const fileInputRef = useRef(null);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, missionsRes] = await Promise.all([
          axios.get("http://localhost:8000/api/association/profile", api(token)),
          axios.get(`http://localhost:8000/api/missions/association/${user.id}`, api(token)),
        ]);
        
        const p = profileRes.data.data || profileRes.data;
        
        setForm({ 
          nom: p.nom || "", 
          ville: p.ville || "", 
          description: p.description || "",
          telephone: p.telephone || "" 
        });

        if (p.photo_profile_url) {
          setAvatarPreview(p.photo_profile_url);
        }
        setMissions(missionsRes.data || []);
      } catch {
        setToast({ msg: "Erreur chargement profil", type: "error" });
      } finally { setLoading(false); }
    };
    fetchData();
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
    formData.append("description", form.description);
    formData.append("telephone", form.telephone ? String(form.telephone) : "");
    
    if (avatarFile) {
      formData.append("photo_profile", avatarFile);
    }

    const res = await axios.post("http://localhost:8000/api/association/profile", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    const updatedUser = { ...user, ...form };
    if (res.data.photo_profile_url) {
      updatedUser.photo_profile_url = res.data.photo_profile_url;
      setAvatarPreview(res.data.photo_profile_url);
    }
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setToast({ msg: "Profil mis à jour avec succès !", type: "success" });
    } catch (err) {
    console.log("Validation errors:", err.response?.data?.errors);
    console.log("Message:", err.response?.data?.message);
    setToast({ msg: "Erreur lors de la mise à jour", type: "error" });
    } finally { setSaving(false); }
};


 
  const totalBenevoles = missions.reduce((acc, m) => acc + (m.vols || 0), 0);
  
  if (loading) return <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", color:"#1D9E75", fontWeight:600 }}>Chargement...</div>;
 

  return (
  <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "Inter, sans-serif" }}>
    <style>{`@keyframes slideIn { from { opacity:0; transform: translateX(20px); } to { opacity:1; transform: translateX(0); } }`}</style>

    <SideBar isOpen={sidebarOpen} onToggleCollapse={() => setSidebarOpen(!sidebarOpen)} />

    {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

    <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>

      {/* ── HERO ── */}
      <div style={{ background: "linear-gradient(135deg, #085041 0%, #1D9E75 100%)"}} className="d-flex">
        <div className="mt-4">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-green-700">
          <Menu className="w-5 h-5" />
        </button>
        </div>
      <div style={{ padding: "28px 32px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
        <h1 style={{ color: "white", fontSize: 22, fontWeight: 700, margin: 0, position: "relative" }}>Profil Association</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4, position: "relative" }}>Gérez les informations de votre organisation</p>
      </div>
      </div>

      <div style={{ padding: "0 24px 32px", maxWidth: 880, margin: "0 auto", width: "100%" }}>
        {/* Avatar Card */}
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
              <h2 style={{ fontSize: 19, fontWeight: 800, color: "#0F172A", margin: "0 0 3px", letterSpacing: "-0.01em" }}>{form.nom || user.nom}</h2>
              <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>{user.email}</p>
            </div>
            <span style={{ padding: "6px 14px", background: "#ECFDF5", color: "#065F46", borderRadius: 20, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>✦ Association</span>
          </div>
        </div>

        {/* Infos */}
        <SectionCard title="Informations de l'Association" icon={Building2}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <InputField label="Nom de l'association" icon={Building2} value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Nom" />
            <InputField label="Téléphone" icon={Phone} value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} placeholder="N° de Téléphone" />
            <InputField label="Ville" icon={MapPin} value={form.ville} onChange={e => setForm({ ...form, ville: e.target.value })} placeholder="Ville" />
            <div style={{ gridColumn: "1 / -1" }}>
              <InputField label="Description / Mission" icon={FileText} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Décrivez votre association..." multiline />
            </div>
          </div>
          <button onClick={handleSaveProfile} disabled={saving} style={{
            marginTop: 20, height: 44, padding: "0 28px",
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

    
  );
};
 
export default ProfileAssociation;