import React, { useEffect } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { getTranslation } from '../../data/translations';
import { Volume2 } from 'lucide-react';

const stepConfig = [
  { key: "welcomeTitle", subKey: "welcomeSub" },          // Step 1
  { key: "patientIdentity", subKey: "identitySub" },      // Step 2
  { key: "consentTitle", subKey: "consentSub" },          // Step 3
  { key: "chiefComplaintTitle", subKey: "chiefComplaintSub" }, // Step 4
  { key: "startInterview", subKey: null },               // Step 5 (SOCRATES handled in Screen5)
  { key: "ayushIntake", subKey: "ayushSub" },             // Step 6
  { key: "uploadDocsTitle", subKey: "uploadDocsSub" },    // Step 7
  { key: "timelineTitle", subKey: null },                 // Step 8
  { key: "reviewSummaryTitle", subKey: null },            // Step 9
  { key: "submittedTitle", subKey: "submittedSub" }       // Step 10
];

export const Stepper = () => {
  const { currentStep, session } = usePatientSession();
  const lang = session.identity.language || 'en-IN';

  const cfg = stepConfig[currentStep - 1] || stepConfig[0];
  const currentStepTitle = getTranslation(cfg.key, lang);
  const currentStepSub = cfg.subKey ? getTranslation(cfg.subKey, lang) : "";

  const getFullPromptText = () => {
    if (currentStepSub) {
      return `${currentStepTitle}. ${currentStepSub}`;
    }
    return currentStepTitle;
  };

  const speakPrompt = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = getFullPromptText();
      const msg = new SpeechSynthesisUtterance(textToSpeak);
      msg.lang = lang;
      msg.rate = 0.95;
      window.speechSynthesis.speak(msg);
    }
  };

  // Automatically trigger voice guidance on step transition & cancel previous speech
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Step 5 handles its own dynamic question-by-question voice guidance
      if (currentStep !== 5) {
        const textToSpeak = currentStepSub ? `${currentStepTitle}. ${currentStepSub}` : currentStepTitle;
        const msg = new SpeechSynthesisUtterance(textToSpeak);
        msg.lang = lang;
        msg.rate = 0.95;
        window.speechSynthesis.speak(msg);
      }
    }
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentStep, lang, currentStepTitle, currentStepSub]);

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

