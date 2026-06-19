import React, { useState } from "react";
import { MissionCard } from "./MissionCard";
import axios from "axios";
import { Plus, LayoutGrid, Archive } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const MissionsSection = ({ missions, setMissions, onSelect, selectedId }) => {
  const [showArchived, setShowArchived] = useState(false);
  const navigate = useNavigate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeMissions = missions.filter((m) => {
    const d = m.date;
    if (!d) return true;
    const dt = new Date(d);
    dt.setHours(0, 0, 0, 0);
    return dt >= today;
  });

  const archivedMissions = missions.filter((m) => {
    const d = m.date;
    if (!d) return false;
    const dt = new Date(d);
    dt.setHours(0, 0, 0, 0);
    return dt < today;
  });

  const displayedMissions = showArchived ? archivedMissions : activeMissions;

  return (
    <div className="lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <LayoutGrid className="text-emerald-500" size={20} />
          {showArchived ? "Missions archivées" : "Mes Missions"}
          {showArchived && archivedMissions.length > 0 && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-50 text-purple-700">
              {archivedMissions.length}
            </span>
          )}
        </h2>

        <div className="flex items-center gap-2">
          {/* Bouton archivées */}
          <button
            onClick={() => setShowArchived((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all border ${
              showArchived
                ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-100"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
            }`}
          >
            <Archive size={15} />
            Archivées
            {archivedMissions.length > 0 && !showArchived && (
              <span className="ml-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {archivedMissions.length}
              </span>
            )}
          </button>

          {/* Bouton nouvelle mission — caché en mode archivées */}
          {!showArchived && (
            <button
              onClick={() => navigate("/add-mission")}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-100"
            >
              <Plus size={18} /> Nouvelle Mission
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {displayedMissions.length > 0 ? (
          displayedMissions.map((m) => (
            <MissionCard
              key={m.id}
              mission={m}
              isSelected={selectedId === m.id}
              onSelect={onSelect}
              isArchived={showArchived}
            />
          ))
        ) : (
          <div className="text-center p-10 bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
            {showArchived ? "Aucune mission archivée." : "Aucune mission pour le moment."}
          </div>
        )}
      </div>
    </div>
  );
};