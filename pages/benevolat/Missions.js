import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Calendar, MapPin, Menu, X, Users } from "lucide-react";
import Sidebar from "./Sidebar";

const categories = {
  envirennement: { bg: "bg-emerald-50", text: "text-emerald-800", dot: "bg-emerald-500" },
  social:        { bg: "bg-violet-50",  text: "text-violet-800",  dot: "bg-violet-500"  },
  education:     { bg: "bg-blue-50",    text: "text-blue-800",    dot: "bg-blue-500"    },
  sante:         { bg: "bg-rose-50",    text: "text-rose-800",    dot: "bg-rose-500"    },
  culture:       { bg: "bg-amber-50",   text: "text-amber-800",   dot: "bg-amber-500"   },
};

const filters = ["Toutes", "envirennement", "social", "education", "sante", "culture"];

const ImagePlaceholder = ({ categorie }) => {
  const colors = {
    envirennement: { bg: "#E1F5EE", icon: "#0F6E56" },
    social:        { bg: "#EDE9FE", icon: "#7C3AED" },
    education:     { bg: "#EFF6FF", icon: "#1D4ED8" },
    sante:         { bg: "#FFF1F2", icon: "#BE123C" },
    culture:       { bg: "#FFFBEB", icon: "#B45309" },
  };
  const c = colors[categorie] || { bg: "#F3F4F6", icon: "#6B7280" };
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ background: c.bg }}>
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={c.icon} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
      <span style={{ fontSize: 11, color: c.icon, fontWeight: 500, opacity: 0.7 }}>Mission</span>
    </div>
  );
};


const getAssociationPhotoUrl = (association) => {
  if (!association) return null;
  if (association.photo_profile) {
    return `http://localhost:8000/storage/${association.photo_profile}`;
  }
  return null;
};


const AssociationAvatar = ({ association, size = "sm" }) => {
  const photoUrl = getAssociationPhotoUrl(association);
  const initial  = (association?.nom || "?")[0].toUpperCase();

  const sizes = {
    sm: { container: "w-6 h-6", text: "text-[10px]" },
    md: { container: "w-9 h-9", text: "text-sm"     },
  };
  const s = sizes[size];

  return (
    <div className={`${s.container} rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center font-semibold text-emerald-700 shrink-0 ${s.text}`}>
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={association?.nom || ""}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      <span style={{ display: photoUrl ? "none" : "flex" }}>{initial}</span>
    </div>
  );
};

//  Modal Detail
const DetailModal = ({ mission, onClose, onPostuler, applied }) => {
  const [showPostuler, setShowPostuler] = useState(false);
  const [message, setMessage]           = useState("");
  const [sending, setSending]           = useState(false);

  if (!mission) return null;

  const cat      = categories[mission.categorie] || categories["social"];
  const pct      = Math.min(Math.round(((mission.vols || 0) / mission.n_benevoles) * 100), 100);
  const hasImage = !!mission.image;

  const handlePostuler = async () => {
    setSending(true);
    await onPostuler(mission, message);
    setSending(false);
    setShowPostuler(false);
    setMessage("");
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center px-4"
      style={{ backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md flex flex-col overflow-hidden"
        style={{ maxHeight: "90vh", boxShadow: "0 25px 60px rgba(0,0,0,0.18)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Hero image / placeholder ── */}
        <div className="relative w-full shrink-0" style={{ height: 200 }}>
          {hasImage ? (
            <img
              src={`http://localhost:8000/storage/${mission.image}`}
              alt={mission.titre}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImagePlaceholder categorie={mission.categorie} />
          )}
          {hasImage && (
            <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.55))" }} />
          )}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cat.bg} ${cat.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
              {mission.categorie}
            </span>
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "rgba(0,0,0,0.35)", border: "0.5px solid rgba(255,255,255,0.3)" }}
          >
            <X size={14} color="white" />
          </button>
          {hasImage && (
            <div className="absolute bottom-3 left-4 right-4">
              <p className="text-white font-semibold text-base leading-snug">{mission.titre}</p>
            </div>
          )}
        </div>

        {/* ── Body scrollable ── */}
        <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-4">
          {!hasImage && (
            <h2 className="text-lg font-bold text-gray-900 leading-snug">{mission.titre}</h2>
          )}

          {/*  Association avec photo */}
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <AssociationAvatar association={mission.association} size="md" />
            <div>
              <p className="text-sm font-semibold text-gray-800">{mission.association?.nom || "Association"}</p>
              <p className="text-xs text-gray-400">Organisation bénévole</p>
            </div>
          </div>

          {/* Date + Lieu */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl px-3 py-2.5 border border-slate-100" style={{ background: "#f9fafb" }}>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Date</p>
              <div className="flex items-start gap-1.5">
                <Calendar size={12} className="text-gray-400 mt-0.5 shrink-0" />
                <p className="text-xs font-medium text-gray-800 leading-relaxed">{mission.date || "---"}</p>
              </div>
            </div>
            <div className="rounded-xl px-3 py-2.5 border border-slate-100" style={{ background: "#f9fafb" }}>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Lieu</p>
              <div className="flex items-start gap-1.5">
                <MapPin size={12} className="text-gray-400 mt-0.5 shrink-0" />
                <p className="text-xs font-medium text-gray-800 leading-relaxed break-words">{mission.lieu || "---"}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Description</p>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {mission.description || "Aucune description disponible."}
            </p>
          </div>

          {/* Bénévoles progress */}
          <div className="rounded-xl px-4 py-3 border" style={{ background: "#E1F5EE", borderColor: "#9FE1CB" }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Users size={13} style={{ color: "#0F6E56" }} />
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#0F6E56" }}>Bénévoles</p>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full" style={{ background: "#9FE1CB", color: "#085041" }}>
                {pct}% complet
              </span>
            </div>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-2xl font-bold" style={{ color: "#085041" }}>{mission.vols || 0}</span>
              <span className="text-sm" style={{ color: "#0F6E56" }}>/ {mission.n_benevoles} inscrits</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "#9FE1CB" }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: "#085041" }} />
            </div>
          </div>

          {/* Zone postuler */}
          {showPostuler && !applied && (
            <div className="rounded-xl border border-slate-200 p-4 flex flex-col gap-3" style={{ background: "#f9fafb" }}>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Votre message</p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Expliquez pourquoi vous souhaitez participer..."
                className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none resize-none"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowPostuler(false); setMessage(""); }}
                  className="flex-1 py-2 text-xs font-semibold text-gray-600 bg-white border border-slate-200 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={handlePostuler}
                  disabled={sending}
                  className="flex-[2] py-2 text-xs font-semibold text-white rounded-xl transition-all disabled:opacity-60"
                  style={{ background: "#085041" }}
                >
                  {sending ? "Envoi..." : "Confirmer ma candidature"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex gap-2.5 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 text-gray-600 hover:bg-gray-50 transition-all"
          >
            Fermer
          </button>
          {!showPostuler && (
            <button
              disabled={applied}
              onClick={() => !applied && setShowPostuler(true)}
              className={`flex-[2] py-2.5 rounded-xl text-xs font-semibold text-white transition-all active:scale-95 ${
                applied ? "bg-rose-500 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {applied ? "Déjà postulé" : "Postuler à cette mission"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Missions = () => {
  const [sidebarOpen, setSidebarOpen]           = useState(false);
  const [activeFilter, setActiveFilter]         = useState("Toutes");
  const [search, setSearch]                     = useState("");
  const [selectedMission, setSelectedMission]   = useState(null);
  const [detailMission, setDetailMission]       = useState(null);
  const [message, setMessage]                   = useState("");
  const [missions, setMissions]                 = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [userApplications, setUserApplications] = useState([]);

  const user        = JSON.parse(localStorage.getItem("user"));
  const BENEVOLE_ID = user?.id;

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const token = localStorage.getItem("token");
        // const response = await axios.get("http://localhost:8000/api/missions", {
        const response = await axios.get("http://localhost:8000/api/missions/actives", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMissions(response.data.sort((a, b) => b.id - a.id));
        console.log("image =", response.data[0]?.image)
        const resApps = await axios.get(`http://localhost:8000/api/candidatures/benevole/${BENEVOLE_ID}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserApplications(resApps.data);
        setLoading(false);
      } catch (error) {
        console.error("Erreur fetching missions:", error);
        setLoading(false);
      }
    };
    fetchMissions();
  }, []);


  const hasAlreadyApplied = (missionId) =>
    userApplications.some(app => app.mission_id === missionId);

  const handlePostuler = async (mission, msg) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8000/api/candidatures", 
        {
          mission_id:  mission.id,
          benevole_id: BENEVOLE_ID,
          message:     msg,
          statut:      "en_attente",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.status === 201 || response.status === 200) {
        setUserApplications([...userApplications, { mission_id: mission.id }]);
        setDetailMission(null);
        setSelectedMission(null);
        setMessage("");
        alert("Candidature envoyée avec succès !"); 
      }
    } catch (error) {
      console.error("Erreur lors de la postulation:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Erreur lors de l'envoi");
    }
  };


  const filtered = missions.filter((m) => {
    const matchCat    = activeFilter === "Toutes" || m.categorie?.toLowerCase() === activeFilter.toLowerCase();
    const matchSearch = m.titre.toLowerCase().includes(search.toLowerCase()) ||
        m.association.nom.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (loading) return (
    <div className="flex justify-center items-center h-screen text-emerald-600 font-bold">
      Chargement des missions...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex" style={{ fontFamily: "Inter, sans-serif" }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64 flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-gray-50 border-b border-slate-100 sticky top-0 z-20 px-6 py-3 flex items-center justify-between gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une mission..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>
          <div className="hidden md:flex items-center gap-2 flex-wrap">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  activeFilter === f
                    ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                    : "border-slate-200 text-gray-500 hover:border-slate-300 hover:text-gray-700"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        <main className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Tableau des Missions</h1>
            <p className="text-sm text-gray-500 mt-1">Trouvez l'opportunité qui vous correspond</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((mission) => {
              const applied = hasAlreadyApplied(mission.id);
              const cat     = categories[mission.categorie] || categories["social"];

              return (
                <div
                  key={mission.id}
                  className="bg-white rounded-xl border border-slate-100 flex flex-col hover:border-slate-200 hover:shadow-sm transition-all duration-200 overflow-hidden"
                >
                  {/* Image mission */}
                  <div className="w-full h-36 overflow-hidden shrink-0">
                    {mission.image ? (
                      <img
                        src={`http://localhost:8000/storage/${mission.image}`}
                        alt={mission.titre}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                      />
                    ) : null}
                    <div style={{ display: mission.image ? "none" : "flex", width: "100%", height: "100%" }}>
                      <ImagePlaceholder categorie={mission.categorie} />
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${cat.bg} ${cat.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                      {mission.categorie}
                    </span>

                    <div>
                      <h3 className="text-[15px] font-semibold text-gray-800 leading-snug mb-1.5">
                        {mission.titre}
                      </h3>
                      <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2">
                        {mission.description}
                      </p>
                    </div>

                    {/* Association avatar  */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <AssociationAvatar association={mission.association} size="sm" />
                      <span className="text-xs text-gray-500">
                        {mission.association?.nom || "Association Inconnue"}
                      </span>
                    </div>

                    <div className="mt-auto">
                      <div className="flex items-center gap-3 mb-3 text-[11.5px] text-gray-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {mission.date}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {mission.lieu}</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setDetailMission(mission)}
                          className="flex-1 py-2 text-xs font-semibold rounded-lg border border-slate-200 transition-all"
                          style={{ background: "#F1F5F9", color: "#475569" }}
                        >
                          Voir détail
                        </button>
                        <button
                          disabled={applied}
                          onClick={(e) => { e.preventDefault(); if (!applied) setSelectedMission(mission); }}
                          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-white ${
                            applied ? "bg-rose-500 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
                          }`}
                        >
                          {applied ? "Postulé" : "Postuler"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400 text-sm">
              Aucune mission ne correspond à votre recherche.
            </div>
          )}
        </main>

        {/* Modal Postuler simple */}
        {selectedMission && !detailMission && (
          <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center px-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 flex flex-col">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Postuler pour :</h3>
                <p className="text-emerald-600 font-semibold text-sm mb-4">{selectedMission.titre}</p>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Votre Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Expliquez brièvement pourquoi vous voulez participer..."
                  className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none h-32 resize-none"
                />
              </div>
              <div className="p-4 pt-0 flex gap-3">
                <button
                  onClick={() => { setSelectedMission(null); setMessage(""); }}
                  className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-white border border-slate-200 rounded-xl hover:bg-gray-50 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handlePostuler(selectedMission, message)}
                  className="flex-1 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Detail */}
        {detailMission && (
          <DetailModal
            mission={detailMission}
            onClose={() => setDetailMission(null)}
            onPostuler={handlePostuler}
            applied={hasAlreadyApplied(detailMission.id)}
          />
        )}
      </div>
    </div>
  );
};

export default Missions;