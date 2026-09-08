import React, { useState, useEffect } from 'react';
import './App.css';
import { PatientSessionProvider, usePatientSession } from './context/PatientSessionContext';
import { AppHeader } from './components/common/AppHeader';
import { AppFooter } from './components/common/AppFooter';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { CookieConsentModal } from './components/common/CookieConsentModal';
import { Stepper } from './components/common/Stepper';
import { RedFlagBanner } from './components/common/RedFlagBanner';
import { SystemStatusModal } from './components/common/SystemStatusModal';
import { AppointmentsPanel } from './components/appointment/AppointmentsPanel';

// Pages
import { CareTrackLoginPage } from './pages/auth/CareTrackLoginPage';
import { OnlineRegisterPage } from './pages/auth/OnlineRegisterPage';
import { PatientDashboardPage } from './pages/patient/PatientDashboardPage';
import { NursePortalPage } from './pages/nurse/NursePortalPage';
import { AdminOfflineOpPage } from './pages/admin/AdminOfflineOpPage';
import { ReceptionistPortalPage } from './pages/receptionist/ReceptionistPortalPage';
import { DoctorPortalPage } from './pages/doctor/DoctorPortalPage';

// Patient Kiosk Panels
import { Screen1Welcome } from './components/patient/Screen1Welcome';
import { Screen2Identification } from './components/patient/Screen2Identification';
import { Screen3Consent } from './components/patient/Screen3Consent';
import { Screen4ChiefComplaint } from './components/patient/Screen4ChiefComplaint';
import { Screen5Conversation } from './components/patient/Screen5Conversation';
import { Screen6AyushHistory } from './components/patient/Screen6AyushHistory';
import { Screen7DocumentUpload } from './components/patient/Screen7DocumentUpload';
import { Screen8TimelineLabFlags } from './components/patient/Screen8TimelineLabFlags';
import { Screen9SummaryReadBack } from './components/patient/Screen9SummaryReadBack';
import { Screen10SubmissionComplete } from './components/patient/Screen10SubmissionComplete';

// Doctor Station Panels
import { Screen16FhirModal } from './components/doctor/Screen16FhirModal';
import { ReinterviewModal } from './components/doctor/ReinterviewModal';

const MainAppContent = () => {
  const { viewMode, setViewMode, deviceFrame, currentStep, doctorQueue, setDoctorQueue } = usePatientSession();
  const [systemModalOpen, setSystemModalOpen] = useState(false);
  const [fhirModalOpen, setFhirModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  // Sync URL Path with View Mode
  const navigateTo = (path, mode) => {
    setViewMode(mode);
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/patient') setViewMode('patient-portal');
      else if (path === '/register') setViewMode('register');
      else if (path === '/login' || path === '/') setViewMode('login');
      else if (path === '/doctor') setViewMode('doctor');
      else if (path === '/nurse') setViewMode('nurse');
      else if (path === '/admin') setViewMode('admin');
      else if (path === '/receptionist') setViewMode('receptionist');
      else if (path === '/appointments') setViewMode('appointments');
      else if (path === '/kiosk') setViewMode('kiosk');
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setViewMode]);

  const [selectedPatientToken, setSelectedPatientToken] = useState(
    doctorQueue.length > 0 ? doctorQueue[0].token : null
  );

  const activePatient = doctorQueue.find(p => p.token === selectedPatientToken) || doctorQueue[0];

  const [editableHpi, setEditableHpi] = useState(activePatient?.summaryText || "");
  const [editableCc, setEditableCc] = useState(activePatient?.chiefComplaint || "");

  const handleSelectPatientFromQueue = (patient) => {
    setSelectedPatientToken(patient.token);
    setEditableHpi(patient.summaryText || "");
    setEditableCc(patient.chiefComplaint || "");
  };

  const handleAcceptSummary = () => {
    setDoctorQueue(prev => prev.map(p => p.token === activePatient.token ? { ...p, status: 'confirmed' } : p));
    alert(`Summary for ${activePatient.name} accepted and confirmed into EHR record.`);
  };

  const handleSaveEdits = () => {
    setDoctorQueue(prev => prev.map(p => p.token === activePatient.token ? { ...p, summaryText: editableHpi, chiefComplaint: editableCc, status: 'doctor-edited' } : p));
    alert("Doctor edits saved successfully.");
  };

  const handleConfirmReject = (reason) => {
    setDoctorQueue(prev => prev.map(p => p.token === activePatient.token ? { ...p, status: 'rejected' } : p));
    alert(`Patient ${activePatient.name} sent for re-interview. Reason: ${reason}`);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col justify-between">
      {/* Full-Page Views or Main Workspace */}
      {viewMode === 'login' ? (
        <CareTrackLoginPage
          onNavigateRegister={() => navigateTo('/register', 'register')}
          onLoginSuccess={(role) => {
            if (role === 'admin') navigateTo('/admin', 'admin');
            else if (role === 'receptionist') navigateTo('/receptionist', 'receptionist');
            else if (role === 'doctor') navigateTo('/doctor', 'doctor');
            else if (role === 'nurse') navigateTo('/nurse', 'nurse');
            else navigateTo('/patient', 'patient-portal');
          }}
        />
      ) : viewMode === 'register' ? (
        <OnlineRegisterPage
          onNavigateLogin={() => navigateTo('/login', 'login')}
          onRegisterSuccess={() => navigateTo('/patient', 'patient-portal')}
        />
      ) : (
        <div className="min-h-screen w-full bg-stone-100 flex flex-col pb-16 md:pb-0">
          <AppHeader onOpenSystemModal={() => setSystemModalOpen(true)} />
          <RedFlagBanner />

          <div className="flex-1 w-full flex flex-col">
            {viewMode === 'kiosk' ? (
              <div className={`flex-1 flex flex-col mx-auto w-full transition-all duration-300 ${
                deviceFrame === 'mobile'
                  ? 'max-w-md border-8 border-stone-800 rounded-3xl p-3 bg-stone-100 shadow-2xl my-2'
                  : 'w-full max-w-6xl p-4'
              }`}>
                <Stepper />
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
            ) : viewMode === 'patient-portal' ? (
              <PatientDashboardPage
                onLogout={() => navigateTo('/login', 'login')}
              />
            ) : viewMode === 'receptionist' ? (
              <ReceptionistPortalPage
                onLogout={() => navigateTo('/login', 'login')}
              />
            ) : viewMode === 'appointments' ? (
              <div className="p-4 md:p-8 flex-1">
                <AppointmentsPanel />
              </div>
            ) : viewMode === 'nurse' ? (
              <NursePortalPage
                onLogout={() => navigateTo('/login', 'login')}
              />
            ) : viewMode === 'admin' ? (
              <AdminOfflineOpPage
                onLogout={() => navigateTo('/login', 'login')}
              />
            ) : (
              <DoctorPortalPage
                onLogout={() => navigateTo('/login', 'login')}
              />
            )}
          </div>

          {/* Desktop Web Footer */}
          <div className="hidden md:block">
            <AppFooter onNavigate={(path) => {
              if (path === '/patient') navigateTo('/patient', 'patient-portal');
              else if (path === '/kiosk') navigateTo('/kiosk', 'kiosk');
              else if (path === '/doctor') navigateTo('/doctor', 'doctor');
              else if (path === '/nurse') navigateTo('/nurse', 'nurse');
              else if (path === '/admin') navigateTo('/admin', 'admin');
            }} />
          </div>

          {/* Native Mobile Bottom Navigation Bar */}
          <MobileBottomNav
            viewMode={viewMode}
            onNavigate={(path, mode) => navigateTo(path, mode)}
          />
        </div>
      )}

      {/* Global Modals */}
      <CookieConsentModal />
      <SystemStatusModal isOpen={systemModalOpen} onClose={() => setSystemModalOpen(false)} />
      <Screen16FhirModal isOpen={fhirModalOpen} onClose={() => setFhirModalOpen(false)} activePatient={activePatient} />
      <ReinterviewModal isOpen={rejectModalOpen} onClose={() => setRejectModalOpen(false)} onConfirmReject={handleConfirmReject} />
    </div>
  );
};

export default function App() {
  return (
    <PatientSessionProvider>
      <MainAppContent />
    </PatientSessionProvider>
  );
}
