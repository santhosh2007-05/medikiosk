import React from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { getTranslation } from '../../data/translations';
import { ShieldCheck, Volume2, ArrowRight } from 'lucide-react';

export const Screen3Consent = () => {
  const { session, updateIdentity, setCurrentStep } = usePatientSession();
  const lang = session.identity.language || 'en-IN';

  const playAudioExplanation = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(getTranslation("consentText", lang));
      msg.lang = lang;
      window.speechSynthesis.speak(msg);
    }
  };

  const handleProceed = () => {
    if (!session.identity.consentGiven) return;
    setCurrentStep(4);
  };

  return (
    <section className="bg-white border border-kiosk-border rounded-2xl p-6 md:p-8 shadow-xs flex flex-col justify-between flex-1">
      <div>
        <div className="text-center max-w-md mx-auto mb-6">
          <div className="w-12 h-12 rounded-full bg-kiosk-teal-light text-kiosk-teal mx-auto flex items-center justify-center mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-kiosk-text">{getTranslation("consentTitle", lang)}</h2>
          <p className="text-xs text-kiosk-muted mt-1">{getTranslation("consentSub", lang)}</p>
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 max-w-xl mx-auto space-y-3">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-600">DPDP 2023</span>
            <button
              onClick={playAudioExplanation}
              className="flex items-center gap-1.5 text-xs text-kiosk-teal font-semibold bg-white px-2.5 py-1 rounded border border-kiosk-border hover:bg-stone-50 transition"
            >
              <Volume2 className="w-3.5 h-3.5" /> {getTranslation("playAudio", lang)}
            </button>
          </div>
          
          <p className="text-sm text-kiosk-text leading-relaxed">
            {getTranslation("consentText", lang)}
          </p>

          <ul className="text-xs text-stone-600 space-y-1.5 list-disc pl-4 pt-1">
            <li>Data is never sold or used for public AI training.</li>
            <li>Doctor retains 100% control to review, edit, or reject the clinical record.</li>
            <li>Session data cleared immediately on kiosk clearance.</li>
          </ul>
        </div>

        <div className="max-w-xl mx-auto mt-6">
          <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-stone-200 hover:border-kiosk-teal cursor-pointer transition">
            <input
              type="checkbox"
              checked={session.identity.consentGiven}
              onChange={(e) => updateIdentity({ consentGiven: e.target.checked })}
              className="mt-1 w-5 h-5 rounded text-kiosk-teal focus:ring-kiosk-teal border-stone-300"
            />
            <span className="text-sm font-medium text-kiosk-text">
              {getTranslation("consentAgree", lang)}
            </span>
          </label>
        </div>
      </div>

      <div className="pt-6 flex gap-3 max-w-xl mx-auto w-full">
        <button
          onClick={() => setCurrentStep(2)}
          className="w-1/3 py-3.5 px-4 rounded-xl border border-kiosk-border font-semibold text-stone-600 hover:bg-stone-50 transition text-sm"
        >
          {getTranslation("back", lang)}
        </button>
        <button
          onClick={handleProceed}
          disabled={!session.identity.consentGiven}
          className={`w-2/3 py-3.5 px-4 text-white font-bold rounded-xl transition shadow-xs text-base flex items-center justify-center gap-2 ${
            session.identity.consentGiven
              ? 'bg-kiosk-teal hover:bg-kiosk-teal-hover'
              : 'bg-stone-300 cursor-not-allowed'
          }`}
        >
          {getTranslation("agreeBegin", lang)} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
