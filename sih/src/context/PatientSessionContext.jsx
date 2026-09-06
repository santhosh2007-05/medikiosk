import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_PATIENTS, TAMIL_ACTORS_PATIENTS } from '../data/demoPatients';

const initialSession = {
  identity: {
    name: "",
    age: "",
    gender: "Male",
    language: "en-IN",
    ayushMode: false,
    nurseAssisted: false,
    consentGiven: false,
    token: "OPD-" + Math.floor(100 + Math.random() * 900)
  },
  conversationalHistory: {
    chiefComplaint: "",
    qaPairs: [],
    hpi: {
      site: "Not reported",
      onset: "Not reported",
      character: "Not reported",
      radiation: "Not reported",
      associated: "Not reported",
      timing: "Not reported",
      exacerbating: "Not reported",
      severity: "Not reported"
    },
    ayushParameters: {
      prakriti: "Not reported",
      agni: "Not reported",
      koshtha: "Not reported",
      sleep: "Samyak (6-8h refreshing)",
      exercise: "Moderate (Walking/Yoga)"
    },
    redFlag: false,
    redFlagTriggers: []
  },
  documents: [], // INITIALIZED TO EMPTY ARRAY - NO PRE-LOADED DOCUMENTS
  summary: {
    generatedText: "",
    status: "draft",
    fhirBundle: {}
  }
};

const PatientSessionContext = createContext(null);

export const PatientSessionProvider = ({ children }) => {
  const [session, setSession] = useState(initialSession);
  const [currentStep, setCurrentStep] = useState(1);
  const [viewMode, setViewMode] = useState('kiosk'); // 'kiosk' | 'doctor' | 'appointments'
  const [deviceFrame, setDeviceFrame] = useState('desktop'); // 'desktop' | 'mobile'
  const [activeDoctorTab, setActiveDoctorTab] = useState('summary');
  const [authenticatedUser, setAuthenticatedUser] = useState(null); // Aadhaar auth user profile

  const [appointments, setAppointments] = useState([
    {
      id: "APT-101",
      patientName: "JOSEPH VIJAY",
      doctorName: "Dr. V. S. Ramachandran",
      department: "Ayurveda OPD Room #4",
      date: "2026-09-07",
      timeSlot: "10:30 AM",
      status: "Confirmed",
      type: "First Visit"
    },
    {
      id: "APT-102",
      patientName: "Malarvizhi K.",
      doctorName: "Dr. V. S. Ramachandran",
      department: "Ayurveda OPD Room #4",
      date: "2026-09-07",
      timeSlot: "11:15 AM",
      status: "Confirmed",
      type: "Follow-up"
    }
  ]);

  const [doctorQueue, setDoctorQueue] = useState(TAMIL_ACTORS_PATIENTS);

  useEffect(() => {
    fetch("http://localhost:8080/api/doctor/queue")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setDoctorQueue(data);
        }
      })
      .catch(err => console.log("Backend offline or loading, using local TAMIL_ACTORS_PATIENTS fallback:", err));
  }, []);

  const updateIdentity = (data) => {
    setSession(prev => ({
      ...prev,
      identity: { ...prev.identity, ...data }
    }));
  };

  const updateHistory = (data) => {
    setSession(prev => ({
      ...prev,
      conversationalHistory: { ...prev.conversationalHistory, ...data }
    }));
  };

  const addDocument = (doc) => {
    setSession(prev => ({
      ...prev,
      documents: [...prev.documents, doc]
    }));
  };

  const clearDocuments = () => {
    setSession(prev => ({
      ...prev,
      documents: []
    }));
  };

  const updateSummary = (data) => {
    setSession(prev => ({
      ...prev,
      summary: { ...prev.summary, ...data }
    }));
  };

  const addAppointment = (aptData) => {
    const newApt = {
      id: "APT-" + Math.floor(100 + Math.random() * 900),
      status: "Confirmed",
      ...aptData
    };
    setAppointments(prev => [newApt, ...prev]);
    return newApt;
  };

  const loadPreset = (presetKey) => {
    if (DEMO_PATIENTS[presetKey]) {
      const preset = DEMO_PATIENTS[presetKey];
      setSession(JSON.parse(JSON.stringify(preset)));
      if (presetKey === 'chest_redflag') setCurrentStep(9);
      if (presetKey === 'ayush_prakriti') setCurrentStep(6);
    }
  };

  const resetSession = () => {
    setSession({
      ...initialSession,
      identity: {
        ...initialSession.identity,
        token: "OPD-" + Math.floor(100 + Math.random() * 900)
      },
      documents: [] // CLEAR DOCUMENTS ON NEW SESSION RESET
    });
    setCurrentStep(1);
  };

  return (
    <PatientSessionContext.Provider value={{
      session,
      setSession,
      currentStep,
      setCurrentStep,
      viewMode,
      setViewMode,
      deviceFrame,
      setDeviceFrame,
      activeDoctorTab,
      setActiveDoctorTab,
      doctorQueue,
      setDoctorQueue,
      appointments,
      setAppointments,
      addAppointment,
      authenticatedUser,
      setAuthenticatedUser,
      updateIdentity,
      updateHistory,
      addDocument,
      clearDocuments,
      updateSummary,
      loadPreset,
      resetSession
    }}>
      {children}
    </PatientSessionContext.Provider>
  );
};

export const usePatientSession = () => useContext(PatientSessionContext);
