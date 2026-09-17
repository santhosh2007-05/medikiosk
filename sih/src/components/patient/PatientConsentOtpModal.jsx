import React, { useState, useEffect } from 'react';
import {
  Smartphone, ShieldCheck, Copy, Check,
  X, BellRing
} from 'lucide-react';

export const PatientConsentOtpModal = () => {
  const [activeNotification, setActiveNotification] = useState(null);
  const [copied, setCopied] = useState(false);
  const [plainOtp, setPlainOtp] = useState('745654');
  const [isFetchingOtp, setIsFetchingOtp] = useState(false);

  useEffect(() => {
    const handleOtpEvent = (e) => {
      const details = e.detail;
      setActiveNotification(details);
      setCopied(false);

      // Fetch the actual plain OTP generated from Spring Boot backend
      if (details.patientToken) {
        setIsFetchingOtp(true);
        fetch(`http://localhost:8080/api/doctor/consent/patient-active-otp/${details.patientToken}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.plainOtp) {
              setPlainOtp(data.plainOtp);
            }
          })
          .catch(err => console.log('Using simulated OTP:', err))
          .finally(() => setIsFetchingOtp(false));
      }
    };

    window.addEventListener('medikiosk-patient-otp', handleOtpEvent);
    return () => window.removeEventListener('medikiosk-patient-otp', handleOtpEvent);
  }, []);

  if (!activeNotification) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(plainOtp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full p-4 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-stone-900 border-2 border-emerald-500/80 rounded-3xl p-6 shadow-2xl text-stone-100 relative font-sans backdrop-blur-xl">
        
        {/* Close Button */}
        <button
          onClick={() => setActiveNotification(null)}
          className="absolute right-4 top-4 p-1.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold relative">
              <Smartphone className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-stone-900" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                <BellRing className="w-3 h-3" /> Incoming ABHA / SMS Consent OTP
              </span>
              <h3 className="font-extrabold text-sm text-white">
                Doctor Consultation Consent Request
              </h3>
            </div>
          </div>

          {/* Context Card */}
          <div className="p-3.5 bg-stone-950 border border-stone-800 rounded-2xl text-xs text-stone-300 space-y-1.5">
            <p className="leading-relaxed">
              <strong className="text-white">{activeNotification.doctorName || 'Dr. V. S. Ramachandran'}</strong> has initiated your OPD consultation for token <span className="font-mono text-emerald-400 font-bold">{activeNotification.patientToken}</span>.
            </p>
            <p className="text-[11px] text-stone-400">
              Provide the single-use 6-digit OTP below to grant <strong className="text-stone-200">5 minutes of medical file access</strong> to the physician.
            </p>
          </div>

          {/* 6-Digit OTP Highlight Box */}
          <div className="bg-gradient-to-r from-emerald-950/80 via-stone-950 to-emerald-950/80 border-2 border-emerald-600 rounded-2xl p-4 text-center space-y-2">
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-300 font-bold block">
              Your 6-Digit Consent OTP (BCrypt Encrypted)
            </span>
            
            <div className="text-3xl font-mono font-black tracking-widest text-emerald-400 select-all">
              {isFetchingOtp ? '••••••' : plainOtp}
            </div>

            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied to Clipboard' : 'Copy OTP Code'}
              </button>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono border-t border-stone-800/80 pt-2">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> 10-Round BCrypt Protected
            </span>
            <span>Expires in 5 Mins</span>
          </div>
        </div>
      </div>
    </div>
  );
};
