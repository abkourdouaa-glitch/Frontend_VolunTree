import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Menu } from "lucide-react";
import Sidebar from "./Sidebar";

const statusConfig = {
  "en_attente": { pill: "bg-amber-100 text-amber-800",    dot: "bg-amber-400",   label: "En cours"  },
  "accepter":   { pill: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-500", label: "Acceptée"  },
  "refuse":     { pill: "bg-rose-100 text-rose-800",       dot: "bg-rose-500",    label: "Refusée"   },
};

const StatusBadge = ({ statut }) => {
  const config = statusConfig[statut] || statusConfig["en_attente"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

const DownloadPassBtn = ({ candidatureId }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `https://backend-volun-tree.vercel.app/api/candidatures/${candidatureId}/pass-pdf`,
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
      console.error("Status:", err.response?.status);
      console.error("Data:", err.response?.data);
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

const PAGE_SIZE = 7;

const Applications = () => {
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [search, setSearch]                 = useState("");
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading]               = useState(true);
  const [currentPage, setCurrentPage]       = useState(1);
  const [showArchived, setShowArchived]     = useState(false);

  const user      = JSON.parse(localStorage.getItem("user"));
  const BENEVOLE_ID = user?.id;

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`https://backend-volun-tree.vercel.app/api/candidatures/benevole/${BENEVOLE_ID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const sorted = res.data.sort((a, b) => b.id - a.id);
        setMyApplications(sorted);
      } catch (error) {
        console.error("Erreur fetching applications:", error);
      } finally {
        setLoading(false);
      }
    };
    if (BENEVOLE_ID) fetchApplications();
  }, [BENEVOLE_ID]);

  const today = new Date();

  // 1. Filtrage des missions archivées (Date passé)
  const archived = myApplications.filter((a) => {
    const date = a.mission?.date_limite || a.mission?.date;
    return date && new Date(date) < today;
  });

  // 2. Filtrage des postulations actives 
  const active = myApplications.filter((a) => {
    const date = a.mission?.date_limite || a.mission?.date;
    return !date || new Date(date) >= today;
  });


  const total    = active.length;
  const accepted = active.filter((a) => a.statut === "accepter").length;
  const pending  = active.filter((a) => a.statut === "en_attente").length;
  const rate     = total > 0 ? Math.round((accepted / total) * 100) : 0;

  const targetList = showArchived ? archived : active;

  const filtered = targetList.filter(
    (a) =>
      a.mission?.titre?.toLowerCase().includes(search.toLowerCase()) ||
      a.mission?.association?.nom?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  const handleSearch = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleToggleTabs = () => {
    setShowArchived((v) => !v);
    setCurrentPage(1);
    setSearch("");
  };

  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="min-h-screen bg-gray-100 flex" style={{ fontFamily: "Inter, sans-serif" }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:ml-64 flex-1 flex flex-col">

        {/* Topbar */}
        <header className="bg-white border-b border-slate-100 sticky top-0 z-20 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {showArchived ? "Historique des missions terminées" : "Suivi de mes candidatures"}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {showArchived ? "Consultez vos anciennes participations" : "Retrouvez l'état de toutes vos postulations actives"}
            </p>
          </div>

          {/* Bouton d'activation d'Archive unique */}
          <button
            onClick={handleToggleTabs}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showArchived
                ? "text-white border-transparent"
                : "bg-white text-gray-500 border-slate-200 hover:border-slate-300"
            }`}
            style={showArchived ? { background: "#085041" } : {}}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="21 8 21 21 3 21 3 8"/>
              <rect x="1" y="3" width="22" height="5"/>
              <line x1="10" y1="12" x2="14" y2="12"/>
            </svg>
            {showArchived ? "Voir les candidatures actives" : `Archivées (${archived.length})`}
          </button>
        </header>

        <main className="p-6 lg:p-8 flex flex-col gap-6">

          {/* Section d'affichage des Statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total postulations actives", value: total,    sub: "Missions en cours", color: "text-gray-900"    },
              { label: "Acceptées",                  value: accepted, sub: `${rate}% de réussite`,      color: "text-emerald-600" },
              { label: "En cours",                   value: pending,  sub: "En attente de réponse",     color: "text-amber-600"  },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-slate-100 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1.5">{s.label}</p>
                <p className={`text-2xl font-semibold ${s.color}`}>{loading ? "..." : s.value}</p>
                <p className={`text-xs mt-1 ${s.color}`}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* CONTENEUR DE RECHERCHE ET DE TABLEAU BLINDÉ */}
          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
            
            {/* Header commun du Tableau */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-gray-800">
                  {showArchived ? "Missions terminées (Archive)" : "Toutes les candidatures actives"}
                </h2>
                {showArchived && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
                    {filtered.length} archivée{filtered.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 bg-gray-50 border border-slate-200 rounded-lg px-3 py-2">
                <Search className="w-3.5 h-3.5 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="bg-transparent text-sm outline-none w-40 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* BLOCK EXCLUSIF: Affichage d'un seul tableau selon l'état showArchived */}
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
              {showArchived ? (
                  //  TABLEAU DE L'ARCHIVE 
                <table style={{ minWidth: "550px" }} className="w-full table-fixed">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[30%]">Mission</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[25%]">Association</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%]">Candidature</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[25%]">Date de fin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="text-center py-10 text-gray-400">Chargement...</td>
                      </tr>
                    ) : paginated.length > 0 ? (
                      paginated.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4 max-w-0">
                            <p className="truncate font-medium text-gray-800 text-sm">
                              {app.mission?.titre || "Mission sans titre"}
                            </p>
                          </td>
                          <td className="px-5 py-4 max-w-0">
                            <p className="truncate text-gray-500 text-sm">
                              {app.mission?.association?.nom || "Association"}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-gray-500 text-sm whitespace-nowrap">
                            {app.created_at ? new Date(app.created_at).toLocaleDateString("fr-FR") : "---"}
                          </td>
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                              Terminée le{" "}
                              {app.mission?.date_limite || app.mission?.date
                                ? new Date(app.mission?.date_limite || app.mission?.date).toLocaleDateString("fr-FR")
                                : "---"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-5 py-10 text-center text-sm text-gray-400">
                          Aucune mission archivée trouvée.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                  // TABLEAU PRINCIPAL 
                <table style={{ minWidth: "600px" }} className="w-full table-fixed">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[27%]">Mission</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[22%]">Association</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[16%]">Date</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[16%]">Statut</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[19%]">Pass Bénévolat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-10 text-gray-400">Chargement...</td>
                      </tr>
                    ) : paginated.length > 0 ? (
                      paginated.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4 max-w-0">
                            <p className="truncate font-medium text-gray-800 text-sm">
                              {app.mission?.titre || "Mission sans titre"}
                            </p>
                          </td>
                          <td className="px-5 py-4 max-w-0">
                            <p className="truncate text-gray-500 text-sm">
                              {app.mission?.association?.nom || "Association"}
                            </p>
                          </td>
                          <td className="px-5 py-4 text-gray-500 text-sm whitespace-nowrap">
                            {app.created_at ? new Date(app.created_at).toLocaleDateString("fr-FR") : "---"}
                          </td>
                          <td className="px-5 py-4">
                            <StatusBadge statut={app.statut} />
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
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">
                          Aucune candidature active trouvée.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Dynamique liée à l'onglet en cours */}
            <div className="px-5 py-3 border-t border-slate-100 bg-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {filtered.length} résultat{filtered.length !== 1 ? "s" : ""} — page {currentPage} / {totalPages}
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-7 h-7 rounded-md text-xs border border-slate-200 bg-white text-gray-500 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >‹</button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 rounded-md text-xs font-medium border transition-colors ${
                      p === currentPage
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-gray-500 border-slate-200 hover:border-slate-300"
                    }`}
                  >{p}</button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-7 h-7 rounded-md text-xs border border-slate-200 bg-white text-gray-500 hover:border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >›</button>
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Applications;