import React from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { getTranslation } from '../../data/translations';
import { MEDICAL_IMAGES } from '../../data/images';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Zap } from 'lucide-react';

export const Screen2Identification = () => {
  const { session, updateIdentity, setCurrentStep, loadPreset } = usePatientSession();
  const lang = session.identity.language || 'en-IN';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!session.identity.name) return;
    setCurrentStep(3);
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
            <h2 className="text-2xl font-bold text-kiosk-text">{getTranslation("patientIdentity", lang)}</h2>
            <p className="text-xs text-kiosk-muted">{getTranslation("identitySub", lang)}</p>
          </div>
          <button
            onClick={() => loadPreset('chest_redflag')}
            className="text-xs text-kiosk-teal font-semibold px-2.5 py-1.5 bg-kiosk-teal-light rounded border border-kiosk-teal/20 hover:bg-kiosk-teal/10 flex items-center gap-1"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Demo Patient
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center max-w-xl mx-auto mb-4">
          <div className="md:col-span-12 rounded-xl overflow-hidden shadow-xs border border-stone-200">
            <img src={MEDICAL_IMAGES.digitalKiosk} alt="Patient Registration" className="w-full h-28 object-cover" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
          <div>
            <label className="block text-xs font-bold text-kiosk-text uppercase tracking-wider mb-1.5">{getTranslation("fullName", lang)} *</label>
            <input
              type="text"
              required
              value={session.identity.name}
              onChange={(e) => updateIdentity({ name: e.target.value })}
              placeholder="e.g. JOSEPH VIJAY / ஜோசப் விஜய்"
              className="w-full text-base px-4 py-3 rounded-xl border border-kiosk-border focus:ring-2 focus:ring-kiosk-teal focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-kiosk-text uppercase tracking-wider mb-1.5">{getTranslation("ageYears", lang)} *</label>
              <input
                type="number"
                min="1"
                max="115"
                required
                value={session.identity.age}
                onChange={(e) => updateIdentity({ age: e.target.value })}
                placeholder="e.g. 52"
                className="w-full text-base px-4 py-3 rounded-xl border border-kiosk-border focus:ring-2 focus:ring-kiosk-teal focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-kiosk-text uppercase tracking-wider mb-1.5">{getTranslation("gender", lang)} *</label>
              <select
                value={session.identity.gender}
                onChange={(e) => updateIdentity({ gender: e.target.value })}
                className="w-full text-base px-4 py-3 rounded-xl border border-kiosk-border focus:ring-2 focus:ring-kiosk-teal focus:outline-none bg-white"
              >
                <option value="Male">{getTranslation("male", lang)}</option>
                <option value="Female">{getTranslation("female", lang)}</option>
                <option value="Other">{getTranslation("other", lang)}</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-kiosk-text uppercase tracking-wider">{getTranslation("abhaId", lang)}</label>
              <span className="text-[11px] text-stone-400">ABDM Sandbox</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={session.identity.token}
                onChange={(e) => updateIdentity({ token: e.target.value })}
                placeholder="91-XXXX-XXXX-XXXX"
                className="w-full text-base px-4 py-3 rounded-xl border border-kiosk-border focus:ring-2 focus:ring-kiosk-teal focus:outline-none pr-10 font-mono"
              />
              <span className="absolute right-3 top-3.5 text-xs text-stone-400 font-mono">ABHA</span>
            </div>
          </div>

          {/* AYUSH Mode Switch */}
          <div className="p-4 rounded-xl border-2 border-stone-200 bg-stone-50 transition">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-kiosk-text flex items-center gap-1.5">
                    <Leaf className="w-4 h-4 text-kiosk-ayush" /> {getTranslation("ayushIntake", lang)}
                  </span>
                  <span className="text-[10px] uppercase font-bold bg-kiosk-ayush-light text-kiosk-ayush px-2 py-0.5 rounded border border-kiosk-ayush/30">
                    AYUSH
                  </span>
                </div>
                <p className="text-xs text-kiosk-muted mt-1">
                  {getTranslation("ayushSub", lang)}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-1">
                <input
                  type="checkbox"
                  checked={session.identity.ayushMode}
                  onChange={(e) => updateIdentity({ ayushMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-12 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-kiosk-ayush"></div>
              </label>
            </div>
          </div>
        </form>
      </div>

      <div className="pt-6 flex gap-3 max-w-xl mx-auto w-full">
        <button
          onClick={() => setCurrentStep(1)}
          className="w-1/3 py-3.5 px-4 rounded-xl border border-kiosk-border font-semibold text-stone-600 hover:bg-stone-50 transition text-sm"
        >
          {getTranslation("back", lang)}
        </button>
        <button
          onClick={handleSubmit}
          className="w-2/3 py-3.5 px-4 bg-kiosk-teal hover:bg-kiosk-teal-hover text-white font-bold rounded-xl transition shadow-xs text-base flex items-center justify-center gap-2 active:scale-98"
        >
          {getTranslation("confirmProceed", lang)} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.section>
  );
};
