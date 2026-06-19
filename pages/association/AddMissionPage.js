import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Save, MapPin, Calendar, Users, Tag, AlignLeft, Image as ImageIcon } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import SideBar from "./SideBar";

const AddMissionPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(!!id); 
  // const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    date: "",
    lieu: "",
    n_benevoles: 10,
    categorie: "social"
  });

  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchMission = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8000/api/missions/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const m = response.data;
        setFormData({
          titre: m.titre || "",
          description: m.description || "",
          date: m.date || "",
          lieu: m.lieu || "",
          n_benevoles: m.n_benevoles || 10,
          categorie: m.categorie || "social"
        });
      } catch (err) {
        console.error("Erreur chargement mission:", err.response?.data);
        toast.error("Impossible de charger la mission.");
      } finally {
        setLoadingData(false)
      }
    };
    fetchMission();
  }, [id]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // loading(true);
    setLoading(true)

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id) {
      alert("Erreur: ID de l'association introuvable. Reconnectez-vous.");
      // loading(false);
      setLoading(false)
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append("titre", formData.titre);
    dataToSend.append("description", formData.description);
    dataToSend.append("n_benevoles", formData.n_benevoles);
    dataToSend.append("date", formData.date);
    dataToSend.append("lieu", formData.lieu);
    dataToSend.append("categorie", formData.categorie);
    dataToSend.append("association_id", user.id);

    if (imageFile) {
      dataToSend.append("image", imageFile);
    }

    try {
      if (id) {
        dataToSend.append("_method", "PUT");
        
        await axios.post(`http://localhost:8000/api/missions/${id}`, dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data" 
          }
        });
        toast.success("Mission modifiée avec succès !");
      } else {
        // Add — POST
        await axios.post("http://localhost:8000/api/missions", dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data" 
          }
        });
        toast.success("Mission enregistrée avec succès !");
      }
      navigate("/MesMissions");
    } catch (err) {
      console.error("Détails de l'erreur:", err.response?.data);
      const message = err.response?.data?.message || "Erreur de connexion au serveur";
      toast.error("Erreur: " + message);
    } finally {
      // loading(false);
      setLoading(false)
    }
  };

  if (loadingData) return (
    <div className="flex h-screen items-center justify-center text-emerald-600 font-bold animate-pulse">
      Chargement...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <SideBar isOpen={sidebarOpen} onToggleCollapse={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-20 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <h1 className="text-lg font-bold text-slate-800">
              {id ? "Modifier la mission" : "Créer une nouvelle mission"}
            </h1>
          </div>
        </header>

        <main className="p-8 max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8 space-y-6">
                
                {/* Titre */}
                <div>
                  <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    <Tag size={14} className="text-emerald-500" /> Titre de la mission
                  </label>
                  <input
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-slate-700 font-medium"
                    placeholder="Ex: Distribution de repas..."
                    value={formData.titre}
                    onChange={(e) => setFormData({...formData, titre: e.target.value})}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    <AlignLeft size={14} className="text-emerald-500" /> Description
                  </label>
                  <textarea
                    required
                    rows="4"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-slate-700"
                    placeholder="Décrivez les objectifs et le rôle des bénévoles..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>

                {/* Input dyal l-Image */}
                <div>
                  <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    <ImageIcon size={14} className="text-emerald-500" /> Image de la mission
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                </div>

                {/* Date + Lieu */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      <Calendar size={14} className="text-emerald-500" /> Date de l'événement
                    </label>
                    <input
                      required
                      type="date"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      <MapPin size={14} className="text-emerald-500" /> Lieu
                    </label>
                    <input
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                      placeholder="Ville, quartier..."
                      value={formData.lieu}
                      onChange={(e) => setFormData({...formData, lieu: e.target.value})}
                    />
                  </div>
                </div>

                {/* N bénévoles + Catégorie */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      <Users size={14} className="text-emerald-500" /> Nombre de bénévoles
                    </label>
                    <input
                      type="number"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all"
                      value={formData.n_benevoles}
                      onChange={(e) => setFormData({...formData, n_benevoles: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      <Tag size={14} className="text-emerald-500" /> Catégorie
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 transition-all appearance-none"
                      value={formData.categorie}
                      onChange={(e) => setFormData({...formData, categorie: e.target.value})}
                    >
                      <option value="social">Social</option>
                      <option value="education">Éducation</option>
                      <option value="sante">Santé</option>
                      <option value="envirennement">Environnement</option>
                      <option value="culture">Culture</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Annuler
                </button>
                <button
                  disabled={loading}
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? "Enregistrement..." : <><Save size={18} /> {id ? "Mettre à jour" : "Enregistrer la mission"}</>}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddMissionPage;