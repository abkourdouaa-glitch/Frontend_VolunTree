import { useState, useEffect } from "react";
import { LayoutDashboard, User, Compass, FileText, LogOut, Heart } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";


const navItems = [
  { name: "Tableau de bord",  icon: LayoutDashboard, href: "dashboard-benevole" },
  { name: "les Missions",     icon: Compass,         href: "missions"           },
  { name: "Mes Postulations", icon: FileText,        href: "applications"       },
  { name: "Mon Profil",       icon: User,            href: "profile-benevole"  },
];

const Sidebar = ({ isOpen, onClose }) => {
  const [currentPath, setCurrentPath] = useState("");
  const [user, setUser]               = useState({});

  // Chargement initial
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
  }, []);

  // Détection du path actif
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.hash || window.location.pathname.replace(/^\//, "");
      setCurrentPath(path);
    };
    handleLocationChange();
    window.addEventListener("popstate",   handleLocationChange);
    window.addEventListener("hashchange", handleLocationChange);
    return () => {
      window.removeEventListener("popstate",   handleLocationChange);
      window.removeEventListener("hashchange", handleLocationChange);
    };
  }, []);

  const getDisplayName = () => user.nom || "Utilisateur";

  const handleLogout = async () => {
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?");
    if (!isConfirmed) return;
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          "http://localhost:8000/api/logout",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
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
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 bg-white border-r border-gray-200 shadow-sm`}
      >
        <div className="h-full flex flex-col">

          {/* ── Logo + Nom ── */}
          <div className="px-5 py-2 border-b border-gray-100">
            {/* Logo VolunTree */}
            <div className="flex items-center gap-3 my-3">
              <span className="text-lg font-bold text-green-800 tracking-tight mt-3 ml-5" style={{fontWeight: 900, fontSize: 25}}>VolunTree</span>
            </div>
          </div>

          {/* ── Navigation ── */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive =
                currentPath === item.href || currentPath === `/${item.href}`;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setCurrentPath(item.href)}
                  style={{ textDecoration: "none" }}
                  className={`flex items-center justify-between px-3 py-3 rounded-lg transition-all duration-200 group font-medium ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${isActive ? "text-emerald-700" : "text-gray-500 group-hover:text-emerald-700"}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && (
                    <span className="w-1.5 h-5 bg-emerald-500 rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* ── Logout ── */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Déconnexion</span>
            </button>
          </div>

        </div>
      </aside>

      {/* Overlay mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-900/50 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;