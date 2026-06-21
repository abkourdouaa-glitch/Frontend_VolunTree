export const ApplicationCard = ({ app, onAction, readOnly = false }) => {
  return (
    <div className="bg-white border border-emerald-100 rounded-xl p-4 hover:shadow-md transition-shadow w-full">
      <div className="flex flex-col gap-4">
        {/* Avatar + Nom + Email */}
        <div className="flex gap-4 w-full">
          <div className="w-12 h-12 flex-shrink-0 rounded-full overflow-hidden shadow-sm">
            {app.benevole?.photo_profile ? (
              <img
                src={`https://backend-volun-tree.vercel.app/storage/${app.benevole.photo_profile}`}
                alt={app.benevole?.nom || ""}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="w-full h-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-bold text-lg"
              style={{ display: app.benevole?.photo_profile ? "none" : "flex" }}
            >
              {app.benevole?.nom?.charAt(0)?.toUpperCase() || "?"}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-emerald-900 truncate">{app.benevole?.nom}</h4>
            <div className="space-y-1 mt-1 text-sm text-emerald-600">
              <p className="flex items-center gap-2 truncate">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {app.benevole?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
          <p className="text-sm text-emerald-800">
            <span className="font-medium">Message:</span> {app.message || "—"}
          </p>
        </div>

        {/* Actions ou statut readonly */}
        <div className="flex flex-row gap-2 w-full pt-2 border-t border-emerald-50">
          {readOnly ? (
            <div className={`w-full px-4 py-2 rounded-lg text-sm font-medium text-center ${
              app.statut === "accepter"
                ? "bg-emerald-100 text-emerald-700"
                : app.statut === "refuse"
                ? "bg-red-100 text-red-700"
                : "bg-amber-100 text-amber-700"
            }`}>
              {app.statut === "accepter" ? "✓ Accepté" : app.statut === "refuse" ? "✗ Refusé" : "En attente"}
            </div>
          ) : app.statut === "en_attente" ? (
            <>
              <button
                onClick={() => onAction(app.id, "accepter")}
                className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all text-sm font-medium shadow-sm"
              >
                Accepter
              </button>
              <button
                onClick={() => onAction(app.id, "refuse")}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-medium shadow-sm"
              >
                Refuser
              </button>
            </>
          ) : (
            <div className={`w-full px-4 py-2 rounded-lg text-sm font-medium text-center ${
              app.statut === "accepter" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
            }`}>
              {app.statut === "accepter" ? "✓ Accepté" : "✗ Refusé"}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};