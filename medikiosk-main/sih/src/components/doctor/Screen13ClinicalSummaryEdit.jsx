import React from 'react';
import { Info } from 'lucide-react';

export const Screen13ClinicalSummaryEdit = ({ activePatient, editableHpi, setEditableHpi, editableCc, setEditableCc }) => {
  if (!activePatient) return null;

  return (
    <div className="space-y-4 text-stone-100">
      <div className="flex items-center justify-between bg-stone-950 border border-stone-800 p-3 rounded-xl text-xs text-stone-300">
        <span className="flex items-center gap-2 font-medium">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" /> AI-synthesized clinical summary based on patient conversation & OCR documents. All fields are directly editable by doctor.
        </span>
        <span className="font-mono font-bold uppercase tracking-wider text-[10px] px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
          Status: {activePatient.status || 'Draft'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 text-xs">
        <div>
          <label className="block font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">Chief Complaint</label>
          <input
            type="text"
            value={editableCc}
            onChange={(e) => setEditableCc(e.target.value)}
            className="w-full p-3 text-sm rounded-xl bg-stone-950 border border-stone-800 text-white focus:ring-1 focus:ring-emerald-500 font-medium"
          />
        </div>

        <div>
          <label className="block font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">History of Present Illness (HPI - SOCRATES)</label>
          <textarea
            rows="4"
            value={editableHpi}
            onChange={(e) => setEditableHpi(e.target.value)}
            className="w-full p-3 text-sm rounded-xl bg-stone-950 border border-stone-800 text-white focus:ring-1 focus:ring-emerald-500 leading-relaxed font-mono"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">Past Medical History</label>
            <input type="text" defaultValue="Type 2 Diabetes Mellitus (HbA1c 7.4%)" className="w-full p-3 text-xs rounded-xl bg-stone-950 border border-stone-800 text-stone-200 focus:ring-1 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">Drug & Allergy History</label>
            <input type="text" defaultValue="Aspirin 75mg. No reported drug allergies." className="w-full p-3 text-xs rounded-xl bg-stone-950 border border-stone-800 text-stone-200 focus:ring-1 focus:ring-emerald-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">Family History</label>
            <input type="text" defaultValue="Brother had myocardial infarction at age 54" className="w-full p-3 text-xs rounded-xl bg-stone-950 border border-stone-800 text-stone-200" />
          </div>
          <div>
            <label className="block font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">Personal & Social History</label>
            <input type="text" defaultValue="Non-smoker, sedentary lifestyle" className="w-full p-3 text-xs rounded-xl bg-stone-950 border border-stone-800 text-stone-200" />
          </div>
        </div>
      </div>
    </div>
  );
};
