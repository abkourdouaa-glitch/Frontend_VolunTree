import { useState, useEffect, useMemo } from "react";
import { Plus, Search, Eye, Pencil, Trash2, X, Menu } from "lucide-react";
import SideBar from "./SideBar";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const api = axios.create({ baseURL: 'https://backend-volun-tree.vercel.app/api' });

// Sub-component: Progress bar "les bénévoles"
const VolBar = ({ vols, cap }) => (
  <div className="flex items-center gap-2">
    <div className="w-10 h-1 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full ${vols >= cap ? "bg-orange-400" : "bg-orange-500"}`}
        style={{ width: `${Math.min((vols / cap) * 100, 100)}%` }}
      />
    </div>
    <span className="text-xs text-gray-400">{vols}/{cap}</span>
  </div>
);

// --- MAIN COMPONENT ---
const MesMissions = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteMission, setDeleteMission] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [viewMission, setViewMission] = useState(null);
  const navigate = useNavigate();

  const fetchMissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await api.get(`/missions/association/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMissions(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Erreur loading missions:", err.response?.data);
      setLoading(false);
    }
  };

  useEffect(() => { fetchMissions(); }, []);

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/missions/${deleteMission.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMissions();
      setDeleteMission(null);
    } catch (err) {
      console.error("Erreur suppression:", err.response?.data);
      alert("Impossible de supprimer la mission.");
    }
  };

  const filtered = useMemo(() => {
    return missions.filter(m =>
      (m.titre || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.lieu || "").toLowerCase().includes(search.toLowerCase())
    ).sort((a, b) => {
      // Tri par id décroissant
      return b.id - a.id;
    });
  }, [missions, search]);

  if (loading) return <div className="p-10 text-center font-semibold text-slate-500">Chargement de vos missions...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideBar isOpen={sidebarOpen} onToggleCollapse={() => setSidebarOpen(!sidebarOpen)} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
        <header className="bg-white border-b sticky top-0 z-20 px-6 py-4 flex items-center justify-between shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-[15px] font-semibold text-gray-900">Mes Missions</h1>
          <button
            onClick={() => navigate("/add-mission")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-semibold transition-all shadow-md active:scale-95"
          >
            <Plus size={18} /> Ajouter une mission
          </button>
        </header>

        <main className="p-6 space-y-6">
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden text-left">
            <div className="px-5 py-4 border-b flex justify-between items-center bg-gray-50/50">
              <span className="text-sm font-bold text-emerald-700">Liste des missions</span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Rechercher une mission..."
                  className="bg-white border rounded-lg pl-9 pr-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase border-b">
                  <tr>
                    <th className="px-5 py-3 text-left">Mission</th>
                    <th className="px-5 py-3 text-left">Date/Lieu</th>
                    <th className="px-5 py-3 text-left">Bénévoles</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {filtered.length > 0 ? (
                    filtered.map(m => (
                      <tr key={m.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-5 py-4 font-medium text-gray-800">{m.titre}</td>
                        <td className="px-5 py-4 text-gray-500 text-xs">
                          <span className="block">{m.date}</span>
                          <span className="text-gray-400">{m.lieu}</span>
                        </td>
                        <td className="px-5 py-4">
                          <VolBar vols={m.vols || 0} cap={m.n_benevoles} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => navigate(`/edit-mission/${m.id}`)}
                              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-all"
                            >
                              <Pencil size={15} />
                            </button>
                            <button onClick={() => setDeleteMission(m)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md transition-all">
                              <Trash2 size={15} />
                            </button>
                            <button onClick={() => setViewMission(m)} className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-md transition-all">
                              <Eye size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-10 text-gray-400 italic">Aucune mission trouvée.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {deleteMission && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full text-center shadow-xl">
            <h3 className="font-bold text-gray-900 mb-2">Supprimer la mission ?</h3>
            <p className="text-sm text-gray-500">Cette action est irréversible.</p>
            <div className="flex justify-center gap-3 mt-6">
              <button onClick={() => setDeleteMission(null)} className="px-4 py-2 border rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Annuler</button>
              <button onClick={handleConfirmDelete} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition-all shadow-md shadow-rose-100">Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {viewMission && <DetailModal mission={viewMission} onClose={() => setViewMission(null)} />}
    </div>
  );
};

const DetailModal = ({ mission, onClose }) => {
  const [expanded, setExpanded] = useState(false);

  if (!mission) return null;
  const pct = Math.round(((mission.vols || 0) / mission.n_benevoles) * 100);
  const hasImage = !!mission.image;
  const descLimit = 120;
  const isLong = (mission.description || "").length > descLimit;

  const isArchived = mission.date ? new Date(mission.date) < new Date().setHours(0,0,0,0) : false;

  return (
    <div className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center px-4" style={{backdropFilter: 'blur(4px)'}}>
      <div className="bg-white rounded-2xl w-full max-w-sm flex flex-col border border-gray-100 max-h-[90vh] overflow-hidden">

        {/* ── Hero : avec image ── */}
        {hasImage ? (
          <div className="relative w-full h-44 overflow-hidden bg-gray-100 shrink-0">
            <img
              src={`https://backend-volun-tree.vercel.app/storage/${mission.image}`}
              alt={mission.titre}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{background: 'linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.58) 100%)'}} />

            {/* Badges d'état dynamiques */}
            {isArchived ? (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium" style={{background:'#6B7280', color:'#F3F4F6'}}>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                Archivée
              </div>
            ) : (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium" style={{background:'#1D9E75', color:'#E1F5EE'}}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse" />
                Active
              </div>
            )}

            <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-white transition-colors"
              style={{background:'rgba(255,255,255,0.18)', border:'0.5px solid rgba(255,255,255,0.3)'}}
            >
              <X size={13} />
            </button>

            <div className="absolute bottom-3 left-3.5 right-3.5">
              <p className="text-white font-medium text-[15px] leading-snug">{mission.titre}</p>
              {mission.lieu && (
                <p className="text-white/70 text-[12px] mt-0.5">{mission.lieu}</p>
              )}
            </div>
          </div>

        ) : (
          /* ── Hero : sans image ── */
          <div className="relative shrink-0 overflow-hidden" style={{background: isArchived ? 'linear-gradient(135deg, #374151 0%, #6B7280 100%)' : 'linear-gradient(135deg, #085041 0%, #1D9E75 100%)'}}>
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 60% 80%, white 1px, transparent 1px)',
              backgroundSize: '60px 60px, 80px 80px, 40px 40px'
            }} />

            <div className="flex items-center justify-center pt-7 pb-2 relative z-10">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{background:'rgba(255,255,255,0.15)', border:'0.5px solid rgba(255,255,255,0.25)'}}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
            </div>

            {/* Badges d'état dynamiques */}
            {isArchived ? (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium" style={{background:'rgba(255,255,255,0.2)', color:'#F3F4F6', border:'0.5px solid rgba(255,255,255,0.3)'}}>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                Archivée
              </div>
            ) : (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium" style={{background:'rgba(255,255,255,0.18)', color:'#E1F5EE', border:'0.5px solid rgba(255,255,255,0.25)'}}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-200 animate-pulse" />
                Active
              </div>
            )}

            {/* <button
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-white transition-colors"
              style={{background:'rgba(255,255,255,0.18)', border:'0.5px solid rgba(255,255,255,0.25)'}}
            >
              <X size={13} />
            </button> */}

            <div className="relative z-10 px-4 pt-3 pb-5 text-center">
              <p className="text-white font-medium text-[15px] leading-snug">{mission.titre}</p>
              {mission.lieu && (
                <p className="text-white/65 text-[12px] mt-1">{mission.lieu}</p>
              )}
            </div>
          </div>
        )}

        {/* ── Body ── */}
        <div className="p-4 flex flex-col gap-3 overflow-y-auto flex-1">

          {/* Date + Lieu */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl px-3 py-2.5 border" style={{background:'#f9fafb', borderColor:'#e5e7eb'}}>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Date</p>
              <p className="text-xs font-medium text-gray-800">{mission.date || "---"}</p>
            </div>
            <div className="rounded-xl px-3 py-2.5 border" style={{background:'#f9fafb', borderColor:'#e5e7eb'}}>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Lieu</p>
              <p className="text-xs font-medium text-gray-800 truncate">{mission.lieu || "---"}</p>
            </div>
          </div>

          {/* Description avec expand/collapse */}
          <div className="rounded-xl px-3 py-2.5 border" style={{background:'#f9fafb', borderColor:'#e5e7eb'}}>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Description</p>
            <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-wrap">
              {isLong && !expanded
                ? mission.description.slice(0, descLimit) + "..."
                : (mission.description || "Aucune description disponible.")}
            </p>
            {isLong && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-1.5 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                style={{color:'#0F6E56'}}
              >
                {expanded ? (
                  <>
                    Voir moins
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15"/>
                    </svg>
                  </>
                ) : (
                  <>
                    Voir plus
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Bénévoles + progress bar */}
          <div className="rounded-xl px-4 py-3 border" style={{background:'#E1F5EE', borderColor:'#9FE1CB'}}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{color:'#0F6E56'}}>Bénévoles inscrits</p>
              <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full" style={{background:'#9FE1CB', color:'#085041'}}>
                {pct}% complet
              </span>
            </div>
            <div className="flex items-baseline gap-1 mb-2.5">
              <span className="text-2xl font-semibold" style={{color:'#085041'}}>{mission.vols || 0}</span>
              <span className="text-sm font-normal" style={{color:'#0F6E56'}}>/ {mission.n_benevoles} inscrits</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{background:'#9FE1CB'}}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{width: `${Math.min(pct, 100)}%`, background:'#085041'}}
              />
            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="px-4 py-3 border-t border-gray-100 flex gap-2.5 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-800 hover:bg-gray-50 transition-all active:scale-95"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};

export default MesMissions;