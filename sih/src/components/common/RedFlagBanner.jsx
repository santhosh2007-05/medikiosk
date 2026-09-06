import React from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { TriangleAlert } from 'lucide-react';

export const RedFlagBanner = () => {
  const { session, updateHistory } = usePatientSession();

  if (!session.conversationalHistory.redFlag) return null;

  return (
    <div className="bg-kiosk-alert text-white py-3 px-4 shadow-md transition-all">
      <div className="w-full px-4 sm:px-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg animate-pulse">
            <TriangleAlert className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold uppercase tracking-wider text-xs bg-white/20 px-2 py-0.5 rounded mr-2">
              Triage Alert: High Priority
            </span>
            <span className="text-sm font-medium">
              Critical symptoms detected: <strong>{session.conversationalHistory.redFlagTriggers.join(', ')}</strong>. Fast-track OPD priority alert active.
            </span>
          </div>
        </div>
        <button
          onClick={() => updateHistory({ redFlag: false })}
          className="text-xs bg-white text-kiosk-alert font-bold px-3 py-1.5 rounded hover:bg-stone-100 transition shadow-xs"
        >
          Acknowledge Notice
        </button>
      </div>
    </div>
  );
};
