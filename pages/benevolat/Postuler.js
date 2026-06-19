import { useState } from "react";

const Postuler = () => {
    const [selectedMission, setSelectedMission] = useState(null);
    const [message, setMessage] = useState(""); 
return ( 
    <div>
    {/* Modal de Postulation */}
    {selectedMission && (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center px-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 flex flex-col">
        <div className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Postuler pour :</h3>
            <p className="text-emerald-600 font-semibold text-sm mb-4">{selectedMission.title}</p>
            
            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Votre Message</label>
            <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Expliquez brièvement pourquoi vous voulez participer..."
            className="w-full p-3 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 focus:outline-none h-32 resize-none"
            />
            <p className="text-[10px] text-gray-400 mt-2 italic">* Vos informations de profil seront envoyées automatiquement.</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-b-2xl flex gap-3">
            <button 
            onClick={() => { setSelectedMission(null); setMessage(""); }}
            className="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-slate-200 rounded-xl hover:bg-gray-100 transition-all"
            >
            Annuler
            </button>
            <button 
            onClick={() => {
                console.log("Mission ID:", selectedMission.id, "Message:", message);
                alert("Candidature envoyée avec succès !");
                setSelectedMission(null);
                setMessage("");
            }}
            className="flex-1 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all"
            >
            Confirmer
            </button>
        </div>
        </div>
    </div>
    )}
    </div>
    );
}
       
export default Postuler;   
         
        
        
        