import React from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { getTranslation } from '../../data/translations';
import { Volume2 } from 'lucide-react';

const stepKeys = [
  "welcomeTitle",
  "patientIdentity",
  "consentTitle",
  "chiefComplaintTitle",
  "siteQ",
  "ayushIntake",
  "uploadDocsTitle",
  "timelineTitle",
  "reviewSummaryTitle",
  "submittedTitle"
];

export const Stepper = () => {
  const { currentStep, session } = usePatientSession();
  const lang = session.identity.language || 'en-IN';

  const currentStepTitle = getTranslation(stepKeys[currentStep - 1] || "welcomeTitle", lang);

  const speakPrompt = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(currentStepTitle);
      msg.lang = lang;
      window.speechSynthesis.speak(msg);
    }
  };

  return (
    <div className="mb-6 bg-white border border-kiosk-border rounded-xl p-3 px-4 shadow-xs flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="w-7 h-7 rounded-full bg-kiosk-teal text-white flex items-center justify-center text-xs font-bold">
          {currentStep}
        </span>
        <div>
          <div className="text-sm font-semibold text-kiosk-text">
            {currentStepTitle}
          </div>
          <div className="text-[11px] text-kiosk-muted">
            Step {currentStep} of 10 • Touch & Voice Ready
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={speakPrompt}
          className="flex items-center gap-1.5 text-xs text-stone-600 hover:text-kiosk-teal bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-md transition"
        >
          <Volume2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Repeat Voice Prompt</span>
        </button>
      </div>
    </div>
  );
};
