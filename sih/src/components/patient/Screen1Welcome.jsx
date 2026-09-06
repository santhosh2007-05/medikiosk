import React from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { getTranslation } from '../../data/translations';
import { MEDICAL_IMAGES } from '../../data/images';
import { motion } from 'framer-motion';
import { Sparkles, Check, ArrowRight, Mic } from 'lucide-react';

export const Screen1Welcome = () => {
  const { session, updateIdentity, setCurrentStep } = usePatientSession();
  const lang = session.identity.language || 'en-IN';

  const handleSelectLanguage = (langCode) => {
    updateIdentity({ language: langCode });
    // Speak welcome prompt in selected language
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const welcomeMsg = getTranslation("welcomeTitle", langCode) + ". " + getTranslation("welcomeSub", langCode);
      const msg = new SpeechSynthesisUtterance(welcomeMsg);
      msg.lang = langCode;
      window.speechSynthesis.speak(msg);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-kiosk-border rounded-2xl p-6 md:p-8 shadow-xs flex flex-col justify-between flex-1"
    >
      <div>
        <div className="text-center max-w-md mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kiosk-teal-light text-kiosk-teal text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Hospital Intake
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-kiosk-text">
            {getTranslation("welcomeTitle", lang)}
          </h1>
          <p className="text-sm text-kiosk-muted mt-1.5 leading-relaxed">
            {getTranslation("welcomeSub", lang)}
          </p>
        </div>

        {/* Clinical Imagery Banner */}
        <div className="max-w-lg mx-auto mb-6 rounded-xl overflow-hidden shadow-xs border border-stone-200">
          <img
            src={MEDICAL_IMAGES.hero}
            alt="Hospital Intake Kiosk"
            className="w-full h-36 object-cover"
          />
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-lg mx-auto">
          {[
            { code: 'en-IN', label: 'English', desc: 'Default National Standard' },
            { code: 'hi-IN', label: 'हिन्दी', desc: 'Hindi (North / Central)' },
            { code: 'ta-IN', label: 'தமிழ்', desc: 'Tamil (AIIA / Regional)' },
            { code: 'te-IN', label: 'తెలుగు', desc: 'Telugu (Regional)' }
          ].map(l => (
            <button
              key={l.code}
              onClick={() => handleSelectLanguage(l.code)}
              className={`p-4 rounded-xl border-2 flex items-center justify-between text-left transition active:scale-98 ${
                session.identity.language === l.code
                  ? 'border-kiosk-teal bg-kiosk-teal-light/40 shadow-xs'
                  : 'border-kiosk-border hover:border-kiosk-teal'
              }`}
            >
              <div>
                <div className="text-lg font-bold text-kiosk-text">{l.label}</div>
                <div className="text-xs text-kiosk-muted">{l.desc}</div>
              </div>
              {session.identity.language === l.code && (
                <Check className="w-5 h-5 text-kiosk-teal" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-6 text-center">
        <button
          onClick={() => setCurrentStep(2)}
          className="w-full max-w-md mx-auto py-4 px-6 bg-kiosk-teal hover:bg-kiosk-teal-hover text-white text-lg font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 active:scale-98"
        >
          {getTranslation("continue", lang)} <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-xs text-stone-400 mt-3 flex items-center justify-center gap-1.5">
          <Mic className="w-3.5 h-3.5" /> {getTranslation("voiceNote", lang)}
        </p>
      </div>
    </motion.section>
  );
};
