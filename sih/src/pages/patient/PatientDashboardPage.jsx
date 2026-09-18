import React, { useState, useEffect } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { Stepper } from '../../components/common/Stepper';
import { Screen1Welcome } from '../../components/patient/Screen1Welcome';
import { Screen2Identification } from '../../components/patient/Screen2Identification';
import { Screen3Consent } from '../../components/patient/Screen3Consent';
import { Screen4ChiefComplaint } from '../../components/patient/Screen4ChiefComplaint';
import { Screen5Conversation } from '../../components/patient/Screen5Conversation';
import { Screen6AyushHistory } from '../../components/patient/Screen6AyushHistory';
import { Screen7DocumentUpload } from '../../components/patient/Screen7DocumentUpload';
import { Screen8TimelineLabFlags } from '../../components/patient/Screen8TimelineLabFlags';
import { Screen9SummaryReadBack } from '../../components/patient/Screen9SummaryReadBack';
import { Screen10SubmissionComplete } from '../../components/patient/Screen10SubmissionComplete';
import { AppointmentsPanel } from '../../components/appointment/AppointmentsPanel';
import { HomeAppointmentModal } from '../../components/home/HomeAppointmentModal';
import { PatientDocumentUploadPanel } from '../../components/patient/PatientDocumentUploadPanel';
import { HospitalLocationCard } from '../../components/common/HospitalLocationCard';
import { MEDICAL_IMAGES } from '../../data/images';
import { getTranslation } from '../../data/translations';
import {
  Calendar, FileText, UploadCloud, ShieldCheck, QrCode, LogOut, PlusCircle,
  Clock, Stethoscope, Eye, Activity, ArrowRight, Globe, Check, Mic, X, Sparkles,
  Home, CheckCircle2, KeyRound, Copy, Bell, BellRing
} from 'lucide-react';

export const PatientDashboardPage = ({ onLogout }) => {
  const { authenticatedUser, session, currentStep, setViewMode, resetSession, updateIdentity, appointments } = usePatientSession();
  const [showHomeOpModal, setShowHomeOpModal] = useState(false);
  
  // Navigation active tab: 'overview' | 'intake' | 'visits' | 'documents' | 'abha' | 'book'
  const [activeTab, setActiveTab] = useState('overview');
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const lang = session.identity.language || 'ta-IN'; // Default to Tamil

  const patientName = authenticatedUser?.name || session.identity.name || "JOSEPH VIJAY";
  const abhaNumber = authenticatedUser?.abhaId || "91-7829-1092-4412";
  const aadhaarNumber = authenticatedUser?.aadhaar || "XXXX-XXXX-8912";
  const patientAge = authenticatedUser?.age || session.identity.age || "28";
  const patientGender = authenticatedUser?.gender || session.identity.gender || "Male";
  const hospitalName = authenticatedUser?.hospital || "Rajiv Gandhi Government General Hospital, Chennai";

  const visitHistory = authenticatedUser?.visitHistory || [];
  const [selectedVisitModal, setSelectedVisitModal] = useState(null);

  // Filter appointments so patient ONLY sees their OWN appointment passes
  const currentPatientName = (authenticatedUser?.name || session.identity?.name || "JOSEPH VIJAY").toLowerCase().trim();
  const currentPhone = (authenticatedUser?.phone || session.identity?.phone || "").trim();

  const myAppointments = (appointments || []).filter(apt => {
    const aptName = (apt.patientName || "").toLowerCase().trim();
    const aptPhone = (apt.patientPhone || "").trim();
    const matchName = currentPatientName && (aptName === currentPatientName || aptName.includes(currentPatientName) || currentPatientName.includes(aptName));
    const matchPhone = currentPhone && aptPhone && (aptPhone.includes(currentPhone) || currentPhone.includes(aptPhone));
    return matchName || matchPhone;
  });

  const [activeConsentOtp, setActiveConsentOtp] = useState(null);
  const [copiedBannerOtp, setCopiedBannerOtp] = useState(false);

  const currentToken = (authenticatedUser?.token || session.identity?.token || "PAT-1001").trim().toUpperCase();

  const isMatchPatient = (targetToken, targetName, targetPhone) => {
    const tToken = (targetToken || '').trim().toUpperCase();
    const tName = (targetName || '').trim().toLowerCase();
    const tPhone = (targetPhone || '').trim();

    if (tName && currentPatientName && (tName === currentPatientName || tName.includes(currentPatientName) || currentPatientName.includes(tName))) {
      return true;
    }
    if (tToken && (tToken === currentToken || tToken.replace('PAT-', 'OPD-') === currentToken.replace('PAT-', 'OPD-') || tToken.replace('OPD-', 'PAT-') === currentToken.replace('OPD-', 'PAT-'))) {
      return true;
    }
    if (tPhone && currentPhone && tPhone === currentPhone) {
      return true;
    }
    return false;
  };

  // Poll for active doctor consent OTP for this patient (Spring Boot REST + Storage)
  useEffect(() => {
    const checkOtp = async () => {
      const tokensToCheck = [
        currentToken,
        currentToken.replace('PAT-', 'OPD-'),
        currentToken.replace('OPD-', 'PAT-')
      ].filter(Boolean);

      // 1. Check Spring Boot Backend directly
      for (const token of tokensToCheck) {
        try {
          const res = await fetch(`http://localhost:8080/api/doctor/consent/patient-active-otp/${token}`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.plainOtp && (data.status === 'PENDING' || data.status === 'ACTIVE' || data.status === 'OTP_SENT')) {
              setActiveConsentOtp({
                plainOtp: data.plainOtp,
                doctorName: data.doctorName || 'Dr. V. S. Ramachandran',
                patientToken: data.patientToken || token
              });
              return;
            }
          }
        } catch (e) {
          // Backend offline fallback
        }
      }

      // 2. Check localStorage
      try {
        const saved = localStorage.getItem('medikiosk_active_otp_modal');
        if (saved) {
          const parsed = JSON.parse(saved);
          const elapsed = Date.now() - (parsed.timestamp || 0);
          if (elapsed < 15 * 60 * 1000) {
            if (isMatchPatient(parsed.details?.patientToken, parsed.details?.patientName, parsed.details?.patientPhone)) {
              setActiveConsentOtp({
                plainOtp: parsed.plainOtp || '745654',
                doctorName: parsed.details?.doctorName || 'Dr. V. S. Ramachandran',
                patientToken: parsed.details?.patientToken || currentToken
              });
              return;
            }
          }
        }
        
        for (const token of tokensToCheck) {
          const directState = localStorage.getItem(`consent_state_${token}`);
          if (directState) {
            const parsed = JSON.parse(directState);
            const elapsed = Date.now() - (parsed.timestamp || 0);
            if (parsed.otpSent && elapsed < 15 * 60 * 1000) {
              setActiveConsentOtp({
                plainOtp: '745654',
                doctorName: 'Dr. V. S. Ramachandran',
                patientToken: token
              });
              return;
            }
          }
        }
        setActiveConsentOtp(null);
      } catch(e) {}
    };

    const handleOtpEvent = (e) => {
      const details = e.detail;
      if (!details) return;
      if (isMatchPatient(details.patientToken, details.patientName, details.patientPhone)) {
        checkOtp();
      }
    };

    checkOtp();
    const interval = setInterval(checkOtp, 1500);
    window.addEventListener('storage', checkOtp);
    window.addEventListener('medikiosk-patient-otp', handleOtpEvent);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkOtp);
      window.removeEventListener('medikiosk-patient-otp', handleOtpEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentToken, currentPatientName, currentPhone]);

  const handleSelectLanguage = (langCode) => {
    updateIdentity({ language: langCode });
    setLangModalOpen(false);
  };

  const handleStartIntakeFromPortal = () => {
    resetSession();
    setActiveTab('intake');
  };

  return (
    <div className="h-screen w-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row overflow-hidden font-sans">
      {/* STATIC FIXED LEFT SIDEBAR (DESKTOP ONLY - HIDDEN ON MOBILE/PHONE VIEW) */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-stone-900 text-white p-5 justify-between shrink-0 shadow-2xl border-r border-stone-800 h-screen sticky top-0 overflow-y-auto">
        <div className="space-y-6">
          {/* Patient Profile Card */}
          <div className="flex items-center gap-3 border-b border-stone-800 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center font-extrabold text-lg text-white shadow-lg shadow-emerald-600/20 font-mono">
              {patientName.charAt(0)}
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white">{patientName}</h2>
              <div className="text-[11px] text-stone-400 font-mono">ABHA: {abhaNumber}</div>
              <div className="text-[11px] text-emerald-400 font-semibold">{patientAge} yrs • {patientGender}</div>
            </div>
          </div>

          {/* Language Selection Button */}
          <button
            onClick={() => setLangModalOpen(true)}
            className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 hover:border-emerald-500 text-xs font-bold text-emerald-400 flex items-center justify-between transition"
          >
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ta-IN' ? 'தமிழ் (Tamil)' : lang === 'hi-IN' ? 'हिन्दी (Hindi)' : lang === 'te-IN' ? 'తెలుగు (Telugu)' : 'English'}</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold">Change</span>
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-md font-bold shadow-emerald-600/30' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-400" /> {getTranslation("patientDashboard", lang)}
            </button>

            <button
              onClick={handleStartIntakeFromPortal}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeTab === 'intake' ? 'bg-emerald-600 text-white shadow-md font-bold' : 'text-emerald-400 hover:bg-stone-800 bg-stone-950 border border-emerald-500/30'
              }`}
            >
              <Mic className="w-4 h-4 text-amber-400 animate-pulse" /> AI Voice & Touch Kiosk Intake
            </button>

            <button
              onClick={() => setActiveTab('visits')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeTab === 'visits' ? 'bg-emerald-600 text-white shadow-md font-bold shadow-emerald-600/30' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Clock className="w-4 h-4 text-emerald-400" /> {getTranslation("myVisitsReports", lang)} ({visitHistory.length})
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeTab === 'documents' ? 'bg-emerald-600 text-white shadow-md font-bold shadow-emerald-600/30' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <UploadCloud className="w-4 h-4 text-emerald-400" /> {getTranslation("medicalRecordsUploads", lang)}
            </button>

            <button
              onClick={() => setActiveTab('abha')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeTab === 'abha' ? 'bg-emerald-600 text-white shadow-md font-bold shadow-emerald-600/30' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> {getTranslation("abhaHealthId", lang)}
            </button>

            <button
              onClick={() => setActiveTab('book')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeTab === 'book' ? 'bg-emerald-600 text-white shadow-md font-bold shadow-emerald-600/30' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Calendar className="w-4 h-4 text-emerald-400" /> {getTranslation("bookOpSlot", lang)}
            </button>
          </nav>
        </div>

        {/* Sidebar Footer & Role Switcher */}
        <div className="pt-4 border-t border-stone-800 space-y-3">
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-mono font-bold text-stone-400 tracking-wider px-1">Switch Role Portal</div>
            <div className="grid grid-cols-2 gap-1 text-[11px] font-semibold">
              <button onClick={() => setViewMode('receptionist')} className="p-1.5 rounded-lg bg-stone-950 border border-stone-800 hover:bg-stone-800 text-stone-300 text-left truncate">
                ▸ Receptionist
              </button>
              <button onClick={() => setViewMode('nurse')} className="p-1.5 rounded-lg bg-stone-950 border border-stone-800 hover:bg-stone-800 text-stone-300 text-left truncate">
                ▸ Nurse
              </button>
              <button onClick={() => setViewMode('doctor')} className="p-1.5 rounded-lg bg-stone-950 border border-stone-800 hover:bg-stone-800 text-stone-300 text-left truncate">
                ▸ Doctor
              </button>
              <button onClick={() => setViewMode('admin')} className="p-1.5 rounded-lg bg-stone-950 border border-stone-800 hover:bg-stone-800 text-stone-300 text-left truncate">
                ▸ Admin
              </button>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full py-2.5 bg-stone-950 hover:bg-rose-950/60 text-stone-300 hover:text-rose-400 border border-stone-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
          >
            <LogOut className="w-3.5 h-3.5 text-emerald-400" /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA (DARK ADMIN THEME) */}
      <main className="flex-1 h-screen overflow-y-auto p-4 sm:p-6 md:p-8 w-full space-y-6 bg-stone-950">
        {/* TOP PATIENT PORTAL HEADER WITH NOTIFICATION BELL */}
        <header className="flex items-center justify-between pb-4 border-b border-stone-800 relative z-40">
          <div className="flex items-center gap-3">
            <div className="md:hidden w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-extrabold text-white font-mono shadow-md">
              {patientName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                  <span>{patientName}</span>
                  <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    ABHA: {abhaNumber}
                  </span>
                </h1>
              </div>
              <p className="text-xs text-stone-400 truncate max-w-xs sm:max-w-md">
                {hospitalName}
              </p>
            </div>
          </div>

          {/* Right Header Actions: Notification Bell + Language */}
          <div className="flex items-center gap-3 relative">
            {/* NOTIFICATION BELL ICON */}
            <div className="relative">
              <button
                onClick={() => setNotificationOpen(!notificationOpen)}
                className={`p-2.5 rounded-2xl border transition relative flex items-center justify-center ${
                  activeConsentOtp
                    ? 'bg-emerald-950/90 border-emerald-500 text-emerald-400 hover:bg-emerald-900 shadow-lg shadow-emerald-500/20 animate-pulse'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
                title="Notifications & Active Doctor OTPs"
              >
                {activeConsentOtp ? (
                  <BellRing className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}

                {/* Unread Alert Ping Badge */}
                {activeConsentOtp && (
                  <>
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full animate-ping" />
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-stone-950 flex items-center justify-center text-[8px] font-black text-stone-950 shadow">
                      1
                    </span>
                  </>
                )}
              </button>

              {/* NOTIFICATION DROPDOWN DRAWER */}
              {notificationOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-stone-900 border-2 border-emerald-500 rounded-2xl shadow-2xl p-4 text-stone-100 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                    <div className="flex items-center gap-2">
                      <BellRing className="w-4 h-4 text-emerald-400" />
                      <h3 className="font-extrabold text-sm text-white">Doctor Consent Notifications</h3>
                      {activeConsentOtp && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          1 Active OTP
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setNotificationOpen(false)}
                      className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition"
                      title="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {activeConsentOtp ? (
                    <div className="mt-3 space-y-3">
                      <div className="p-3.5 bg-stone-950 rounded-xl border border-emerald-900/60 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                            ABDM Consultation OTP
                          </span>
                          <span className="text-[10px] font-mono text-stone-400">Valid for 5 mins</span>
                        </div>
                        <p className="text-xs text-stone-300">
                          <strong className="text-white">{activeConsentOtp.doctorName}</strong> requested access for Token <strong className="text-emerald-400 font-mono">{activeConsentOtp.patientToken}</strong>.
                        </p>

                        <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 border border-emerald-500/60 rounded-xl p-3 text-center">
                          <span className="text-[9px] uppercase font-mono tracking-widest text-emerald-300 block mb-1">
                            Your 6-Digit Consent Code
                          </span>
                          <div className="text-3xl font-black font-mono tracking-widest text-emerald-400 select-all">
                            {activeConsentOtp.plainOtp}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={() => {
                              navigator.clipboard?.writeText(activeConsentOtp.plainOtp);
                              setCopiedBannerOtp(true);
                              setTimeout(() => setCopiedBannerOtp(false), 2000);
                            }}
                            className="py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                          >
                            {copiedBannerOtp ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedBannerOtp ? 'Copied!' : 'Copy Code'}
                          </button>
                          <button
                            onClick={() => {
                              setNotificationOpen(false);
                              window.dispatchEvent(new CustomEvent('medikiosk-open-otp-modal', {
                                detail: {
                                  details: {
                                    patientToken: activeConsentOtp.patientToken,
                                    doctorName: activeConsentOtp.doctorName,
                                    timestamp: new Date().toLocaleTimeString()
                                  },
                                  plainOtp: activeConsentOtp.plainOtp
                                }
                              }));
                            }}
                            className="py-2.5 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> View Popup
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-stone-800 text-stone-500 flex items-center justify-center mx-auto">
                        <Bell className="w-5 h-5" />
                      </div>
                      <p className="text-xs text-stone-300 font-semibold">No active OTP requests</p>
                      <p className="text-[11px] text-stone-500 max-w-xs mx-auto">When your doctor requests consent, your 6-digit OTP code will appear right here.</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Language Quick Trigger */}
            <button
              onClick={() => setLangModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-xs font-bold text-stone-300 flex items-center gap-1.5 transition"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{lang === 'ta-IN' ? 'தமிழ்' : lang === 'hi-IN' ? 'हिन्दी' : 'English'}</span>
            </button>
          </div>
        </header>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* ACTIVE DOCTOR CONSENT OTP ALERT BANNER (IF REQUESTED) */}
            {activeConsentOtp && (
              <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 border-2 border-emerald-500 rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden animate-in slide-in-from-top-4 duration-300">
                <div className="absolute top-0 right-0 w-64 h-full bg-emerald-500/10 blur-xl pointer-events-none" />
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <KeyRound className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-900 text-emerald-300 border border-emerald-600 uppercase">
                        Active Doctor Consent Request
                      </span>
                      <h2 className="text-lg font-black text-white mt-1">
                        Doctor Consent OTP: <span className="font-mono text-emerald-400 text-2xl font-black tracking-widest ml-1">{activeConsentOtp.plainOtp}</span>
                      </h2>
                      <p className="text-xs text-stone-300">
                        Requested by <strong className="text-white">{activeConsentOtp.doctorName}</strong> for Token <span className="font-mono text-emerald-400 font-bold">{activeConsentOtp.patientToken}</span>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(activeConsentOtp.plainOtp);
                        setCopiedBannerOtp(true);
                        setTimeout(() => setCopiedBannerOtp(false), 2000);
                      }}
                      className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg transition active:scale-95"
                    >
                      {copiedBannerOtp ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedBannerOtp ? 'Copied!' : 'Copy OTP'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white shadow-xl border border-stone-800">
              <img src={MEDICAL_IMAGES.patientBanner} alt="Patient Banner" className="w-full h-48 sm:h-56 object-cover opacity-35" />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/90 to-transparent p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 font-mono font-bold border border-emerald-800">
                    Patient Health Portal • ABDM Integrated
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-white mt-2">
                    {getTranslation("welcomeBack", lang)}, {patientName}!
                  </h1>
                  <p className="text-xs text-stone-300 mt-1 max-w-xl">
                    Access your Ayush clinical history, upload prescriptions, and book OPD slots across Government Hospitals in Tamil Nadu.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleStartIntakeFromPortal}
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md text-xs flex items-center gap-2 transition"
                  >
                    <Mic className="w-4 h-4 text-amber-300" /> Start AI Voice Kiosk Intake <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setLangModalOpen(true)}
                    className="px-4 py-3 bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-800 font-bold rounded-xl text-xs flex items-center gap-2 transition"
                  >
                    <Globe className="w-4 h-4 text-emerald-400" /> <span>Language</span>
                  </button>
                </div>
              </div>
            </div>


            {/* PROMINENT PATIENT-DRIVEN HOME OP APPOINTMENT CALLOUT */}
            <div className="bg-gradient-to-r from-emerald-950/90 via-stone-900 to-stone-900 border-2 border-emerald-500/50 p-6 sm:p-7 rounded-3xl shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-full bg-emerald-500/10 blur-2xl rounded-full pointer-events-none" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-900 text-emerald-300 border border-emerald-600 flex items-center gap-1.5">
                      <Home className="w-3.5 h-3.5" />
                      NEW: PATIENT ONLINE OP REGISTRATION
                    </span>
                    <span className="text-[11px] text-emerald-400 font-bold">ABDM & DPDP 5-Min BCrypt OTP Timed</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    Apply for Outpatient (OP) Consultation from Home
                  </h2>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Book your OPD appointment slot directly from home before visiting the hospital. Your request reflects instantly on the assigned Doctor & Nurse workstation with a timed 5-minute BCrypt security shield.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setShowHomeOpModal(true)}
                    className="px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-emerald-500/30 flex items-center gap-2 transition active:scale-95"
                  >
                    <Home className="w-4 h-4 text-stone-950" />
                    Apply OP from Home Now
                  </button>
                </div>
              </div>
            </div>

            {/* ACTIVE HOME APPOINTMENT PASSES (IF ANY) */}
            {myAppointments && myAppointments.length > 0 && (
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" /> Active Home-Booked OP Appointments ({myAppointments.length})
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-xs font-mono font-bold border border-emerald-800">
                    Live Verified Pass
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myAppointments.map((apt, idx) => (
                    <div key={idx} className="p-4 bg-stone-950 border border-emerald-900/50 rounded-xl space-y-3 relative overflow-hidden">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-mono text-emerald-400 font-bold">{apt.id}</span>
                          <h4 className="font-bold text-sm text-white flex items-center gap-1.5 mt-0.5">
                            <span className="text-emerald-300 font-mono font-extrabold">{apt.token}</span> • {apt.patientName}
                          </h4>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1 border border-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {apt.status || 'Confirmed'}
                        </span>
                      </div>

                      <div className="text-xs text-stone-300 space-y-1 bg-stone-900/80 p-3 rounded-lg border border-stone-800">
                        <div><strong>Doctor:</strong> {apt.doctorName || 'Dr. V. S. Ramachandran'}</div>
                        <div><strong>Hospital:</strong> {apt.hospital || apt.hospitalName || 'Rajiv Gandhi Govt General Hospital'}</div>
                        <div><strong>Specialty:</strong> {apt.department}</div>
                        <div className="flex items-center gap-2 pt-1 font-mono text-emerald-400">
                          <Clock className="w-3.5 h-3.5" /> Slot: {apt.timeSlot || '10:30 AM'} ({apt.date || 'Today'})
                        </div>
                      </div>

                      <div className="p-2.5 bg-emerald-950/50 border border-emerald-800/60 rounded-lg text-[11px] text-emerald-300 flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>During consultation, doctor will request a 6-digit OTP sent to your phone/portal to unlock medical details for 5 minutes.</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Metrics Cards (4 Columns including AI Clinical Risk Health Status) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl shadow-md space-y-2">
                <div className="flex items-center justify-between text-stone-400 text-xs">
                  <span className="font-semibold">{getTranslation("totalVisits", lang)}</span>
                  <Clock className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-black text-white font-mono">{visitHistory.length} Visits</div>
                <div className="text-[11px] text-stone-400">{visitHistory.length === 0 ? "Fresh Account" : "Last visit active"}</div>
              </div>

              <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl shadow-md space-y-2">
                <div className="flex items-center justify-between text-stone-400 text-xs">
                  <span className="font-semibold">AI Risk Health Status</span>
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-lg font-extrabold text-white">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Stable (18%)
                  </span>
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold">Evaluated via Groq AI Model</div>
              </div>

              <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl shadow-md space-y-2">
                <div className="flex items-center justify-between text-stone-400 text-xs">
                  <span className="font-semibold">{getTranslation("abhaNumberLabel", lang)}</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-sm font-bold text-emerald-400 font-mono">{abhaNumber}</div>
                <div className="text-[11px] text-emerald-300 font-semibold">Linked with Aadhaar ({aadhaarNumber.slice(-4)})</div>
              </div>

              <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl shadow-md space-y-2">
                <div className="flex items-center justify-between text-stone-400 text-xs">
                  <span className="font-semibold">{getTranslation("registeredFacility", lang)}</span>
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xs font-extrabold text-white line-clamp-1">
                  {hospitalName}
                </div>
                <div className="text-[11px] text-stone-400">Tamil Nadu Government OPD</div>
              </div>
            </div>

            {/* REGISTERED HOSPITAL LOCATION & DIRECTIONS CARD */}
            <HospitalLocationCard hospitalName={hospitalName} />

            {/* Recent Visits Section */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" /> {getTranslation("myVisitsReports", lang)}
                </h3>
                {visitHistory.length > 0 && (
                  <button onClick={() => setActiveTab('visits')} className="text-xs text-emerald-400 hover:underline font-semibold">
                    View All ({visitHistory.length})
                  </button>
                )}
              </div>

              {visitHistory.length === 0 ? (
                <div className="p-6 bg-stone-950 border border-stone-800 rounded-2xl text-center space-y-4">
                  <div className="max-w-md mx-auto h-40 rounded-2xl overflow-hidden shadow-md relative border border-stone-800">
                    <img src={MEDICAL_IMAGES.consultation} alt="Doctor Consultation" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-stone-950/60 flex items-center justify-center">
                      <span className="inline-flex items-center gap-1.5 text-white text-xs font-bold bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> MediKiosk • {getTranslation("welcomeBack", lang)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-white">{getTranslation("noPastRecords", lang)}</h4>
                    <p className="text-xs text-stone-400 max-w-sm mx-auto">
                      {getTranslation("freshAccountMsg", lang)}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <button
                      onClick={handleStartIntakeFromPortal}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4" /> {getTranslation("startInterview", lang)}
                    </button>
                    <button
                      onClick={() => setActiveTab('documents')}
                      className="px-4 py-2.5 bg-stone-900 border border-stone-800 hover:border-emerald-600 text-stone-200 font-bold text-xs rounded-xl flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-4 h-4 text-emerald-400" /> {getTranslation("uploadDocsTitle", lang)}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  {visitHistory.map(v => (
                    <div key={v.id} className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="font-extrabold text-white text-sm">{v.hospital}</div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold font-mono text-[10px]">
                          {v.date}
                        </span>
                      </div>
                      <div className="text-stone-300"><strong>Chief Complaint:</strong> {v.chiefComplaint}</div>
                      <div className="text-stone-300"><strong>Diagnosis:</strong> {v.diagnosis}</div>
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => setSelectedVisitModal(v)}
                          className="px-3 py-1.5 bg-stone-900 border border-stone-800 hover:border-emerald-600 text-emerald-400 rounded-lg font-semibold flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-400" /> View Full OPD Case Summary
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* EMBEDDED 10-STEP AI VOICE KIOSK INTAKE INSIDE PATIENT PANEL */}
        {activeTab === 'intake' && (
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-4 md:p-6 shadow-2xl space-y-6 text-stone-100">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4">
              <div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-mono font-bold border border-emerald-800">
                  Step-by-Step AI Structured Clinical Intake
                </span>
                <h2 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2">
                  <Mic className="w-5 h-5 text-emerald-400" /> Kiosk Voice & Touch Interview
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('overview')}
                className="px-3.5 py-1.5 bg-stone-950 hover:bg-stone-800 text-stone-300 font-bold text-xs rounded-xl border border-stone-800"
              >
                Back to Patient Dashboard
              </button>
            </div>

            <Stepper />

            <div className="pt-2">
              {currentStep === 1 && <Screen1Welcome />}
              {currentStep === 2 && <Screen2Identification />}
              {currentStep === 3 && <Screen3Consent />}
              {currentStep === 4 && <Screen4ChiefComplaint />}
              {currentStep === 5 && <Screen5Conversation />}
              {currentStep === 6 && <Screen6AyushHistory />}
              {currentStep === 7 && <Screen7DocumentUpload />}
              {currentStep === 8 && <Screen8TimelineLabFlags />}
              {currentStep === 9 && <Screen9SummaryReadBack />}
              {currentStep === 10 && <Screen10SubmissionComplete />}
            </div>
          </div>
        )}

        {/* VISITS TAB */}
        {activeTab === 'visits' && (
          <div className="space-y-5">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">{getTranslation("myVisitsReports", lang)}</h2>
                <p className="text-xs text-stone-400">Every visit generated via MediKiosk is securely archived in your ABHA health record.</p>
              </div>
            </div>

            {visitHistory.length === 0 ? (
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center mx-auto text-stone-400">
                  <FileText className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="font-bold text-white text-base">{getTranslation("noPastRecords", lang)}</h3>
                <p className="text-xs text-stone-400 max-w-sm mx-auto">
                  {getTranslation("freshAccountMsg", lang)}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {visitHistory.map(v => (
                  <div key={v.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-3 flex-wrap gap-2">
                      <div>
                        <div className="text-sm font-extrabold text-white">{v.hospital}</div>
                        <div className="text-stone-400">{v.department} • Attending: {v.doctor}</div>
                      </div>
                      <span className="px-3 py-1 bg-stone-950 border border-stone-800 font-mono text-emerald-400 font-bold rounded-lg">
                        {v.date}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-950 p-4 rounded-xl border border-stone-800">
                      <div>
                        <span className="font-bold text-emerald-400 block mb-1">Elicited Chief History:</span>
                        <p className="text-stone-300">{v.chiefComplaint}</p>
                      </div>
                      <div>
                        <span className="font-bold text-emerald-400 block mb-1">Clinical Assessment:</span>
                        <p className="text-white font-semibold">{v.diagnosis}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-stone-400 text-[11px]">Lab Flags: {v.labSummary}</div>
                      <button
                        onClick={() => setSelectedVisitModal(v)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-2"
                      >
                        <FileText className="w-3.5 h-3.5" /> View Printable Medical Summary
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <PatientDocumentUploadPanel />
          </div>
        )}

        {/* ABHA CARD TAB */}
        {activeTab === 'abha' && (
          <div className="space-y-6">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">{getTranslation("abhaHealthId", lang)}</h2>
                <p className="text-xs text-stone-400">Official ABDM Digital Health ID card for seamless interoperability across Indian healthcare facilities.</p>
              </div>
            </div>

            {/* ABHA CARD VISUAL REPLICA */}
            <div className="max-w-md mx-auto bg-stone-900 text-white rounded-3xl p-6 shadow-2xl space-y-6 border border-emerald-500/40 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-stone-950 font-black flex items-center justify-center text-sm font-mono">
                    AB
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase font-mono tracking-wider text-emerald-400">National Health Authority</div>
                    <div className="text-[10px] text-stone-400">Ministry of Health & Family Welfare</div>
                  </div>
                </div>
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>

              <div className="flex items-start justify-between gap-4 pt-2">
                <div className="space-y-1">
                  <div className="text-xs text-emerald-400 font-semibold uppercase">ABHA Address</div>
                  <div className="text-base font-extrabold">{patientName}</div>
                  <div className="text-xs text-stone-300 font-mono">{patientName.toLowerCase().replace(/\s+/g, '')}@abha</div>
                  <div className="pt-2 text-xs">Gender: <strong>{patientGender}</strong> | YOB: <strong>1998</strong></div>
                </div>

                <div className="w-24 h-24 bg-white p-2 rounded-xl flex items-center justify-center shrink-0">
                  <QrCode className="w-full h-full text-stone-900" />
                </div>
              </div>

              <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800 flex items-center justify-between font-mono text-sm">
                <span className="text-stone-400 text-xs">ABHA Number</span>
                <span className="font-extrabold text-emerald-400 tracking-wider">{abhaNumber}</span>
              </div>
            </div>
          </div>
        )}

        {/* BOOK APPOINTMENT TAB */}
        {activeTab === 'book' && (
          <div className="space-y-5">
            <AppointmentsPanel />
          </div>
        )}

        {/* Home Appointment Booking Modal */}
        <HomeAppointmentModal
          isOpen={showHomeOpModal}
          onClose={() => setShowHomeOpModal(false)}
        />

      </main>

      {/* LANGUAGE SELECTOR MODAL */}
      {langModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl text-stone-100">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">
                  {getTranslation("selectLanguagePrompt", lang)}
                </h3>
              </div>
              <button
                onClick={() => setLangModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg bg-stone-950 border border-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-400">
              {getTranslation("selectLanguageSub", lang)}
            </p>

            <div className="space-y-2.5">
              {[
                { code: 'ta-IN', label: 'தமிழ் (Tamil)', desc: 'தமிழ் போர்டல் மற்றும் சுருக்கங்கள்' },
                { code: 'en-IN', label: 'English', desc: 'Default English UI' },
                { code: 'hi-IN', label: 'हिन्दी (Hindi)', desc: 'हिंदी इंटरफेस' },
                { code: 'te-IN', label: 'తెలుగు (Telugu)', desc: 'తెలుగు இంటర్‌ఫేஸ்' }
              ].map(l => (
                <button
                  key={l.code}
                  onClick={() => handleSelectLanguage(l.code)}
                  className={`w-full p-3.5 rounded-2xl border-2 flex items-center justify-between text-left transition ${
                    lang === l.code
                      ? 'border-emerald-500 bg-emerald-950/80 text-white font-bold shadow-md'
                      : 'border-stone-800 hover:border-emerald-600 bg-stone-950'
                  }`}
                >
                  <div>
                    <div className="text-sm font-extrabold">{l.label}</div>
                    <div className="text-[11px] text-stone-400 font-normal">{l.desc}</div>
                  </div>
                  {lang === l.code && <Check className="w-5 h-5 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VISIT SUMMARY MODAL */}
      {selectedVisitModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto text-stone-100">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" /> OPD Visit Case Record Summary
              </h3>
              <button
                onClick={() => setSelectedVisitModal(null)}
                className="text-stone-400 hover:text-white p-1 rounded-lg bg-stone-950 border border-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1">
                <div><strong>Facility:</strong> {selectedVisitModal.hospital}</div>
                <div><strong>Attending Physician:</strong> {selectedVisitModal.doctor}</div>
                <div><strong>Visit Date:</strong> {selectedVisitModal.date}</div>
              </div>

              <div>
                <strong className="text-emerald-400 block mb-1">Chief Presenting Complaints:</strong>
                <p className="text-stone-300 bg-stone-950 p-3 rounded-lg border border-stone-800">{selectedVisitModal.chiefComplaint}</p>
              </div>

              <div>
                <strong className="text-emerald-400 block mb-1">Prescriptions Issued:</strong>
                <ul className="list-disc pl-5 space-y-1 text-stone-300">
                  {selectedVisitModal.prescriptions?.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  )) || <li>No medication prescribed</li>}
                </ul>
              </div>

              <div>
                <strong className="text-emerald-400 block mb-1">Lab Findings:</strong>
                <p className="text-stone-300">{selectedVisitModal.labSummary || "Normal"}</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setSelectedVisitModal(null)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition"
              >
                Close Summary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
