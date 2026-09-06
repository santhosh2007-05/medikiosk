import React, { useState } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { getTranslation } from '../../data/translations';
import { motion } from 'framer-motion';
import { Activity, Thermometer, Stethoscope, Mic, ArrowRight, Volume2 } from 'lucide-react';

export const Screen4ChiefComplaint = () => {
  const { session, updateHistory, setCurrentStep } = usePatientSession();
  const lang = session.identity.language || 'en-IN';
  const [listening, setListening] = useState(false);
  const [customText, setCustomText] = useState("");

  const playVoicePrompt = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const promptText = getTranslation("chiefComplaintTitle", lang) + " " + getTranslation("chiefComplaintSub", lang);
      const msg = new SpeechSynthesisUtterance(promptText);
      msg.lang = lang;
      window.speechSynthesis.speak(msg);
    }
  };

  const handleSelectComplaint = (complaintStr) => {
    updateHistory({ chiefComplaint: complaintStr });
    setCurrentStep(5);
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Browser Speech Recognition not supported on this device. Please tap options or type below.");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang;

    recognition.onstart = () => setListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setCustomText(transcript);
      updateHistory({ chiefComplaint: transcript });
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognition.start();
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
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-kiosk-teal bg-kiosk-teal-light px-2.5 py-0.5 rounded">
              Module A: Conversational Intake
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-kiosk-text mt-1.5">
              {getTranslation("chiefComplaintTitle", lang)}
            </h2>
            <p className="text-xs text-kiosk-muted mt-1">{getTranslation("chiefComplaintSub", lang)}</p>
          </div>

          <button
            onClick={playVoicePrompt}
            className="p-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200"
            title="Read Prompt Aloud"
          >
            <Volume2 className="w-4 h-4 text-kiosk-teal animate-pulse" />
          </button>
        </div>

        {/* High-Frequency Complaint Chips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto mb-6">
          <button
            onClick={() => handleSelectComplaint('Chest pain')}
            className={`p-4 rounded-xl border-2 text-center transition flex flex-col items-center justify-center active:scale-98 ${
              session.conversationalHistory.chiefComplaint === 'Chest pain'
                ? 'border-kiosk-teal bg-kiosk-teal-light/40 shadow-xs'
                : 'border-kiosk-border hover:border-kiosk-teal'
            }`}
          >
            <Activity className="w-8 h-8 text-kiosk-alert mb-1" />
            <div className="font-bold text-base text-kiosk-text">{getTranslation("chestPain", lang)}</div>
            <div className="text-[11px] text-stone-400">{getTranslation("chestPainSub", lang)}</div>
          </button>

          <button
            onClick={() => handleSelectComplaint('High fever')}
            className={`p-4 rounded-xl border-2 text-center transition flex flex-col items-center justify-center active:scale-98 ${
              session.conversationalHistory.chiefComplaint === 'High fever'
                ? 'border-kiosk-teal bg-kiosk-teal-light/40 shadow-xs'
                : 'border-kiosk-border hover:border-kiosk-teal'
            }`}
          >
            <Thermometer className="w-8 h-8 text-amber-500 mb-1" />
            <div className="font-bold text-base text-kiosk-text">{getTranslation("highFever", lang)}</div>
            <div className="text-[11px] text-stone-400">{getTranslation("feverSub", lang)}</div>
          </button>

          <button
            onClick={() => handleSelectComplaint('Persistent cough')}
            className={`p-4 rounded-xl border-2 text-center transition flex flex-col items-center justify-center active:scale-98 ${
              session.conversationalHistory.chiefComplaint === 'Persistent cough'
                ? 'border-kiosk-teal bg-kiosk-teal-light/40 shadow-xs'
                : 'border-kiosk-border hover:border-kiosk-teal'
            }`}
          >
            <Stethoscope className="w-8 h-8 text-kiosk-teal mb-1" />
            <div className="font-bold text-base text-kiosk-text">{getTranslation("coughCold", lang)}</div>
            <div className="text-[11px] text-stone-400">{getTranslation("coughSub", lang)}</div>
          </button>
        </div>

        {/* Interactive Speech Input Box */}
        <div className="max-w-xl mx-auto border-2 border-dashed border-stone-200 rounded-2xl p-5 bg-stone-50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-kiosk-muted uppercase flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-kiosk-teal" /> {getTranslation("speakFreely", lang)}
            </span>
            {listening && (
              <span className="text-xs text-kiosk-alert font-semibold flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-kiosk-alert" /> Listening...
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={customText || session.conversationalHistory.chiefComplaint}
              onChange={(e) => {
                setCustomText(e.target.value);
                updateHistory({ chiefComplaint: e.target.value });
              }}
              placeholder={getTranslation("tapMic", lang)}
              className="flex-1 px-4 py-3 rounded-xl border border-kiosk-border text-sm focus:outline-none focus:ring-2 focus:ring-kiosk-teal bg-white"
            />
            <button
              type="button"
              onClick={startVoiceInput}
              className={`p-3 rounded-xl border font-semibold flex items-center justify-center transition active:scale-95 ${
                listening ? 'bg-kiosk-alert text-white border-kiosk-alert animate-ping' : 'bg-white text-kiosk-teal border-kiosk-border hover:bg-stone-100'
              }`}
              title="Voice Input"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-6 flex gap-3 max-w-xl mx-auto w-full">
        <button
          onClick={() => setCurrentStep(3)}
          className="w-1/3 py-3.5 px-4 rounded-xl border border-kiosk-border font-semibold text-stone-600 hover:bg-stone-50 transition text-sm"
        >
          {getTranslation("back", lang)}
        </button>
        <button
          onClick={() => {
            if (session.conversationalHistory.chiefComplaint) {
              setCurrentStep(5);
            }
          }}
          disabled={!session.conversationalHistory.chiefComplaint}
          className={`w-2/3 py-3.5 px-4 text-white font-bold rounded-xl transition shadow-xs text-base flex items-center justify-center gap-2 active:scale-98 ${
            session.conversationalHistory.chiefComplaint ? 'bg-kiosk-teal hover:bg-kiosk-teal-hover' : 'bg-stone-300 cursor-not-allowed'
          }`}
        >
          {getTranslation("startInterview", lang)} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.section>
  );
};
