import React, { useState } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { AadhaarAuthModal } from '../auth/AadhaarAuthModal';
import { AndroidLeftDrawer } from './AndroidLeftDrawer';
import { Plus, Activity, HeartHandshake, ShieldCheck, Smartphone, Monitor, Leaf, Menu } from 'lucide-react';

export const AppHeader = ({ onOpenSystemModal }) => {
  const { session, updateIdentity, viewMode, setViewMode, deviceFrame, setDeviceFrame, doctorQueue, authenticatedUser } = usePatientSession();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navigateToPortal = (path, mode) => {
    setViewMode(mode);
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  };

  return (
    <>
      <header className="bg-stone-950 text-white border-b border-stone-800 sticky top-0 z-40 shadow-md">
        <div className="w-full px-3 sm:px-8 py-3 flex items-center justify-between flex-wrap gap-2">
          {/* Brand Logo & Title + Mobile Hamburger Button */}
          <div className="flex items-center gap-3">
            {/* Top Bar Button for Mobile Phone Left Sidebar (ONLY ON PHONE / MOBILE APP VIEW) */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="px-2.5 py-1.5 rounded-xl bg-stone-900 text-emerald-400 hover:bg-stone-800 transition border border-stone-800 md:hidden flex items-center gap-1.5 font-bold text-xs shadow-xs"
              aria-label="Open Mobile Navigation Sidebar"
            >
              <Menu className="w-5 h-5 text-emerald-400" />
              <span>Menu</span>
            </button>

            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-stone-950 font-black text-xl shadow-lg shadow-emerald-500/20 font-mono">
              <Plus className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">MediKiosk</span>
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 font-mono font-bold border border-emerald-800">
                  SIH26047
                </span>
                {session.identity.ayushMode && (
                  <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 font-semibold border border-emerald-700/60 flex items-center gap-1">
                    <Leaf className="w-3 h-3 text-emerald-400" /> AYUSH
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-xs text-stone-400 hidden sm:block">AIIA / Ministry of AYUSH • AI First-Mile Clinical Intake Platform</p>
            </div>
          </div>

          {/* Desktop Controls & View Switcher (Webpage View) */}
          <div className="hidden md:flex items-center gap-2 flex-wrap">
            {/* Aadhaar Auth Button */}
            <button
              onClick={() => setAuthModalOpen(true)}
              className="text-xs px-3 py-1.5 rounded-xl border font-semibold bg-stone-900 text-emerald-400 border-stone-800 hover:border-emerald-500 transition flex items-center gap-1.5 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{authenticatedUser ? authenticatedUser.name : "Aadhaar Auth"}</span>
            </button>

            {/* Nurse Assistance Toggle */}
            <button
              onClick={() => updateIdentity({ nurseAssisted: !session.identity.nurseAssisted })}
              className={`text-xs px-3 py-1.5 rounded-xl border font-semibold flex items-center gap-1.5 transition ${
                session.identity.nurseAssisted
                  ? 'bg-amber-950/80 text-amber-300 border-amber-600 shadow-xs'
                  : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800'
              }`}
            >
              <HeartHandshake className="w-4 h-4 text-amber-400" />
              <span>Nurse Assist</span>
            </button>


            {/* View Mode Switcher */}
            <div className="inline-flex rounded-xl border border-stone-800 p-1 bg-stone-900 overflow-x-auto max-w-full">
              <button onClick={() => navigateToPortal('/login', 'login')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${viewMode === 'login' ? 'bg-emerald-600 text-white font-bold' : 'text-stone-300 hover:text-white'}`}>Sign In</button>
              <button onClick={() => navigateToPortal('/kiosk', 'kiosk')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${viewMode === 'kiosk' ? 'bg-emerald-600 text-white font-bold' : 'text-stone-300 hover:text-white'}`}>Kiosk</button>
              <button onClick={() => navigateToPortal('/patient', 'patient-portal')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${viewMode === 'patient-portal' ? 'bg-emerald-600 text-white font-bold' : 'text-stone-300 hover:text-white'}`}>Patient</button>
              <button onClick={() => navigateToPortal('/nurse', 'nurse')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${viewMode === 'nurse' ? 'bg-emerald-600 text-white font-bold' : 'text-stone-300 hover:text-white'}`}>Nurse</button>
              <button onClick={() => navigateToPortal('/receptionist', 'receptionist')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${viewMode === 'receptionist' ? 'bg-emerald-600 text-white font-bold' : 'text-stone-300 hover:text-white'}`}>Receptionist</button>
              <button onClick={() => navigateToPortal('/doctor', 'doctor')} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${viewMode === 'doctor' ? 'bg-emerald-600 text-white font-bold' : 'text-stone-300 hover:text-white'}`}>Doctor ({doctorQueue.length})</button>
            </div>

            <button onClick={onOpenSystemModal} className="p-2 rounded-xl text-stone-400 hover:bg-stone-900 border border-stone-800 hover:text-white transition">
              <Activity className="w-4 h-4 text-emerald-400" />
            </button>
          </div>

          {/* Mobile Right Status Action */}
          <div className="flex md:hidden items-center gap-2">
            <button onClick={() => setAuthModalOpen(true)} className="p-1.5 px-2.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Aadhaar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile-Only Slide-Out Android Navigation Drawer (Matching User Screenshot media_1788784918423.jpg) */}
      <AndroidLeftDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
      />

      <AadhaarAuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};
