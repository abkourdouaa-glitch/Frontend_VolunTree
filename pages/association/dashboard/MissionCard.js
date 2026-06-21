
import { Calendar, MapPin } from "lucide-react";

const getAssociationPhotoUrl = (association) => {
  if (!association) return null;
  if (association.photo_profile) {
    return `https://backend-volun-tree.vercel.app/storage/${association.photo_profile}`;
  }
  return null;
};

const AssociationAvatar = ({ association }) => {
  const photoUrl = getAssociationPhotoUrl(association);
  const initial  = (association?.nom || "?")[0].toUpperCase();

  return (
    <div className="w-6 h-6 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center text-[10px] font-semibold text-emerald-700 shrink-0">
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

export const MissionCard = ({ mission, onSelect, isSelected }) => {
  return (
    <div
      onClick={() => onSelect(mission.id)}
      className={`p-5 mb-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer group ${
        isSelected
          ? "border-emerald-500 bg-emerald-50/50 shadow-sm"
          : "border-white bg-white hover:border-emerald-200 shadow-sm"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
          {mission.titre}
        </h3>
        <span
          className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
            mission.vols >= mission.n_benevoles
              ? "bg-amber-100 text-amber-700"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {mission.vols || 0}/{mission.n_benevoles} Places
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed italic">
        "{mission.description}"
      </p>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg">
            <Calendar size={14} className="text-emerald-500" />
            {mission.date}
          </div>
          <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg">
            <MapPin size={14} className="text-rose-500" />
            {mission.lieu}
          </div>
        </div>

        {/* Association avatar + nom */}
        {mission.association && (
          <div className="flex items-center gap-1.5">
            <AssociationAvatar association={mission.association} />
            <span className="text-[11px] text-slate-400 truncate max-w-[100px]">
              {mission.association.nom}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};