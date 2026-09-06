import React from 'react';
import { TriangleAlert, Leaf, Check, Edit3, RotateCcw } from 'lucide-react';
import { ROLE_AVATARS } from '../../data/images';

export const Screen12PatientHeader = ({ activePatient, onSaveEdits, onOpenRejectModal, onAcceptSummary }) => {
  if (!activePatient) return null;

  const patientAvatar = activePatient.gender === 'Female' ? ROLE_AVATARS.patientFemale1 : ROLE_AVATARS.patientMale1;

  return (
    <div className="p-4 border-b border-kiosk-border bg-stone-50/70 flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-3">
        <img
          src={patientAvatar}
          alt={activePatient.name}
          className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-600 shadow-sm shrink-0"
        />
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-lg font-bold text-kiosk-text">{activePatient.name}</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-stone-200 font-semibold text-stone-700">
              {activePatient.age}y / {activePatient.gender}
            </span>
            {activePatient.redFlag && (
              <span className="text-xs px-2 py-0.5 rounded bg-kiosk-alert-light text-kiosk-alert font-bold border border-kiosk-alert/30 flex items-center gap-1">
                <TriangleAlert className="w-3.5 h-3.5" /> Triage Priority Alert
              </span>
            )}
            {activePatient.ayushMode && (
              <span className="text-xs px-2 py-0.5 rounded bg-kiosk-ayush-light text-kiosk-ayush font-bold border border-kiosk-ayush/30 flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5" /> AYUSH Case
              </span>
            )}
          </div>
          <div className="text-xs text-stone-500 mt-1 flex items-center gap-3">
            <span>ABHA: <strong className="font-mono text-stone-700">91-4821-9032-1102</strong></span>
            <span>Language: <strong className="text-stone-700">{activePatient.language}</strong></span>
            <span>Token: <strong className="text-stone-700 font-mono">{activePatient.token}</strong></span>
          </div>
        </div>
      </div>

      {/* Decision Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSaveEdits}
          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg border border-stone-300 transition flex items-center gap-1"
        >
          <Edit3 className="w-3.5 h-3.5" /> Edit & Save
        </button>
        <button
          onClick={onOpenRejectModal}
          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg border border-stone-300 transition flex items-center gap-1"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reject / Re-interview
        </button>
        <button
          onClick={onAcceptSummary}
          className="px-4 py-1.5 bg-kiosk-teal hover:bg-kiosk-teal-hover text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1.5"
        >
          <Check className="w-4 h-4" /> Accept Summary
        </button>
      </div>
    </div>
  );
};
