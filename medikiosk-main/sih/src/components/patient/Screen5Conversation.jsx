import React, { useState, useEffect } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { getLocalizedSocratesTree } from '../../data/questionTrees';
import { getTranslation } from '../../data/translations';
import { motion } from 'framer-motion';
import { ArrowRight, Volume2, HelpCircle, CheckCircle2 } from 'lucide-react';

export const Screen5Conversation = () => {
  const { session, updateHistory, setCurrentStep } = usePatientSession();
  const lang = session.identity.language || 'en-IN';
  const complaintKey = session.conversationalHistory.chiefComplaint || "Chest pain";
  const questionTree = getLocalizedSocratesTree(complaintKey, lang);

  const [questionIdx, setQuestionIdx] = useState(0);
  const currentQuestion = questionTree[questionIdx];

  // Auto Play Voice Prompt in authentic native script (Tamil, Hindi, Telugu, English)
  useEffect(() => {
    if (currentQuestion && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(currentQuestion.title);
      msg.lang = lang;
      window.speechSynthesis.speak(msg);
    }
  }, [questionIdx, currentQuestion, lang]);

  const handleSelectOption = (opt, isUnsure = false) => {
    const fieldId = currentQuestion.id;
    const answerText = isUnsure ? getTranslation("unsure", lang) : opt;
    const confidenceVal = isUnsure ? 0.75 : 0.96;

    const newHpi = { ...session.conversationalHistory.hpi, [fieldId]: answerText };

    const newQaPairs = [
      ...session.conversationalHistory.qaPairs.filter(p => p.question !== currentQuestion.title),
      { question: currentQuestion.title, answer: answerText, confidence: confidenceVal, source: isUnsure ? "Skip / Unsure" : "Touch / Speech" }
    ];

    let isRed = session.conversationalHistory.redFlag;
    let triggers = [...session.conversationalHistory.redFlagTriggers];

    if (complaintKey === "Chest pain" && (opt.includes("Shortness of breath") || opt.includes("Sweating") || opt.includes("மூச்சுத்திணறல்") || opt.includes("सांस"))) {
      isRed = true;
      if (!triggers.includes("Shortness of breath + Sweating")) triggers.push("Shortness of breath + Sweating");
    }

    updateHistory({
      hpi: newHpi,
      qaPairs: newQaPairs,
      redFlag: isRed,
      redFlagTriggers: triggers
    });

    if (questionIdx < questionTree.length - 1) {
      setQuestionIdx(prev => prev + 1);
    } else {
      if (session.identity.ayushMode) {
        setCurrentStep(6);
      } else {
        setCurrentStep(7);
      }
    }
  };

  const speakQuestion = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const msg = new SpeechSynthesisUtterance(currentQuestion.title);
      msg.lang = lang;
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
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-kiosk-teal bg-kiosk-teal-light px-2 py-0.5 rounded flex items-center gap-1 w-fit">
              <CheckCircle2 className="w-3.5 h-3.5" /> SOCRATES ({questionIdx + 1} / {questionTree.length})
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-kiosk-text mt-1">{currentQuestion.title}</h2>
            <p className="text-xs text-kiosk-muted mt-0.5">{currentQuestion.subtext}</p>
          </div>
          <button
            onClick={speakQuestion}
            className="p-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition"
            title="Repeat Prompt"
          >
            <Volume2 className="w-4 h-4 text-kiosk-teal animate-pulse" />
          </button>
        </div>

        {/* Localized Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl mx-auto my-6">
          {currentQuestion.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectOption(opt)}
              className="p-4 rounded-xl border-2 border-kiosk-border hover:border-kiosk-teal text-left transition font-semibold text-sm text-kiosk-text hover:bg-kiosk-teal-light/20 active:scale-98"
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Accessibility Unsure Option */}
        <div className="max-w-xl mx-auto text-center">
          <button
            onClick={() => handleSelectOption("", true)}
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 bg-stone-100 hover:bg-stone-200 px-4 py-2 rounded-lg transition border border-stone-200"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> {getTranslation("unsure", lang)}
          </button>
        </div>
      </div>

      <div className="pt-6 flex gap-3 max-w-xl mx-auto w-full">
        <button
          onClick={() => {
            if (questionIdx > 0) setQuestionIdx(prev => prev - 1);
            else setCurrentStep(4);
          }}
          className="w-1/3 py-3.5 px-4 rounded-xl border border-kiosk-border font-semibold text-stone-600 hover:bg-stone-50 transition text-sm"
        >
          {getTranslation("previous", lang)}
        </button>
        <button
          onClick={() => handleSelectOption("", true)}
          className="w-2/3 py-3.5 px-4 bg-kiosk-teal hover:bg-kiosk-teal-hover text-white font-bold rounded-xl transition shadow-xs text-base flex items-center justify-center gap-2 active:scale-98"
        >
          {getTranslation("skipQuestion", lang)} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.section>
  );
};
