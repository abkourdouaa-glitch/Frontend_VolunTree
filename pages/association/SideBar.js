import { useState, useEffect } from "react";
import { LogOut, LayoutDashboard, ListChecks, Heart, Users, ChevronLeft,BadgeCheck, ChevronRight, Menu } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const navItemsAssociation = [
  { name: "Tableau de bord",   icon: LayoutDashboard, href: "/dashboard-association" },
  { name: "Mes Missions",      icon: ListChecks,      href: "/MesMissions"           },
  { name: "Candidatures",      icon: Users,           href: "/candidatures"          },
  { name: "Profil Association", icon: BadgeCheck,       href: "/profile-association"   },
];

const SideBar = ({ isOpen, onToggleCollapse }) => {
  const [currentPath, setCurrentPath] = useState("");
  const [user, setUser]               = useState({});

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const handleLocationChange = () => setCurrentPath(window.location.pathname);
    handleLocationChange();
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const getDisplayName = () => user.name || user.nom || user.username || "Association";

  const handleLogout = async () => {
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
    if (!isConfirmed) return;
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post("https://backend-volun-tree.vercel.app/api/logout", {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.clear();
      toast.success("Déconnexion réussie");
      setTimeout(() => { window.location.href = "/#home"; }, 1000);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={onToggleCollapse} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 shadow-sm transition-all duration-300 flex flex-col
          ${isOpen ? "w-64 translate-x-0" : "w-20 lg:translate-x-0 -translate-x-full"}`}
      >
        <div className="h-full flex flex-col">

          {/* ── Logo + Nom ──*/}
          <div className={`border-b border-gray-100 transition-all duration-300 ${isOpen ? "px-5 py-3" : "px-0 py-4"}`}>
            {isOpen ? (
              <div className="flex items-center justify-between">
                <div>
                  {/* Logo VolunTree */}
                  <div className="flex items-center gap-3 my-3">
                    <span className="text-lg font-bold text-green-800 tracking-tight" style={{fontWeight: 900, fontSize: 25}}>VolunTree</span>
                  </div>
                </div>

                {/* Bouton collapse */}
                <button
                  onClick={onToggleCollapse}
                  className="mt-3 p-1.5 rounded-lg bg-gray-50 hover:bg-emerald-50 text-emerald-600 transition-colors self-start"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <button
                  onClick={onToggleCollapse}
                  className="p-1.5 rounded-lg bg-gray-50 hover:bg-emerald-50 text-emerald-600 transition-colors"
                >
                  <ChevronRight size={20} className="hidden lg:block" />
                  <Menu size={20} className="lg:hidden" />
                </button>
              </div>
            )}
          </div>

          {/* ── Navigation ── */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItemsAssociation.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setCurrentPath(item.href)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group no-underline font-medium ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                  } ${!isOpen ? "justify-center" : ""}`}
                  title={!isOpen ? item.name : ""}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-emerald-700" : "text-gray-500 group-hover:text-emerald-700"}`} />
                  {isOpen && <span className="whitespace-nowrap">{item.name}</span>}
                  {isOpen && isActive && (
                    <span className="ml-auto w-1.5 h-5 bg-emerald-500 rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* ── Logout ── */}
          <div className="p-3 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full px-3 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200 ${!isOpen ? "justify-center" : ""}`}
              title={!isOpen ? "Déconnexion" : ""}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="font-medium">Déconnexion</span>}
            </button>
          </div>

        </div>
      </aside>
    </>
  );
};

export default SideBar;