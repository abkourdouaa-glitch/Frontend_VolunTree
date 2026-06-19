import { useState, useEffect } from "react";
import axios from "axios";
import { MissionsSection } from "./MissionsSection";
import { ApplicationsSection } from "./ApplicationsSection";
import SideBar from "../SideBar";
import { LayoutGrid, Users, Archive, Menu } from "lucide-react";

const DashboardAssociation = () => {
  const [missions, setMissions]                   = useState([]);
  const [applications, setApplications]           = useState([]);
  const [selectedMissionForApps, setSelectedMissionForApps] = useState(null);
  const [isArchivedMission, setIsArchivedMission] = useState(false);
  const [sidebarOpen, setSidebarOpen]             = useState(true);
  const [userName, setUserName]                   = useState("Association");
  const [loading, setLoading]                     = useState(true);

  const user  = JSON.parse(localStorage.getItem("user") || "{}");
  const ASSOCIATION_ID = user?.id;

  useEffect(() => {
    setUserName(user.nom || user.name || "Association");

    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!ASSOCIATION_ID) { setLoading(false); return; }
      try {
        const res = await axios.get(
          `http://localhost:8000/api/missions/association/${ASSOCIATION_ID}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMissions(res.data.sort((a, b) => b.id - a.id));
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeMissions = missions.filter((m) => {
    const d = m.date;
    if (!d) return true;
    const dt = new Date(d); dt.setHours(0, 0, 0, 0);
    return dt >= today;
  });

  const archivedMissions = missions.filter((m) => {
    const d = m.date;
    if (!d) return false;
    const dt = new Date(d); dt.setHours(0, 0, 0, 0);
    return dt < today;
  });

  const stats = [
    { label: "Missions actives",  val: activeMissions.length,                                      icon: <LayoutGrid className="w-5 h-5" />, color: "bg-emerald-400 text-emerald-600" },
    { label: "Missions archivées", val: archivedMissions.length,                                   icon: <Archive className="w-5 h-5" />,    color: "bg-purple-400 text-purple-600"  },
    { label: "Bénévoles",          val: activeMissions.reduce((acc, m) => acc + (m.vols || 0), 0), icon: <Users className="w-5 h-5" />,     color: "bg-blue-400 text-blue-600"      },
  ];

  const handleSelectMission = async (missionId, archived = false) => {
    setSelectedMissionForApps(missionId);
    setIsArchivedMission(archived);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(
        `http://localhost:8000/api/candidatures/association/${ASSOCIATION_ID}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplications(res.data.filter((c) => c.mission_id === missionId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center text-emerald-600 font-bold animate-pulse">
      Chargement...
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <SideBar isOpen={sidebarOpen} onToggleCollapse={() => setSidebarOpen(!sidebarOpen)} />

      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b px-8 py-4 flex justify-between items-center">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Bienvenue {userName} 👋</h1>
            <p className="text-xs text-slate-500">Gérez vos missions et vos bénévoles</p>
          </div>
        </header>

        <main className="p-8 space-y-8 max-w-7xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-all">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                  <p className="text-3xl font-black text-slate-800 mt-1">{s.val}</p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${s.color} text-white shadow-lg`}>
                  {s.icon}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <MissionsSection
              missions={missions}
              setMissions={setMissions}
              selectedId={selectedMissionForApps}
              onSelect={handleSelectMission}
            />
            <div className="lg:col-span-1">
              <ApplicationsSection
                applications={applications}
                allApplications={applications}
                setAllApplications={setApplications}
                selectedMissionId={selectedMissionForApps}
                isArchivedMission={isArchivedMission}
              />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default DashboardAssociation;