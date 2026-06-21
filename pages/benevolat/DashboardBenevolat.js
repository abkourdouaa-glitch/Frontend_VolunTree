import { useState, useEffect } from "react";
import axios from "axios";
import { FileText, Clock, Award, TrendingUp, MapPin, Calendar, Menu } from "lucide-react";
import Sidebar from "./Sidebar";


const getAssociationPhotoUrl = (association) => {
  if (!association) return null;
  if (association.photo_profile) {
    return `http://localhost:8000/storage/${association.photo_profile}`;
  }
  return null;
};

const AssociationAvatar = ({ association }) => {
  const photoUrl = getAssociationPhotoUrl(association);
  const initial  = (association?.nom || "?")[0].toUpperCase();

  return (
    <div className="w-6 h-6 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center font-semibold text-emerald-700 shrink-0 text-[10px]">
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

const DownloadPassBtn = ({ candidatureId }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8000/api/candidatures/${candidatureId}/pass-pdf`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url  = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href  = url;
      link.setAttribute("download", `pass-benevole-${candidatureId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur téléchargement:", err);
      alert("Impossible de télécharger le pass.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all active:scale-95 disabled:opacity-60"
      style={{ background: "#085041" }}
    >
      {loading ? (
        <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
      )}
      {loading ? "..." : "Télécharger"}
    </button>
  );
};

const DashboardBenevolat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [message, setMessage] = useState("");
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myApplications, setMyApplications] = useState([]);
  const [userName, setUserName] = useState("Bénévole");
  const [benevolId, setBenevolId] = useState(null);

  // ─── Stats ───────────────────────────────────────────────────────────────────
  const stats = [
    {
      titre: "Missions Postulées",
      value: myApplications.length,
      icon: FileText,
      lightBg: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      titre: "Missions Acceptées",
      value: myApplications.filter((a) => a.statut === "accepter").length,
      icon: Clock,
      lightBg: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      titre: "En Attente",
      value: myApplications.filter((a) => a.statut === "en_attente").length,
      icon: Award,
      lightBg: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  // ─── Fetch data ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setLoading(false);
      return;
    }

    const user = JSON.parse(storedUser);
    const id = user?.id;

    setUserName(user?.nom || user?.name || "Bénévole");
    setBenevolId(id);

    if (!id) {
      console.error("BENEVOLE_ID introuvable:", user);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const resMissions = await axios.get("http://localhost:8000/api/missions/actives", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMissions(resMissions.data);
      } catch (error) {
        console.error("Erreur missions:", error.response?.data || error.message);
      }

      try {
        const resApps = await axios.get(`http://localhost:8000/api/candidatures/benevole/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyApplications(resApps.data);
      } catch (error) {
        console.error("Erreur candidatures:", error.response?.data || error.message);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  // ─── Postuler ─────────────────────────────────────────────────────────────────
  const handlePostuler = async () => {
    if (!message.trim()) {
      alert("Veuillez entrer un message !");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:8000/api/candidatures",
        {
          mission_id: selectedMission.id,
          benevole_id: benevolId,
          message: message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        const newCandidature = response.data.data || response.data;
        setMyApplications([...myApplications, newCandidature]);
        setSelectedMission(null);
        setMessage("");
        alert("Candidature envoyée avec succès !");
      }
    } catch (error) {
      console.error("Erreur postuler:", error.response?.data || error.message);
      const msg = error.response?.data?.message || "Erreur lors de l'envoi";
      alert(msg);
    }
  };

  // ─── Helpers Catégories ───────────────────────────────────────────────────────
  const categories = {
    envirennement: { bg: "bg-emerald-50", text: "text-emerald-800", dot: "bg-emerald-500" },
    social:        { bg: "bg-violet-50",  text: "text-violet-800",  dot: "bg-violet-500"  },
    education:     { bg: "bg-blue-50",    text: "text-blue-800",    dot: "bg-blue-500"    },
    sante:         { bg: "bg-rose-50",    text: "text-rose-800",    dot: "bg-rose-500"    },
    culture:       { bg: "bg-amber-50",   text: "text-amber-800",   dot: "bg-amber-500"   },
  };

  const getStatusBadge = (statut) => {
    const styles = {
      en_attente: "bg-yellow-100 text-yellow-700 border-yellow-200",
      accepter:   "bg-green-100 text-green-700 border-green-200",
      refuse:     "bg-red-100 text-red-700 border-red-200",
    };
    const labels = {
      en_attente: "En attente",
      accepter:   "Acceptée",
      refuse:     "Refusée",
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${styles[statut] || styles.en_attente}`}>
        {labels[statut] || statut}
      </span>
    );
  };

  // ─── Candidatures des missions encore actives  ──
  const today = new Date();
  const activeCandidatures = [...myApplications]
    .filter((a) => {
      const date = a.mission?.date_limite || a.mission?.date;
      return !date || new Date(date) >= today;
    })
    .sort((a, b) => b.id - a.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "Inter, sans-serif" }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Bienvenue {userName} 👋</h1>
                <p className="text-sm text-gray-500 mt-1">Voici votre tableau de bord bénévole</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.titre}</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {loading ? "..." : stat.value}
                    </p>
                  </div>
                  <div className={`${stat.lightBg} p-3 rounded-lg`}>
                    <stat.icon className={`w-8 h-8 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Missions Disponibles */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Missions Disponibles</h2>
              <a href="/missions" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1">
                Voir tout <TrendingUp className="w-4 h-4" />
              </a>
            </div>

            {loading ? (
              <p className="text-center text-gray-400 py-10">Chargement...</p>
            ) : missions.length === 0 ? (
              <p className="text-center text-gray-400 py-10 italic">Aucune mission disponible.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {missions.slice().reverse().slice(0, 4).map((mission) => {
                  const hasApplied = myApplications.some((app) => app.mission_id === mission.id);
                  const catKey = mission.categorie?.toLowerCase() || "social";
                  const cat = categories[catKey] || { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };

                  return (
                    <div key={mission.id} className="bg-white rounded-xl border border-slate-100 flex flex-col hover:shadow-sm transition-all overflow-hidden">
                      {/* Image zone */}
                      <div className="w-full h-32 overflow-hidden shrink-0">
                        {mission.image ? (
                          <img
                            src={`http://localhost:8000/storage/${mission.image}`}
                            alt={mission.titre}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextSibling.style.display = "flex";
                            }}
                          />
                        ) : null}
                        <div
                          style={{
                            display: mission.image ? "none" : "flex",
                            width: "100%",
                            height: "100%",
                            background:
                              mission.categorie === "envirennement" ? "#E1F5EE"
                            : mission.categorie === "social"        ? "#EDE9FE"
                            : mission.categorie === "education"     ? "#EFF6FF"
                            : mission.categorie === "sante"         ? "#FFF1F2"
                            : mission.categorie === "culture"       ? "#FFFBEB"
                            : "#F3F4F6",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <svg
                            width="32" height="32" viewBox="0 0 24 24" fill="none"
                            stroke={
                              mission.categorie === "envirennement" ? "#0F6E56"
                            : mission.categorie === "social"        ? "#7C3AED"
                            : mission.categorie === "education"     ? "#1D4ED8"
                            : mission.categorie === "sante"         ? "#BE123C"
                            : mission.categorie === "culture"       ? "#B45309"
                            : "#6B7280"
                            }
                            strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                          </svg>
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 500,
                              opacity: 0.6,
                              color:
                                mission.categorie === "envirennement" ? "#0F6E56"
                              : mission.categorie === "social"        ? "#7C3AED"
                              : mission.categorie === "education"     ? "#1D4ED8"
                              : mission.categorie === "sante"         ? "#BE123C"
                              : mission.categorie === "culture"       ? "#B45309"
                              : "#6B7280",
                            }}
                          >
                            Mission
                          </span>
                        </div>
                      </div>

                      {/* Card body */}
                      <div className="p-4 flex flex-col gap-3 flex-1">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${cat.bg} ${cat.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                          {mission.categorie}
                        </span>

                        <div>
                          <h3 className="text-[15px] font-semibold text-gray-800 leading-snug mb-1.5 line-clamp-1">
                            {mission.titre}
                          </h3>
                          <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-2">
                            {mission.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <AssociationAvatar association={mission.association} />
                          <span className="text-xs text-gray-500 truncate">
                            {mission.association?.nom || "Association Inconnue"}
                          </span>
                        </div>

                        <div className="mt-auto">
                          <div className="flex items-center gap-3 mb-3 text-[11.5px] text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" /> {mission.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" /> {mission.lieu}
                            </span>
                          </div>
                          <button
                            disabled={hasApplied}
                            onClick={() => !hasApplied && setSelectedMission(mission)}
                            className={`w-full py-2 text-xs font-semibold text-white rounded-lg transition-all ${
                              hasApplied
                                ? "bg-rose-500 cursor-not-allowed"
                                : "bg-emerald-600 hover:bg-emerald-700"
                            }`}
                          >
                            {hasApplied ? "Déjà postulé" : "Postuler"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Suivi Candidatures */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">Suivi de mes Candidatures</h2>
              <a href="/applications" className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1">
                Voir tout <TrendingUp className="w-4 h-4" />
              </a>
            </div>
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              <table style={{ minWidth: "600px" }} className="w-full table-fixed">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[28%]">Mission</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[22%]">Association</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%]">Date</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[16%]">Statut</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[19%]">Pass Bénévolat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeCandidatures.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-10 text-gray-400 italic">
                        Aucune candidature active pour le moment.
                      </td>
                    </tr>
                  ) : (
                    activeCandidatures.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 max-w-0">
                          <p className="truncate font-medium text-gray-800 text-sm">
                            {app.mission?.titre || "Mission sans titre"}
                          </p>
                        </td>
                        <td className="px-5 py-4 max-w-0">
                          <div className="flex items-center gap-2">
                            <AssociationAvatar association={app.mission?.association} />
                            <p className="truncate text-gray-500 text-sm">
                              {app.mission?.association?.nom || "Association"}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-500 text-sm whitespace-nowrap">
                          {app.created_at ? new Date(app.created_at).toLocaleDateString("fr-FR") : "---"}
                        </td>
                        <td className="px-5 py-4">
                          {getStatusBadge(app.statut)}
                        </td>
                        <td className="px-5 py-4">
                          {app.statut === "accepter" ? (
                            <DownloadPassBtn candidatureId={app.id} />
                          ) : (
                            <span className="text-gray-300 text-sm">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Postulation */}
      {selectedMission && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center px-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6 flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Postuler pour :</h3>
            <p className="text-emerald-600 font-semibold text-sm mb-4">{selectedMission.titre}</p>

            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Votre Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Expliquez brièvement pourquoi..."
              className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 h-32 resize-none"
            />

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => { setSelectedMission(null); setMessage(""); }}
                className="flex-1 py-2 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handlePostuler}
                className="flex-1 py-2 text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-all"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardBenevolat;