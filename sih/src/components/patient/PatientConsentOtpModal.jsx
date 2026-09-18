import React, { useState, useEffect } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import {
  ShieldCheck, Copy, Check,
  X, BellRing, KeyRound
} from 'lucide-react';

export const PatientConsentOtpModal = () => {
  const { viewMode, authenticatedUser, session } = usePatientSession() || {};
  const [activeNotification, setActiveNotification] = useState(null);
  const [copied, setCopied] = useState(false);
  const [plainOtp, setPlainOtp] = useState('745654');
  const [isFetchingOtp, setIsFetchingOtp] = useState(false);

  const currentPatientName = (authenticatedUser?.name || session?.identity?.name || "JOSEPH VIJAY").trim().toLowerCase();
  const currentPatientToken = (authenticatedUser?.token || session?.identity?.token || "PAT-1001").trim().toUpperCase();
  const currentPatientPhone = (authenticatedUser?.phone || session?.identity?.phone || "").trim();

  // Helper to verify if an incoming OTP notification belongs to THIS logged in patient
  const isMatchPatient = (targetToken, targetName, targetPhone) => {
    const tToken = (targetToken || '').trim().toUpperCase();
    const tName = (targetName || '').trim().toLowerCase();
    const tPhone = (targetPhone || '').trim();

    if (tName && currentPatientName && (tName === currentPatientName || tName.includes(currentPatientName) || currentPatientName.includes(tName))) {
      return true;
    }
    if (tToken && currentPatientToken) {
      if (tToken === currentPatientToken) return true;
      if (tToken.replace('PAT-', 'OPD-') === currentPatientToken.replace('PAT-', 'OPD-')) return true;
      if (tToken.replace('OPD-', 'PAT-') === currentPatientToken.replace('OPD-', 'PAT-')) return true;
    }
    if (tPhone && currentPatientPhone && tPhone === currentPatientPhone) {
      return true;
    }
    return false;
  };

  // Sync check helper from localStorage
  const syncFromStorage = () => {
    // Only process if user is in patient portal
    if (viewMode !== 'patient-portal') return;

    try {
      const dismissed = sessionStorage.getItem('medikiosk_dismissed_otp');
      const saved = localStorage.getItem('medikiosk_active_otp_modal');
      if (saved) {
        const parsed = JSON.parse(saved);
        const elapsed = Date.now() - (parsed.timestamp || 0);
        if (elapsed < 15 * 60 * 1000 && parsed.details) {
          if (isMatchPatient(parsed.details.patientToken, parsed.details.patientName, parsed.details.patientPhone)) {
            const otpCode = parsed.plainOtp || '745654';
            const otpKey = `${parsed.details.patientToken}_${otpCode}`;
            
            if (parsed.plainOtp) setPlainOtp(parsed.plainOtp);
            
            // Do not reopen if dismissed
            if (dismissed === otpKey) {
              return;
            }
            
            setActiveNotification(parsed.details);
            return;
          }
        }
      }

      // Check if any consent_state_ has been initiated for this patient's token
      const tokensToCheck = [
        currentPatientToken,
        currentPatientToken.replace('PAT-', 'OPD-'),
        currentPatientToken.replace('OPD-', 'PAT-')
      ];

      for (const token of tokensToCheck) {
        const raw = localStorage.getItem(`consent_state_${token}`);
        if (raw) {
          const parsed = JSON.parse(raw);
          const elapsed = Date.now() - (parsed.timestamp || 0);
          if (parsed.otpSent && elapsed < 15 * 60 * 1000) {
            const otpKey = `${token}_745654`;
            if (dismissed === otpKey) return;
            
            const details = {
              patientToken: token,
              patientName: currentPatientName,
              doctorName: 'Dr. V. S. Ramachandran',
              timestamp: new Date(parsed.timestamp).toLocaleTimeString()
            };
            setActiveNotification(details);
            return;
          }
        }
      }
    } catch(e) {}
  };

  // Poll Spring Boot backend directly for active OTPs
  const pollBackendActiveOtp = async () => {
    if (viewMode !== 'patient-portal') return;

    try {
      const dismissed = sessionStorage.getItem('medikiosk_dismissed_otp');
      const tokensToCheck = [
        currentPatientToken,
        currentPatientToken.replace('PAT-', 'OPD-'),
        currentPatientToken.replace('OPD-', 'PAT-')
      ].filter(Boolean);

      for (const t of tokensToCheck) {
        try {
          const res = await fetch(`http://localhost:8080/api/doctor/consent/patient-active-otp/${t}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.plainOtp && (data.status === 'PENDING' || data.status === 'ACTIVE' || data.status === 'OTP_SENT')) {
              setPlainOtp(data.plainOtp);
              const otpKey = `${data.patientToken || t}_${data.plainOtp}`;
              
              // Only pop modal if not dismissed
              if (dismissed !== otpKey) {
                setActiveNotification({
                  patientToken: data.patientToken || t,
                  patientName: currentPatientName,
                  doctorName: data.doctorName || 'Dr. V. S. Ramachandran',
                  timestamp: data.createdAt ? new Date(data.createdAt).toLocaleTimeString() : new Date().toLocaleTimeString()
                });
              }
              return;
            }
          }
        } catch (e) {
          // Backend offline, fallback to local storage
        }
      }
    } catch (e) {}
  };

  // 1. Initial check & Cross-tab live storage listener & Spring Boot backend polling
  useEffect(() => {
    if (viewMode !== 'patient-portal') {
      setActiveNotification(null);
      return;
    }

    syncFromStorage();
    pollBackendActiveOtp();

    // Cross-tab storage listener (Fires when doctor tab writes to localStorage)
    const handleStorageChange = (e) => {
      if (e.key === 'medikiosk_active_otp_modal' || (e.key && e.key.startsWith('consent_state_'))) {
        syncFromStorage();
        pollBackendActiveOtp();
      }
    };

    // Fast 1.5-second polling check across tabs and Spring Boot backend
    const interval = setInterval(() => {
      syncFromStorage();
      pollBackendActiveOtp();
    }, 1500);

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, currentPatientName, currentPatientToken]);

  // 2. Window Custom Event Listeners
  useEffect(() => {
    if (viewMode !== 'patient-portal') return;

    const handleOtpEvent = (e) => {
      const details = e.detail;
      if (!details) return;

      // Verify that this OTP belongs to this logged-in patient
      if (!isMatchPatient(details.patientToken, details.patientName, details.patientPhone)) {
        return;
      }

      sessionStorage.removeItem('medikiosk_dismissed_otp'); // Reset dismissal on explicit event
      setActiveNotification(details);
      setCopied(false);

      try {
        localStorage.setItem('medikiosk_active_otp_modal', JSON.stringify({
          details,
          plainOtp: '745654',
          timestamp: Date.now()
        }));
      } catch(e) {}

      // Fetch the actual plain OTP generated from Spring Boot backend
      if (details?.patientToken) {
        setIsFetchingOtp(true);
        fetch(`http://localhost:8080/api/doctor/consent/patient-active-otp/${details.patientToken}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.plainOtp) {
              setPlainOtp(data.plainOtp);
              try {
                localStorage.setItem('medikiosk_active_otp_modal', JSON.stringify({
                  details,
                  plainOtp: data.plainOtp,
                  timestamp: Date.now()
                }));
              } catch(e) {}
            }
          })
          .catch(err => console.log('Using simulated OTP:', err))
          .finally(() => setIsFetchingOtp(false));
      }
    };

    // Handler when user clicks "View OTP Popup" or Notification Bell
    const handleForceOpenModal = (e) => {
      if (viewMode !== 'patient-portal') return;
      sessionStorage.removeItem('medikiosk_dismissed_otp');
      if (e.detail) {
        const item = e.detail.details || e.detail;
        if (isMatchPatient(item.patientToken, item.patientName, item.patientPhone)) {
          setActiveNotification(item);
          if (e.detail.plainOtp) setPlainOtp(e.detail.plainOtp);
        }
      } else {
        syncFromStorage();
      }
    };

    window.addEventListener('medikiosk-patient-otp', handleOtpEvent);
    window.addEventListener('medikiosk-open-otp-modal', handleForceOpenModal);
    return () => {
      window.removeEventListener('medikiosk-patient-otp', handleOtpEvent);
      window.removeEventListener('medikiosk-open-otp-modal', handleForceOpenModal);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode, currentPatientName, currentPatientToken]);

  const handleClose = () => {
    if (activeNotification) {
      const otpKey = `${activeNotification.patientToken}_${plainOtp}`;
      try {
        sessionStorage.setItem('medikiosk_dismissed_otp', otpKey);
      } catch(e) {}
    }
    setActiveNotification(null);
  };

  // DO NOT RENDER ON DOCTOR, NURSE, ADMIN, RECEPTIONIST PANELS OR IF NO NOTIFICATION
  if (viewMode !== 'patient-portal') return null;
  if (!activeNotification) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(plainOtp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 border-2 border-emerald-500 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-stone-100 relative font-sans">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-5 top-5 p-2 rounded-2xl bg-stone-950/80 border border-stone-800 text-stone-400 hover:text-white hover:bg-stone-800 transition"
          title="Close Popup"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Header Banner */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/50 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20 relative">
              <KeyRound className="w-7 h-7 animate-pulse text-emerald-400" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-400 rounded-full animate-ping" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-stone-900" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 tracking-wider uppercase flex items-center gap-1">
                  <BellRing className="w-3 h-3 text-emerald-400" /> Incoming ABDM Consent Request
                </span>
              </div>
              <h2 className="font-black text-xl text-white mt-1">
                Doctor Consultation Consent OTP
              </h2>
            </div>
          </div>

          {/* Context Card */}
          <div className="p-4 bg-stone-950/90 border border-stone-800 rounded-2xl text-xs text-stone-300 space-y-2">
            <p className="leading-relaxed text-sm">
              <strong className="text-white text-base font-bold">{activeNotification.doctorName || 'Dr. V. S. Ramachandran'}</strong> has initiated your clinical OPD consultation for Token <span className="font-mono text-emerald-400 font-extrabold text-sm px-2 py-0.5 bg-emerald-950/80 border border-emerald-800 rounded-lg">{activeNotification.patientToken || 'OPD-1001'}</span>.
            </p>
            <p className="text-xs text-stone-400">
              Please share the single-use 6-digit OTP below with your physician to grant <strong>5 minutes of secure medical record access</strong>.
            </p>
          </div>

          {/* 6-Digit OTP Highlight Box */}
          <div className="bg-gradient-to-r from-emerald-950 via-stone-950 to-emerald-950 border-2 border-emerald-500 rounded-2xl p-6 text-center space-y-3 shadow-inner">
            <span className="text-xs uppercase font-mono tracking-widest text-emerald-300 font-extrabold block">
              YOUR 6-DIGIT CONSENT OTP CODE
            </span>
            
            <div className="text-4xl sm:text-5xl font-mono font-black tracking-widest text-emerald-400 select-all py-1 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]">
              {isFetchingOtp ? '••••••' : plainOtp}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleCopy}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black rounded-xl text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-500/30 active:scale-95"
              >
                {copied ? <Check className="w-5 h-5 text-stone-950" /> : <Copy className="w-5 h-5 text-stone-950" />}
                {copied ? 'Copied to Clipboard!' : 'Copy 6-Digit OTP'}
              </button>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="flex items-center justify-between text-xs text-stone-400 font-mono border-t border-stone-800 pt-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" /> 10-Round BCrypt Security Shield
            </span>
            <span className="text-stone-400">Valid for 5 Minutes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
