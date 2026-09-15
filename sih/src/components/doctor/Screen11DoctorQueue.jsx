import React, { useState } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { ROLE_AVATARS } from '../../data/images';
import { getPatientRiskMetrics } from '../../services/aiSummarizer';
import { Search, Leaf } from 'lucide-react';

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
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-md text-stone-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm text-white">Patient Queue</h3>
          <span className="text-xs font-mono font-bold px-2 py-0.5 bg-emerald-950 text-emerald-300 rounded-full border border-emerald-800">
            {filteredQueue.length}
          </span>
        </div>
        <span className="text-[11px] text-stone-400 font-mono">AI Triage Stratification</span>
      </div>

      {/* Queue Search Input */}
      <div className="relative mb-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search patient name, ABHA..."
          className="w-full text-xs pl-8 pr-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-white placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
        />
        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
      </div>

      {/* Queue Cards */}
      <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
        {filteredQueue.map((patient) => {
          const isSelected = patient.token === activePatientToken;
          const avatarUrl = patient.gender === 'Female' ? ROLE_AVATARS.patientFemale1 : ROLE_AVATARS.patientMale1;
          const risk = getPatientRiskMetrics(patient);
          const isHighRisk = risk.riskLevel === 'HIGH';

          return (
            <div
              key={patient.token || Math.random()}
              onClick={() => onSelectPatient(patient)}
              className={`p-3 rounded-xl border transition cursor-pointer ${
                isSelected
                  ? (isHighRisk ? 'border-rose-500 bg-rose-950/40 shadow-lg shadow-rose-500/20' : 'border-emerald-500 bg-emerald-950/60 shadow-md shadow-emerald-500/10')
                  : (isHighRisk ? 'border-rose-800/80 hover:border-rose-600 bg-stone-950 relative overflow-hidden' : 'border-stone-800 hover:border-stone-700 bg-stone-950')
              }`}
            >
              {isHighRisk && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-rose-600 animate-pulse" />
              )}

              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <img
                    src={avatarUrl}
                    alt={patient.name}
                    className={`w-9 h-9 rounded-lg object-cover border shrink-0 ${isHighRisk ? 'border-rose-500' : 'border-emerald-500'}`}
                  />
                  <div>
                    <div className="font-bold text-sm text-white flex items-center gap-1.5 flex-wrap">
                      {patient.name || "Anonymous Patient"}
                      {patient.ayushMode && (
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded font-bold border border-emerald-800 flex items-center gap-0.5">
                          <Leaf className="w-3 h-3 text-emerald-400" /> AYUSH
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5">
                      {patient.age || "45"}y / {patient.gender || "Male"} • Token: <strong className="font-mono text-emerald-400">{patient.token}</strong>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-stone-500 font-mono shrink-0">{patient.waitingTime || "Just now"}</span>
              </div>

              {/* AI RISK LEVEL BADGE */}
              <div className="mt-2 flex items-center justify-between gap-1 flex-wrap">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border inline-flex items-center gap-1.5 ${
                  risk.riskLevel === 'HIGH'
                    ? 'bg-rose-950 text-rose-300 border-rose-700 shadow-xs font-extrabold'
                    : (risk.riskLevel === 'MODERATE'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-800')
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    risk.riskLevel === 'HIGH' ? 'bg-rose-400 animate-ping' : (risk.riskLevel === 'MODERATE' ? 'bg-amber-400' : 'bg-emerald-400')
                  }`} />
                  {risk.badgeText}
                </span>

                <span className="text-[10px] text-stone-400 font-mono">
                  {risk.triagePriority}
                </span>
              </div>

              <div className="mt-2 text-xs text-stone-300 line-clamp-1 bg-stone-900 p-1.5 rounded border border-stone-800">
                <span className="font-semibold text-emerald-400">Complaint:</span> {patient.chiefComplaint || "Intake consultation"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

