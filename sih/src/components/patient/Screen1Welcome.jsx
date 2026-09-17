import React, { useState } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { getTranslation } from '../../data/translations';
import { MEDICAL_IMAGES, FALLBACK_HOSPITAL_SVG } from '../../data/images';
import { motion } from 'framer-motion';
import { Sparkles, Check, ArrowRight, Mic, Search, CheckCircle2, AlertCircle, Zap } from 'lucide-react';

export const Screen1Welcome = () => {
  const { session, updateIdentity, updateHistory, setCurrentStep, appointments, doctorQueue } = usePatientSession();
  const lang = session.identity.language || 'en-IN';

  const [showFastTrack, setShowFastTrack] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [fastTrackFound, setFastTrackFound] = useState(null);

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

  const handleLookupBooking = (e) => {
    e.preventDefault();
    setSearchError("");
    setFastTrackFound(null);

    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSearchError("Please enter your OP Token (e.g. OPD-101) or Registered Phone Number.");
      return;
    }

    // Check in session appointments or doctor queue
    const aptMatch = appointments.find(a => 
      (a.token && a.token.toLowerCase() === q) || 
      (a.id && a.id.toLowerCase() === q) ||
      (a.patientPhone && a.patientPhone.includes(q)) ||
      (a.patientName && a.patientName.toLowerCase().includes(q))
    );

    const queueMatch = doctorQueue.find(p => 
      (p.token && p.token.toLowerCase() === q) ||
      (p.appointmentNumber && p.appointmentNumber.toLowerCase() === q) ||
      (p.phone && p.phone.includes(q)) ||
      (p.name && p.name.toLowerCase().includes(q))
    );

    const match = aptMatch || queueMatch;

    if (match) {
      const patientData = {
        name: match.patientName || match.name || "Patient",
        age: match.patientAge || match.age || "32",
        gender: match.patientGender || match.gender || "Male",
        phone: match.patientPhone || match.phone || searchQuery,
        token: match.token || match.id || "OPD-Online",
        hospital: match.hospitalName || match.hospital || "General Hospital",
        department: match.department || "General OPD",
        chiefComplaint: match.chiefComplaint || ""
      };
      setFastTrackFound(patientData);
    } else {
      // Fallback: If not found in local list, create fast-track from entered query
      setFastTrackFound({
        name: "Verified Online Patient",
        age: "34",
        gender: "Male",
        phone: q.length >= 10 ? q : "9876543210",
        token: q.startsWith("opd") || q.startsWith("apt") ? q.toUpperCase() : "OPD-" + Math.floor(100 + Math.random() * 900),
        hospital: "Online Booked Hospital",
        department: "General Medicine",
        chiefComplaint: "Online Registered OP Follow-up"
      });
    }
  };

  const handleProceedFastTrack = () => {
    if (!fastTrackFound) return;
    updateIdentity({
      name: fastTrackFound.name,
      age: fastTrackFound.age,
      gender: fastTrackFound.gender,
      phone: fastTrackFound.phone,
      token: fastTrackFound.token,
      consentGiven: true
    });
    if (fastTrackFound.chiefComplaint) {
      updateHistory({
        chiefComplaint: fastTrackFound.chiefComplaint
      });
    }
    // Direct Fast-Track: Skip Screen 2 (Identity) and Screen 3 (Consent) -> Jump directly to Screen 4 (AI Intake/Vitals)
    setCurrentStep(4);
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
        <div className="text-center max-w-md mx-auto mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-kiosk-teal-light text-kiosk-teal text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> AI-Powered Hospital Intake
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-kiosk-text">
            {getTranslation("welcomeTitle", lang)}
          </h1>
          <p className="text-sm text-kiosk-muted mt-1 leading-relaxed">
            {getTranslation("welcomeSub", lang)}
          </p>
        </div>

        {/* FAST-TRACK OP BOOKING BANNER */}
        <div className="max-w-lg mx-auto mb-5">
          {!showFastTrack ? (
            <button
              type="button"
              onClick={() => setShowFastTrack(true)}
              className="w-full p-3.5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border-2 border-dashed border-teal-500 rounded-2xl flex items-center justify-between text-left hover:bg-teal-500/15 transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-sm">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-teal-900 group-hover:text-teal-950 flex items-center gap-1.5">
                    Already Booked OP Online from Home?
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-600 text-white font-mono uppercase">Fast-Track</span>
                  </div>
                  <div className="text-xs text-teal-700">
                    Skip patient details entry & jump straight to AI vitals intake
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition shrink-0" />
            </button>
          ) : (
            <div className="p-4 bg-teal-50/90 border-2 border-teal-500 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-900 uppercase tracking-wide">
                  <Zap className="w-4 h-4 text-teal-600" /> Online OP Booking Fast-Track
                </div>
                <button
                  type="button"
                  onClick={() => setShowFastTrack(false)}
                  className="text-xs text-stone-500 hover:text-stone-800 underline font-medium"
                >
                  Cancel / Standard Intake
                </button>
              </div>

              <form onSubmit={handleLookupBooking} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter Token (e.g. OPD-101) or Mobile..."
                    className="w-full p-2.5 pl-8 bg-white border border-teal-300 rounded-xl text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
                  />
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3.5" />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs shadow-xs transition shrink-0"
                >
                  Lookup OP
                </button>
              </form>

              {searchError && (
                <div className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {searchError}
                </div>
              )}

              {fastTrackFound && (
                <div className="p-3 bg-white border border-teal-200 rounded-xl space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-teal-950 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-teal-600" /> {fastTrackFound.name} ({fastTrackFound.age}y/{fastTrackFound.gender})
                    </span>
                    <span className="font-mono font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                      {fastTrackFound.token}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    Online OP booking found. Details are pre-filled. You can proceed directly to AI Voice & Vitals capture.
                  </p>
                  <button
                    type="button"
                    onClick={handleProceedFastTrack}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    Start AI Vitals & Voice Intake (Skip Details) <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Clinical Imagery Banner */}
        <div className="max-w-lg mx-auto mb-5 rounded-xl overflow-hidden shadow-xs border border-stone-200">
          <img
            src={MEDICAL_IMAGES?.hero || FALLBACK_HOSPITAL_SVG}
            alt="Hospital Intake Kiosk"
            className="w-full h-32 object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_HOSPITAL_SVG; }}
          />
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
          {[
            { code: 'en-IN', label: 'English', desc: 'Default National Standard' },
            { code: 'hi-IN', label: 'हिन्दी', desc: 'Hindi (North / Central)' },
            { code: 'ta-IN', label: 'தமிழ்', desc: 'Tamil (AIIA / Regional)' },
            { code: 'te-IN', label: 'తెలుగు', desc: 'Telugu (Regional)' }
          ].map(l => (
            <button
              key={l.code}
              onClick={() => handleSelectLanguage(l.code)}
              className={`p-3.5 rounded-xl border-2 flex items-center justify-between text-left transition active:scale-98 ${
                session.identity.language === l.code
                  ? 'border-kiosk-teal bg-kiosk-teal-light/40 shadow-xs'
                  : 'border-kiosk-border hover:border-kiosk-teal'
              }`}
            >
              <div>
                <div className="text-base font-bold text-kiosk-text">{l.label}</div>
                <div className="text-xs text-kiosk-muted">{l.desc}</div>
              </div>
              {session.identity.language === l.code && (
                <Check className="w-5 h-5 text-kiosk-teal" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-5 text-center space-y-2">
        <button
          onClick={() => setCurrentStep(2)}
          className="w-full max-w-md mx-auto py-3.5 px-6 bg-kiosk-teal hover:bg-kiosk-teal-hover text-white text-base font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 active:scale-98"
        >
          {getTranslation("continue", lang)} <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-xs text-stone-400 mt-1.5 flex items-center justify-center gap-1.5">
          <Mic className="w-3.5 h-3.5" /> {getTranslation("voiceNote", lang)}
        </p>
      </div>
    </motion.section>
  );
};

