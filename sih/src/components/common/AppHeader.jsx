import React, { useState } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { AadhaarAuthModal } from '../auth/AadhaarAuthModal';
import { Plus, User, Stethoscope, Activity, Zap, HeartHandshake, ShieldCheck, Calendar, Smartphone, Monitor, AlertTriangle, Leaf } from 'lucide-react';

export const AppHeader = ({ onOpenSystemModal }) => {
  const { session, updateIdentity, viewMode, setViewMode, deviceFrame, setDeviceFrame, loadPreset, doctorQueue, authenticatedUser } = usePatientSession();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <header className="bg-white border-b border-kiosk-border sticky top-0 z-40 shadow-xs">
      <div className="w-full px-4 sm:px-8 py-2.5 flex items-center justify-between flex-wrap gap-2">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-kiosk-teal flex items-center justify-center text-white font-black text-xl shadow-xs">
            <Plus className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-kiosk-text">MediKiosk</span>
              <span className="text-xs px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-medium border border-stone-200">
                SIH26047
              </span>
              {session.identity.ayushMode && (
                <span className="text-xs px-2 py-0.5 rounded bg-kiosk-ayush-light text-kiosk-ayush font-semibold border border-kiosk-ayush/20">
                  🌿 AYUSH Mode
                </span>
              )}
              {authenticatedUser && (
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Aadhaar Verified
                </span>
              )}
            </div>
            <p className="text-xs text-kiosk-muted">AIIA / Ministry of AYUSH • AI First-Mile Clinical Intake Platform</p>
          </div>
        </div>

        {/* Quick Controls & View Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Aadhaar Auth Button */}
          <button
            onClick={() => setAuthModalOpen(true)}
            className="text-xs px-2.5 py-1.5 rounded-lg border font-semibold bg-white text-kiosk-teal border-kiosk-teal/40 hover:bg-kiosk-teal-light transition flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{authenticatedUser ? authenticatedUser.name : "Aadhaar Auth"}</span>
          </button>

          {/* Nurse Assistance Toggle */}
          <button
            onClick={() => updateIdentity({ nurseAssisted: !session.identity.nurseAssisted })}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition ${
              session.identity.nurseAssisted
                ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-xs'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
            title="Toggle Nurse Assistance Mode"
          >
            <HeartHandshake className="w-4 h-4 text-amber-600" />
            <span className="hidden md:inline">Nurse Assist</span>
          </button>

          {/* Phone / Kiosk Viewport Ratio Toggle */}
          <button
            onClick={() => setDeviceFrame(prev => prev === 'mobile' ? 'desktop' : 'mobile')}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition ${
              deviceFrame === 'mobile'
                ? 'bg-stone-800 text-white border-stone-800 shadow-xs'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
            title="Toggle Phone Kiosk Frame Viewport"
          >
            {deviceFrame === 'mobile' ? <Smartphone className="w-3.5 h-3.5 text-amber-400" /> : <Monitor className="w-3.5 h-3.5 text-stone-500" />}
            <span className="hidden lg:inline">{deviceFrame === 'mobile' ? "Phone Kiosk" : "Desktop View"}</span>
          </button>

          {/* Quick Presets Dropdown */}
          <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-lg border border-stone-200">
            <span className="text-xs font-semibold px-2 text-stone-500 hidden sm:inline flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Demo:
            </span>
            <button
              onClick={() => loadPreset('chest_redflag')}
              className="text-xs px-2 py-1 bg-white hover:bg-stone-50 rounded text-kiosk-alert font-semibold border border-stone-200 transition flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Red-Flag
            </button>
            <button
              onClick={() => loadPreset('ayush_prakriti')}
              className="text-xs px-2 py-1 bg-white hover:bg-stone-50 rounded text-kiosk-ayush font-semibold border border-stone-200 transition flex items-center gap-1"
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-600" /> AYUSH
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="inline-flex rounded-lg border border-kiosk-border p-0.5 bg-stone-50 overflow-x-auto max-w-full">
            <button
              onClick={() => {
                setViewMode('login');
                window.history.pushState(null, '', '/login');
              }}
              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1 ${
                viewMode === 'login'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setViewMode('kiosk');
                window.history.pushState(null, '', '/kiosk');
              }}
              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1 ${
                viewMode === 'kiosk'
                  ? 'bg-kiosk-teal text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <User className="w-3.5 h-3.5" /> Kiosk
            </button>
            <button
              onClick={() => {
                setViewMode('patient-portal');
                window.history.pushState(null, '', '/patient');
              }}
              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1 ${
                viewMode === 'patient-portal'
                  ? 'bg-kiosk-teal text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Patient Portal
            </button>
            <button
              onClick={() => {
                setViewMode('nurse');
                window.history.pushState(null, '', '/nurse');
              }}
              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1 ${
                viewMode === 'nurse'
                  ? 'bg-kiosk-teal text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Nurse
            </button>
            <button
              onClick={() => {
                setViewMode('receptionist');
                window.history.pushState(null, '', '/receptionist');
              }}
              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1 ${
                viewMode === 'receptionist'
                  ? 'bg-kiosk-teal text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Receptionist
            </button>
            <button
              onClick={() => {
                setViewMode('doctor');
                window.history.pushState(null, '', '/doctor');
              }}
              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1 ${
                viewMode === 'doctor'
                  ? 'bg-kiosk-teal text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" /> Doctor
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-stone-200 text-stone-700">
                {doctorQueue.length}
              </span>
            </button>
            <button
              onClick={() => {
                setViewMode('admin');
                window.history.pushState(null, '', '/admin');
              }}
              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1 ${
                viewMode === 'admin'
                  ? 'bg-kiosk-teal text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              CMCELL Desk
            </button>
            <button
              onClick={() => {
                setViewMode('appointments');
                window.history.pushState(null, '', '/appointments');
              }}
              className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1 ${
                viewMode === 'appointments'
                  ? 'bg-kiosk-teal text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Slots
            </button>
          </div>

          <button
            onClick={onOpenSystemModal}
            className="p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition border border-stone-200"
            title="System & AI Status"
          >
            <Activity className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      </div>

      <AadhaarAuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
};
