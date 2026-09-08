import React, { useState, useEffect } from 'react';
import { Cookie, Settings, X } from 'lucide-react';

export const CookieConsentModal = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [preferences, setPreferences] = useState({
    essential: true, // Always required for EHR & login sessions
    clinicalAnalytics: true,
    voiceIntakeCache: true
  });

  useEffect(() => {
    const saved = localStorage.getItem('medikiosk_cookie_consent');
    if (!saved) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('medikiosk_cookie_consent', JSON.stringify({ ...preferences, status: 'ACCEPTED_ALL' }));
    setShowBanner(false);
    setShowModal(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('medikiosk_cookie_consent', JSON.stringify({ essential: true, clinicalAnalytics: false, voiceIntakeCache: false, status: 'ESSENTIAL_ONLY' }));
    setShowBanner(false);
    setShowModal(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('medikiosk_cookie_consent', JSON.stringify({ ...preferences, status: 'CUSTOM' }));
    setShowBanner(false);
    setShowModal(false);
  };

  if (!showBanner && !showModal) return null;

  return (
    <>
      {/* FLOATING BOTTOM BANNER */}
      {showBanner && !showModal && (
        <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-xl z-50 bg-stone-900 text-white p-5 rounded-2xl border border-stone-700 shadow-2xl space-y-3 text-xs animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
              <Cookie className="w-5 h-5 text-emerald-400" />
              <span>Healthcare Data & Cookie Privacy Notice</span>
            </div>
            <button onClick={() => setShowBanner(false)} className="text-stone-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-stone-300 leading-relaxed">
            MediKiosk uses essential cookies to secure your passwordless Aadhaar login, isolate patient documents, and save your language preference in compliance with the <strong>DPDP Act 2023</strong> and <strong>ABDM Security Guidelines</strong>.
          </p>

          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs transition"
            >
              Accept All Healthcare Cookies
            </button>

            <button
              onClick={handleAcceptEssential}
              className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold rounded-xl border border-stone-700 transition"
            >
              Essential Only
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-2 text-stone-400 hover:text-white font-semibold flex items-center gap-1"
            >
              <Settings className="w-3.5 h-3.5" /> Customize
            </button>
          </div>
        </div>
      )}

      {/* DETAILED COOKIE SETTINGS MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 text-stone-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-stone-900">
                <Cookie className="w-5 h-5 text-emerald-600" />
                <span>DPDP Act Cookie & Privacy Settings</span>
              </div>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-700 font-bold px-2">
                ✕
              </button>
            </div>

            <p className="text-stone-500">
              Customize how MediKiosk stores session states and clinical intake preferences on your local browser device.
            </p>

            <div className="space-y-3">
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-stone-900">Essential Healthcare Session Cookies</div>
                  <div className="text-[11px] text-stone-500">Required for Aadhaar login, session isolation, and OPD token generation.</div>
                </div>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">ALWAYS ACTIVE</span>
              </div>

              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-stone-900">Voice Intake & Translation Cache</div>
                  <div className="text-[11px] text-stone-500">Saves speech synthesis language choices for Tamil, Hindi, Telugu, and English.</div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.voiceIntakeCache}
                  onChange={(e) => setPreferences(p => ({ ...p, voiceIntakeCache: e.target.checked }))}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-stone-900">Clinical Analytics & Triage Optimization</div>
                  <div className="text-[11px] text-stone-500">Helps hospital administrators optimize wait times and doctor queue routing.</div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.clinicalAnalytics}
                  onChange={(e) => setPreferences(p => ({ ...p, clinicalAnalytics: e.target.checked }))}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                onClick={handleSavePreferences}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-xs"
              >
                Save Cookie Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
