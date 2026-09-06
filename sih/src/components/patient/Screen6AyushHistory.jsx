import React, { useState } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { AYUSH_QUESTIONS } from '../../data/ayushQuestions';
import { MEDICAL_IMAGES } from '../../data/images';
import { motion } from 'framer-motion';
import { Leaf, ArrowRight } from 'lucide-react';

export const Screen6AyushHistory = () => {
  const { session, updateHistory, setCurrentStep } = usePatientSession();
  const [questionIdx, setQuestionIdx] = useState(0);
  const currentQuestion = AYUSH_QUESTIONS[questionIdx];

  const handleSelectOption = (opt) => {
    const fieldId = currentQuestion.id;
    const newAyushParams = {
      ...session.conversationalHistory.ayushParameters,
      [fieldId]: opt
    };

    updateHistory({ ayushParameters: newAyushParams });

    if (questionIdx < AYUSH_QUESTIONS.length - 1) {
      setQuestionIdx(prev => prev + 1);
    } else {
      setCurrentStep(7);
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
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-kiosk-ayush/20 bg-kiosk-ayush-light p-3 rounded-xl">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-kiosk-ayush flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5" /> Dashavidha Pariksha ({questionIdx + 1} / {AYUSH_QUESTIONS.length})
            </span>
            <h2 className="text-xl font-bold text-kiosk-text mt-1">{currentQuestion.title}</h2>
            <p className="text-xs text-kiosk-muted mt-0.5">{currentQuestion.subtext}</p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-white text-kiosk-ayush rounded border border-kiosk-ayush/20">
            AIIA Standard
          </span>
        </div>

        {/* AYUSH Imagery */}
        <div className="max-w-xl mx-auto mb-4 rounded-xl overflow-hidden shadow-xs border border-kiosk-ayush/20">
          <img src={MEDICAL_IMAGES.ayurveda} alt="Ayurvedic Assessment" className="w-full h-28 object-cover" />
        </div>

        <div className="grid grid-cols-1 gap-3 max-w-xl mx-auto my-4">
          {currentQuestion.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectOption(opt)}
              className={`p-4 rounded-xl border-2 text-left transition font-semibold text-sm active:scale-98 ${
                session.conversationalHistory.ayushParameters[currentQuestion.id] === opt
                  ? 'border-kiosk-ayush bg-kiosk-ayush-light text-kiosk-ayush'
                  : 'border-kiosk-border hover:border-kiosk-ayush text-kiosk-text hover:bg-stone-50'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-6 flex gap-3 max-w-xl mx-auto w-full">
        <button
          onClick={() => {
            if (questionIdx > 0) setQuestionIdx(prev => prev - 1);
            else setCurrentStep(5);
          }}
          className="w-1/3 py-3.5 px-4 rounded-xl border border-kiosk-border font-semibold text-stone-600 hover:bg-stone-50 transition text-sm"
        >
          Previous
        </button>
        <button
          onClick={() => {
            if (questionIdx < AYUSH_QUESTIONS.length - 1) setQuestionIdx(prev => prev + 1);
            else setCurrentStep(7);
          }}
          className="w-2/3 py-3.5 px-4 bg-kiosk-ayush hover:bg-kiosk-ayush-hover text-white font-bold rounded-xl transition shadow-xs text-base flex items-center justify-center gap-2 active:scale-98"
        >
          Next AYUSH Parameter <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.section>
  );
};
