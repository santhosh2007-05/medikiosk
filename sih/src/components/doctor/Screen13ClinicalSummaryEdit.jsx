import React from 'react';
import { Info } from 'lucide-react';

export const Screen13ClinicalSummaryEdit = ({ activePatient, editableHpi, setEditableHpi, editableCc, setEditableCc }) => {
  if (!activePatient) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-xs text-amber-800">
        <span className="flex items-center gap-1.5 font-medium">
          <Info className="w-4 h-4" /> AI-synthesized clinical summary based on patient conversation & OCR documents. All fields are directly editable by doctor.
        </span>
        <span className="font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-amber-200">
          Status: {activePatient.status || 'Draft'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 text-xs">
        <div>
          <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">Chief Complaint</label>
          <input
            type="text"
            value={editableCc}
            onChange={(e) => setEditableCc(e.target.value)}
            className="w-full p-2.5 text-sm rounded-lg border border-stone-300 focus:ring-1 focus:ring-kiosk-teal font-medium"
          />
        </div>

        <div>
          <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">History of Present Illness (HPI - SOCRATES)</label>
          <textarea
            rows="4"
            value={editableHpi}
            onChange={(e) => setEditableHpi(e.target.value)}
            className="w-full p-2.5 text-sm rounded-lg border border-stone-300 focus:ring-1 focus:ring-kiosk-teal leading-relaxed font-mono"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">Past Medical History</label>
            <input type="text" defaultValue="Type 2 Diabetes Mellitus (HbA1c 7.4%)" className="w-full p-2.5 text-xs rounded-lg border border-stone-300 focus:ring-1 focus:ring-kiosk-teal" />
          </div>
          <div>
            <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">Drug & Allergy History</label>
            <input type="text" defaultValue="Aspirin 75mg. No reported drug allergies." className="w-full p-2.5 text-xs rounded-lg border border-stone-300 focus:ring-1 focus:ring-kiosk-teal" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">Family History</label>
            <input type="text" defaultValue="Brother had myocardial infarction at age 54" className="w-full p-2.5 text-xs rounded-lg border border-stone-300" />
          </div>
          <div>
            <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">Personal & Social History</label>
            <input type="text" defaultValue="Non-smoker, sedentary lifestyle" className="w-full p-2.5 text-xs rounded-lg border border-stone-300" />
          </div>
        </div>
      </div>
    </div>
  );
};
