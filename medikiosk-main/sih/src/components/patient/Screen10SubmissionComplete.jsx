import React from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { getTranslation } from '../../data/translations';
import { CheckCircle2, Stethoscope, RotateCcw } from 'lucide-react';

export const Screen10SubmissionComplete = () => {
  const { session, setViewMode, resetSession } = usePatientSession();
  const lang = session.identity.language || 'en-IN';

  return (
    <section className="bg-white border border-kiosk-border rounded-2xl p-8 md:p-12 shadow-xs text-center flex flex-col justify-between flex-1">
      <div className="max-w-md mx-auto my-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center text-3xl">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-kiosk-text">{getTranslation("submittedTitle", lang)}</h2>
        <p className="text-sm text-kiosk-muted">
          {getTranslation("submittedSub", lang)}
        </p>

        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-left space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-stone-500">{getTranslation("tokenId", lang)}:</span>
            <span className="font-bold text-kiosk-text font-mono">{session.identity.token}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">{getTranslation("fullName", lang)}:</span>
            <span className="font-bold text-kiosk-text">{session.identity.name || "Patient"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">{getTranslation("privacyStatus", lang)}:</span>
            <span className="text-emerald-700 font-semibold">{getTranslation("sessionCleared", lang)}</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <button
            onClick={() => setViewMode('doctor')}
            className="w-full py-3.5 px-4 bg-kiosk-teal hover:bg-kiosk-teal-hover text-white font-bold rounded-xl transition shadow-xs text-sm flex items-center justify-center gap-2"
          >
            <Stethoscope className="w-4 h-4" /> {getTranslation("switchToDoctor", lang)}
          </button>
          <button
            onClick={resetSession}
            className="w-full py-3 px-4 rounded-xl border border-stone-300 font-semibold text-stone-600 hover:bg-stone-100 transition text-xs flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> {getTranslation("startNextSession", lang)}
          </button>
        </div>
      </div>
    </section>
  );
};
