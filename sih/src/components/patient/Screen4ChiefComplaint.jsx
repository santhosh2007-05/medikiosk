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
  const [micStatusMsg, setMicStatusMsg] = useState("");

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

  const startVoiceInput = async () => {
    setMicStatusMsg("");
    // Request microphone permission explicitly from Android OS / Browser
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
    } catch (permErr) {
      console.warn("Microphone permission prompt result:", permErr);
      setMicStatusMsg("Microphone access requested. If prompted, please tap Allow.");
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMicStatusMsg("Native voice engine not detected in WebView. You can type symptoms below or tap symptom cards.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setListening(true);
        setMicStatusMsg("🎙️ Listening... Speak your symptoms now.");
      };

      recognition.onresult = (e) => {
        if (e.results && e.results[0] && e.results[0][0]) {
          const transcript = e.results[0][0].transcript;
          setCustomText(transcript);
          updateHistory({ chiefComplaint: transcript });
          setMicStatusMsg(`✅ Captured: "${transcript}"`);
        }
        setListening(false);
      };

      recognition.onerror = (err) => {
        console.warn("Speech recognition error:", err);
        setListening(false);
        if (err.error === 'not-allowed') {
          setMicStatusMsg("⚠️ Microphone permission denied. Please allow microphone in Android App Settings.");
        } else if (err.error === 'no-speech') {
          setMicStatusMsg("ℹ️ No speech detected. Tap mic again to speak.");
        } else {
          setMicStatusMsg(`Voice engine status: ${err.error || 'Offline'}. You can type symptoms or select options.`);
        }
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error("SpeechRecognition start exception:", e);
      setListening(false);
      setMicStatusMsg("Could not start speech engine. You can type symptoms directly.");
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
              className="flex-1 px-4 py-3 rounded-xl border border-stone-300 bg-white text-stone-900 placeholder-stone-500 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <button
              type="button"
              onClick={startVoiceInput}
              className={`p-3 rounded-xl border font-semibold flex items-center justify-center transition active:scale-95 ${
                listening ? 'bg-kiosk-alert text-white border-kiosk-alert animate-pulse' : 'bg-white text-kiosk-teal border-kiosk-border hover:bg-stone-100'
              }`}
              title="Voice Input"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>

          {micStatusMsg && (
            <p className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 mt-2.5">
              {micStatusMsg}
            </p>
          )}
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
