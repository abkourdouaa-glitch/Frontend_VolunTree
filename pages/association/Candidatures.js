import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { X, Search, Menu } from "lucide-react";
import SideBar from "./SideBar";

const AVATAR_COLORS = [
  { bg: "bg-emerald-100", text: "text-emerald-800" },
  { bg: "bg-blue-100", text: "text-blue-800" },
  { bg: "bg-violet-100", text: "text-violet-800" },
  { bg: "bg-amber-100", text: "text-amber-800" },
  { bg: "bg-rose-100", text: "text-rose-800" },
  { bg: "bg-sky-100", text: "text-sky-800" },
];

const statusConfig = {
  en_attente: { pill: "bg-amber-100 text-amber-800", dot: "bg-amber-400", label: "En attente" },
  accepter:   { pill: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-500", label: "Accepté" },
  refuse:     { pill: "bg-rose-100 text-rose-800", dot: "bg-rose-500", label: "Refusé" },
};

function initials(name) {
  if (!name) return "??";
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

const StatusBadge = ({ status, isArchived }) => {
  if (isArchived) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
        Terminée
      </span>
    );
  }
  const cfg = statusConfig[status] || statusConfig.en_attente;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${cfg.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

const MotivationModal = ({ candidate, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
    <div className="bg-white rounded-xl border border-slate-100 w-full max-w-sm overflow-hidden">
      <div className="px-5 pt-4 pb-3 border-b border-slate-100 flex items-start justify-between">
        <div>
          <p className="text-[14px] font-semibold text-gray-900">Message de motivation</p>
          <p className="text-xs text-gray-400 mt-0.5">{candidate.benevole?.nom} · {candidate.mission?.titre}</p>
        </div>
        <button onClick={onClose} className="w-6 h-6 rounded-md border border-slate-200 flex items-center justify-center hover:bg-gray-100 transition-colors mt-0.5">
          <X className="w-3 h-3 text-gray-500" />
        </button>
      </div>
      <div className="p-5">
        <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 border border-slate-100 rounded-lg p-4">
          {candidate.message || "Aucun message fourni."}
        </p>
      </div>
      <div className="px-5 pb-4 flex justify-end">
        <button onClick={onClose} className="px-4 py-2 border border-slate-200 text-gray-500 text-sm rounded-lg hover:bg-gray-50 transition-colors">
          Fermer
        </button>
      </div>
    </div>
  </div>
);

const Candidatures = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMission, setFilterMission] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [modalCandidate, setModalCandidate] = useState(null);
  const [flash, setFlash] = useState({});
  const [showArchived, setShowArchived] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const ASSOCIATION_ID = user?.id;

  useEffect(() => {
    if (ASSOCIATION_ID) fetchCandidatures();
  }, [ASSOCIATION_ID]);

  const fetchCandidatures = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:8000/api/candidatures/association/${ASSOCIATION_ID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidatures(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Erreur fetching:", error);
      setLoading(false);
    }
  };

  const updateStatut = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:8000/api/candidatures/${id}/statut`, 
        { statut: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFlash(prev => ({ ...prev, [id]: newStatus }));
      setTimeout(() => setFlash(prev => { const n = { ...prev }; delete n[id]; return n; }), 600);

      setCandidatures(prev => prev.map(c =>
        c.id === id ? { ...c, statut: newStatus } : c
      ));
    } catch (error) {
      alert("Erreur lors de la mise à jour");
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 1. Separation strict des listes (Active vs Archive) selon la date de la mission
  const archivedList = useMemo(() => {
    return candidatures.filter(c => {
      const targetDate = c.mission?.date_limite || c.mission?.date;
      return targetDate && new Date(targetDate) < today;
    });
  }, [candidatures]);

  const activeList = useMemo(() => {
    return candidatures.filter(c => {
      const targetDate = c.mission?.date_limite || c.mission?.date;
      return !targetDate || new Date(targetDate) >= today;
    });
  }, [candidatures]);

  // Les statistiques restent basées sur les candidatures actives
  const counts = useMemo(() => ({
    total:    activeList.length,
    pending:  activeList.filter(c => c.statut === "en_attente").length,
    accepted: activeList.filter(c => c.statut === "accepter").length,
    rejected: activeList.filter(c => c.statut === "refuse").length,
  }), [activeList]);

  // Choisir la cible à filtrer selon l'onglet courant
  const targetSource = showArchived ? archivedList : activeList;

  const filtered = useMemo(() => {
    return targetSource.filter(c => {
      const matchMission = !filterMission || c.mission?.titre === filterMission;
      const matchStatus  = !filterStatus  || c.statut === filterStatus;
      const matchSearch  = !filterSearch  || (c.benevole && c.benevole.nom.toLowerCase().includes(filterSearch.toLowerCase()));
      return matchMission && matchStatus && matchSearch;
    });
  }, [targetSource, filterMission, filterStatus, filterSearch]);

  const MISSIONS = [...new Set(candidatures.map(c => c.mission?.titre).filter(Boolean))];

  if (loading) return <div className="p-10 text-center">Chargement...</div>;

  return (
    <div className="flex h-screen bg-[#f8fafc]" style={{ fontFamily: "Inter, sans-serif" }}>
      <SideBar isOpen={sidebarOpen} onToggleCollapse={() => setSidebarOpen(!sidebarOpen)} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
        
        {/* Header */}
        <header className="bg-white border-b border-emerald-100 px-8 py-4 z-10 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-[15px] font-semibold text-gray-900">
              {showArchived ? "Historique des candidatures terminées" : "Candidatures"}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {showArchived ? "Anciennes demandes reçues (Missions passées)" : "Gérez les demandes de bénévolat reçues"}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Bouton de basculement Archive unique */}
            <button
              onClick={() => { setShowArchived(!showArchived); setFilterStatus(""); setFilterMission(""); setFilterSearch(""); }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                showArchived
                  ? "text-white border-transparent bg-emerald-600 hover:bg-emerald-700"
                  : "bg-white text-gray-500 border-slate-200 hover:border-slate-300"
              }`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="21 8 21 21 3 21 3 8"/>
                <rect x="1" y="3" width="22" height="5"/>
                <line x1="10" y1="12" x2="14" y2="12"/>
              </svg>
              {showArchived ? "Voir les candidatures actives" : `Archivées (${archivedList.length})`}
            </button>
            {/* <span className="text-sm text-gray-500 hidden sm:block">{user?.nom || "Association"}</span> */}
          </div>
        </header>

        <main className="p-6 lg:p-8 flex-1 overflow-y-auto bg-[#f8fafc]">

          {/* Filter bar */}
          <div className="bg-white border mb-3 border-slate-100 rounded-xl p-4 flex items-end gap-4 flex-wrap">
            {[
              { label: "Mission", el: (
                <select value={filterMission} onChange={e => setFilterMission(e.target.value)}
                  className="text-sm bg-gray-50 border border-slate-200 rounded-lg px-3 py-2 outline-none w-48 text-gray-800">
                  <option value="">Toutes les missions</option>
                  {MISSIONS.map(m => <option key={m}>{m}</option>)}
                </select>
              )},
  
              ...(!showArchived ? [{ label: "Statut", el: (
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                  className="text-sm bg-gray-50 border border-slate-200 rounded-lg px-3 py-2 outline-none text-gray-800">
                  <option value="">Tous</option>
                  <option value="en_attente">En attente</option>
                  <option value="accepter">Accepté</option>
                  <option value="refuse">Refusé</option>
                </select>
              )}] : []),
              { label: "Rechercher", el: (
                <div className="flex items-center gap-2 bg-gray-50 border border-slate-200 rounded-lg px-3 py-2">
                  <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <input value={filterSearch} onChange={e => setFilterSearch(e.target.value)}
                    placeholder="Nom du bénévole..." className="bg-transparent text-sm outline-none w-36 placeholder:text-gray-400 text-gray-800" />
                </div>
              )},
            ].map(({ label, el }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <span className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
                {el}
              </div>
            ))}
            <button
              onClick={() => { setFilterMission(""); setFilterStatus(""); setFilterSearch(""); }}
              className="ml-auto self-end px-3 py-2 border border-slate-200 text-sm text-gray-500 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Réinitialiser
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 mb-3 sm:grid-cols-4 gap-4">
            {[
              { label: "Total actives",  value: counts.total,    color: ""               },
              { label: "En attente",    value: counts.pending,  color: "text-amber-600"   },
              { label: "Acceptés",     value: counts.accepted, color: "text-emerald-600" },
              { label: "Refusés",      value: counts.rejected, color: "text-rose-500"    },
            ].map(s => (
              <div key={s.label} className="bg-white border border-slate-100 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                <p className={`text-2xl font-semibold ${s.color || "text-gray-900"}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-800">
                {showArchived ? "Liste des demandes archivées" : "Liste des candidatures actives"}
              </span>
              <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full" style={{ tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: "22%" }} />
                  <col style={{ width: "21%" }} />
                  <col style={{ width: "11%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "23%" }} />
                </colgroup>
                <thead>
                  <tr className="bg-gray-50 border-b border-slate-100">
                    {["Bénévole","Mission","Postulé le","Statut","Lettre", showArchived ? "Fin Mission" : "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[10.5px] font-semibold text-gray-400 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map((d, i) => {
                    const ac = AVATAR_COLORS[i % AVATAR_COLORS.length];
                    const rowFlash = flash[d.id];
                    return (
                      <tr key={d.id} className="transition-colors"
                        style={{ background: rowFlash === "accepter" ? "#f0fdf4" : rowFlash === "refuse" ? "#fff1f2" : "" }}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {d.benevole?.photo_profile ? (
                              <img 
                                src={d.benevole.photo_profile.startsWith('http') ? d.benevole.photo_profile : `http://localhost:8000/storage/${d.benevole.photo_profile}`} 
                                alt={d.benevole?.nom} 
                                className="w-7 h-7 rounded-full object-cover flex-shrink-0 border border-slate-100"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}

                            <div 
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0 ${ac.bg} ${ac.text}`}
                              style={{ display: d.benevole?.photo_profile ? 'none' : 'flex' }}
                            >
                              {initials(d.benevole?.nom || "??")}
                            </div>

                            <div>
                              <p className="text-[12.5px] font-semibold text-gray-800 truncate">{d.benevole?.nom}</p>
                              <p className="text-[11px] text-gray-400 truncate">{d.benevole?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 truncate">{d.mission?.titre}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{new Date(d.created_at).toLocaleDateString()}</td>
                        
                        {/* Statut Badge :  "Terminée"  */}
                        <td className="px-4 py-3">
                          <StatusBadge status={d.statut} isArchived={showArchived} />
                        </td>
                        
                        <td className="px-4 py-3">
                          <button onClick={() => setModalCandidate(d)}
                            className="text-xs text-emerald-600 underline underline-offset-2 decoration-dotted hover:text-emerald-700 transition-colors">
                            Voir →
                          </button>
                        </td>

                        {/* RENDER CONDITIONNEL DES ACTIONS / DATE FIN */}
                        <td className="px-4 py-3">
                          {showArchived ? (
                            <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                              {d.mission?.date_limite || d.mission?.date
                                ? new Date(d.mission?.date_limite || d.mission?.date).toLocaleDateString()
                                : "---"}
                            </span>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              {d.statut === "accepter" ? (
                                <>
                                  <span className="px-2.5 py-1 rounded-md border border-slate-200 bg-gray-50 text-gray-400 text-[10px] font-bold">Accepté ✓</span>
                                  <button onClick={() => updateStatut(d.id, "refuse")}
                                    className="px-2.5 py-1 rounded-md border border-rose-200 bg-rose-50 text-rose-700 text-[10px] font-bold hover:bg-rose-100 transition-colors">
                                    Refusé
                                  </button>
                                </>
                              ) : d.statut === "refuse" ? (
                                <>
                                  <button onClick={() => updateStatut(d.id, "accepter")}
                                    className="px-2.5 py-1 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-800 text-[10px] font-bold hover:bg-emerald-100 transition-colors">
                                    Accepté
                                  </button>
                                  <span className="px-2.5 py-1 rounded-md border border-slate-200 bg-gray-50 text-gray-400 text-[10px] font-bold">Refusé ✗</span>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => updateStatut(d.id, "accepter")}
                                    className="px-2.5 py-1 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-800 text-[10px] font-bold hover:bg-emerald-100 transition-colors">
                                    Accepter
                                  </button>
                                  <button onClick={() => updateStatut(d.id, "refuse")}
                                    className="px-2.5 py-1 rounded-md border border-rose-200 bg-rose-50 text-rose-700 text-[10px] font-bold hover:bg-rose-100 transition-colors">
                                    Refusé
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-400">
                        Aucune candidature trouvée.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-3 bg-gray-50 border-t border-slate-100">
              <span className="text-xs text-gray-400">
                {filtered.length} candidature{filtered.length !== 1 ? "s" : ""} affichée{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </main>
      </div>

      {modalCandidate && (
        <MotivationModal candidate={modalCandidate} onClose={() => setModalCandidate(null)} />
      )}
    </div>
  );
};

export default Candidatures;










































