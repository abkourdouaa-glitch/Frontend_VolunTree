import React from "react";
import { ApplicationCard } from "./ApplicationCard";
import axios from "axios";

export const ApplicationsSection = ({
  applications,
  allApplications,
  setAllApplications,
  selectedMissionId,
  isArchivedMission,
}) => {
  const handleAction = async (appId, newStatut) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://backend-volun-tree.vercel.app/api/candidatures/${appId}/statut`,
        { statut: newStatut },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAllApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, statut: newStatut } : app))
      );
    } catch (err) {
      alert("Erreur mise à jour");
    }
  };

  return (
    <div className="lg:col-span-1 space-y-6">
      <h2 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
        <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {isArchivedMission ? "Candidatures reçues" : "Candidatures Reçues"}
      </h2>

      <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar pb-6">
        {!selectedMissionId ? (
          <div className="text-center py-12 bg-emerald-50 rounded-xl border-2 border-dashed border-emerald-200">
            <svg className="w-16 h-16 mx-auto text-emerald-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-emerald-600 text-sm font-medium px-4">
              Sélectionnez une mission pour voir les candidatures
            </p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-emerald-100">
            <p className="text-emerald-500 text-sm">Aucune candidature pour cette mission</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {applications.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                onAction={handleAction}
                readOnly={isArchivedMission}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};