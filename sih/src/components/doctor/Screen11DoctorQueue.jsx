import React, { useState } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { ROLE_AVATARS } from '../../data/images';
import { Search, AlertTriangle, Leaf } from 'lucide-react';

export const Screen11DoctorQueue = ({ activePatientToken, onSelectPatient }) => {
  const { doctorQueue } = usePatientSession();
  const [searchTerm, setSearchTerm] = useState("");

  const safeQueue = Array.isArray(doctorQueue) ? doctorQueue : [];

  const filteredQueue = safeQueue.filter(p => {
    if (!p) return false;
    const nameStr = (p.name || "").toLowerCase();
    const tokenStr = (p.token || "").toLowerCase();
    const termStr = (searchTerm || "").toLowerCase();
    return nameStr.includes(termStr) || tokenStr.includes(termStr);
  });

  return (
    <div className="bg-white border border-kiosk-border rounded-xl p-3.5 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm text-kiosk-text">Patient Queue</h3>
          <span className="text-xs font-bold px-2 py-0.5 bg-kiosk-teal-light text-kiosk-teal rounded-full">
            {filteredQueue.length}
          </span>
        </div>
        <span className="text-[11px] text-stone-400">Sorted by Triage Priority</span>
      </div>

      {/* Queue Search Input */}
      <div className="relative mb-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search patient name, ABHA..."
          className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-stone-200 focus:outline-none focus:ring-1 focus:ring-kiosk-teal"
        />
        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
      </div>

      {/* Queue Cards */}
      <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
        {filteredQueue.map((patient) => {
          const isSelected = patient.token === activePatientToken;
          const avatarUrl = patient.gender === 'Female' ? ROLE_AVATARS.patientFemale1 : ROLE_AVATARS.patientMale1;
          return (
            <div
              key={patient.token || Math.random()}
              onClick={() => onSelectPatient(patient)}
              className={`p-3 rounded-xl border transition cursor-pointer ${
                isSelected
                  ? 'border-kiosk-teal bg-kiosk-teal-light/40 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <img
                    src={avatarUrl}
                    alt={patient.name}
                    className="w-9 h-9 rounded-lg object-cover border border-emerald-600 shrink-0"
                  />
                  <div>
                    <div className="font-bold text-sm text-kiosk-text flex items-center gap-1.5 flex-wrap">
                      {patient.name || "Anonymous Patient"}
                      {patient.redFlag && (
                        <span className="text-[10px] bg-kiosk-alert-light text-kiosk-alert px-1.5 py-0.2 rounded font-bold border border-kiosk-alert/20 flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3 text-red-600" /> PRIORITY
                        </span>
                      )}
                      {patient.ayushMode && (
                        <span className="text-[10px] bg-kiosk-ayush-light text-kiosk-ayush px-1.5 py-0.2 rounded font-bold flex items-center gap-0.5">
                          <Leaf className="w-3 h-3 text-emerald-600" /> AYUSH
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-500 mt-0.5">
                      {patient.age || "45"}y / {patient.gender || "Male"} • Token: <strong className="font-mono text-stone-700">{patient.token}</strong>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-stone-400 font-mono shrink-0">{patient.waitingTime || "Just now"}</span>
              </div>

              <div className="mt-2 text-xs text-stone-600 line-clamp-1 bg-stone-50 p-1.5 rounded border border-stone-100">
                <span className="font-semibold text-stone-700">Complaint:</span> {patient.chiefComplaint || "Intake consultation"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
