import React from 'react';
import { TriangleAlert, Leaf, Check, Edit3, RotateCcw } from 'lucide-react';
import { ROLE_AVATARS } from '../../data/images';

export const Screen12PatientHeader = ({ activePatient, onSaveEdits, onOpenRejectModal, onAcceptSummary }) => {
  if (!activePatient) return null;

  const patientAvatar = activePatient.gender === 'Female' ? ROLE_AVATARS.patientFemale1 : ROLE_AVATARS.patientMale1;

  return (
    <div className="p-4 border-b border-stone-800 bg-stone-950 flex items-center justify-between flex-wrap gap-3 text-stone-100">
      <div className="flex items-center gap-3">
        <img
          src={patientAvatar}
          alt={activePatient.name}
          className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shadow-md shrink-0"
        />
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-lg font-bold text-white">{activePatient.name}</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-stone-900 font-mono font-semibold text-stone-300 border border-stone-800">
              {activePatient.age}y / {activePatient.gender}
            </span>
            {activePatient.redFlag && (
              <span className="text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-800 flex items-center gap-1">
                <TriangleAlert className="w-3.5 h-3.5 text-rose-400" /> Triage Priority Alert
              </span>
            )}
            {activePatient.ayushMode && (
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800 flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" /> AYUSH Case
              </span>
            )}
          </div>
          <div className="text-xs text-stone-400 mt-1 flex items-center gap-3">
            <span>ABHA: <strong className="font-mono text-emerald-400">91-4821-9032-1102</strong></span>
            <span>Language: <strong className="text-stone-200">{activePatient.language || "en-IN"}</strong></span>
            <span>Token: <strong className="text-emerald-400 font-mono">{activePatient.token}</strong></span>
          </div>
        </div>
      </div>

      {/* Decision Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSaveEdits}
          className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-semibold rounded-xl border border-stone-800 transition flex items-center gap-1.5"
        >
          <Edit3 className="w-3.5 h-3.5 text-emerald-400" /> Edit & Save
        </button>
        <button
          onClick={onOpenRejectModal}
          className="px-3 py-1.5 bg-stone-900 hover:bg-rose-950/50 text-stone-300 hover:text-rose-300 text-xs font-semibold rounded-xl border border-stone-800 transition flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Re-interview
        </button>
        <button
          onClick={onAcceptSummary}
          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
        >
          <Check className="w-4 h-4" /> Accept Summary
        </button>
      </div>
    </div>
  );
};
