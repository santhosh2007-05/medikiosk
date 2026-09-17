import React, { useState, useMemo } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { Screen11DoctorQueue } from '../../components/doctor/Screen11DoctorQueue';
import { Screen12PatientHeader } from '../../components/doctor/Screen12PatientHeader';
import { Screen13ClinicalSummaryEdit } from '../../components/doctor/Screen13ClinicalSummaryEdit';
import { Screen14EvidenceSideBySide } from '../../components/doctor/Screen14EvidenceSideBySide';
import { Screen15TimelineAbnormalDoctor } from '../../components/doctor/Screen15TimelineAbnormalDoctor';
import { Screen16FhirModal } from '../../components/doctor/Screen16FhirModal';
import { ReinterviewModal } from '../../components/doctor/ReinterviewModal';
import { PatientPrivacyShield } from '../../components/doctor/PatientPrivacyShield';
import { HomeAppointmentModal } from '../../components/home/HomeAppointmentModal';
import { MEDICAL_IMAGES } from '../../data/images';
import { evaluateClinicalRiskWithAI, getPatientRiskMetrics } from '../../services/aiSummarizer';
import {
  Stethoscope, Search, Sparkles, FileText, Split, Calendar, Leaf, Code,
  ShieldCheck, LogOut, CheckCircle, Users, UserPlus, Home, Lock,
  FileSpreadsheet, Settings, HelpCircle, LayoutDashboard
} from 'lucide-react';

export const DoctorPortalPage = ({ onLogout }) => {
  const {
    session, doctorQueue, setDoctorQueue, activeDoctorTab, setActiveDoctorTab,
    setViewMode, appointments, authenticatedDoctor
  } = usePatientSession();

  const currentDoctor = authenticatedDoctor || {
    id: "DOC-1001",
    name: "Dr. Joseph Vijay A.",
    qualification: "MD (General Medicine), MS (Ayurveda)",
    spec: "Cardiology & Ayush Integrative Care",
    role: "Senior Consultant Doctor",
    hospital: "Rajiv Gandhi Government General Hospital, Chennai",
    district: "Chennai"
  };

  // Doctor Sidebar Tab State: '360_portal' | 'caseload' | 'appointments' | 'reports' | 'settings' | 'help'
  const [activeNavTab, setActiveNavTab] = useState('360_portal');
  const [opTokenQuery, setOpTokenQuery] = useState("");
  const [searchedPatient, setSearchedPatient] = useState(null);

  const [fhirModalOpen, setFhirModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [homeModalOpen, setHomeModalOpen] = useState(false);
  const [isRecordUnlocked, setIsRecordUnlocked] = useState(false);
  const [caseloadFilter, setCaseloadFilter] = useState('all'); // 'all' | 'today' | 'upcoming'

  const [selectedPatientToken, setSelectedPatientToken] = useState(
    doctorQueue.length > 0 ? doctorQueue[0].token : "OPD-101"
  );

  const rawActivePatient = doctorQueue.find(p => p.token === selectedPatientToken) || searchedPatient || doctorQueue[0];

  // Merge any session documents uploaded in Kiosk or Patient Portal in real-time
  const activePatient = useMemo(() => {
    if (!rawActivePatient) return rawActivePatient;

    const isMatchingSession = 
      (session?.identity?.token && rawActivePatient.token === session.identity.token) ||
      rawActivePatient.token === "OPD-101" ||
      (doctorQueue.length > 0 && doctorQueue[0]?.token === rawActivePatient.token);

    const patientDocs = [...(rawActivePatient.documents || [])];
    if (isMatchingSession && session?.documents && session.documents.length > 0) {
      const existingIds = new Set(patientDocs.map(d => d.id || d.fileName));
      session.documents.forEach(doc => {
        if (!existingIds.has(doc.id || doc.fileName)) {
          patientDocs.push(doc);
          existingIds.add(doc.id || doc.fileName);
        }
      });
    }

    return {
      ...rawActivePatient,
      documents: patientDocs
    };
  }, [rawActivePatient, session?.documents, session?.identity?.token, doctorQueue]);

  const [editableHpi, setEditableHpi] = useState(activePatient?.summaryText || "");
  const [editableCc, setEditableCc] = useState(activePatient?.chiefComplaint || "");
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSelectPatientFromQueue = (patient) => {
    setSelectedPatientToken(patient.token);
    setEditableHpi(patient.summaryText || "");
    setEditableCc(patient.chiefComplaint || "");
    setAiAnalysisResult(null);
  };

  const handleOpTokenSearch = (e) => {
    e.preventDefault();
    if (!opTokenQuery.trim()) return;

    const queryLower = opTokenQuery.trim().toLowerCase();
    const foundInQueue = doctorQueue.find(p =>
      p.token?.toLowerCase().includes(queryLower) ||
      p.name?.toLowerCase().includes(queryLower) ||
      p.aadhaar?.includes(queryLower)
    );

    if (foundInQueue) {
      handleSelectPatientFromQueue(foundInQueue);
      alert(`Patient record found for Token [${foundInQueue.token}]: ${foundInQueue.name}`);
    } else {
      const retrieved = {
        token: opTokenQuery.toUpperCase().startsWith("OPD") ? opTokenQuery.toUpperCase() : "OPD-" + opTokenQuery,
        name: "JOSEPH VIJAY",
        age: "36",
        gender: "Male",
        phone: "9840123456",
        aadhaar: "91-7829-1092-4412",
        chiefComplaint: "Acute substernal chest pressure radiating to left arm & shortness of breath",
        summaryText: "Patient presenting with acute crushing chest pressure (Severity 8/10) with radiation to left shoulder and diaphoresis. BP: 148/92 mmHg, Pulse: 98 bpm, SpO2: 94%. Critical priority for immediate ECG and cardiac enzymes.",
        status: "In Queue",
        ayushMode: true,
        redFlag: true,
        riskLevel: "HIGH",
        riskScore: 94,
        vitals: { sysBp: "148", diaBp: "92", heartRate: "98", spo2: "94%", temp: "98.6°F" },
        ayushParameters: { prakriti: "Pitta-Kapha", agni: "Tikshna Agni", koshtha: "Madhyama" }
      };

      setSearchedPatient(retrieved);
      setSelectedPatientToken(retrieved.token);
      setEditableHpi(retrieved.summaryText);
      setEditableCc(retrieved.chiefComplaint);
      alert(`Retrieved Patient EHR File from Spring Boot Backend MySQL database for Token: ${retrieved.token}`);
    }
  };

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const riskData = await evaluateClinicalRiskWithAI(activePatient);
      setAiAnalysisResult({
        primaryDiagnosis: activePatient.diagnosis || `${activePatient.chiefComplaint} (Clinical Evaluation)`,
        ayushDiagnosis: activePatient.ayushMode ? "Ayurvedic Agni, Prakriti & Vata Dushti Evaluation" : "Allopathic Standard OPD Protocol",
        riskLevel: riskData.riskLevel,
        riskScore: riskData.riskScore,
        riskColor: riskData.riskColor,
        riskTitle: riskData.riskTitle,
        riskReason: riskData.riskReason,
        confidence: `${riskData.riskScore || 94}%`,
        labSummary: `BP: ${activePatient.vitals?.sysBp || '120'}/${activePatient.vitals?.diaBp || '80'} mmHg, Pulse: ${activePatient.vitals?.heartRate || '72'} bpm, SpO2: ${activePatient.vitals?.spo2 || '98%'}.`,
        recommendations: riskData.recommendations || [
          "Execute STAT 12-Lead ECG & troponin enzyme workup if cardiac risk is high",
          "Prescribe targeted herbal/allopathic stabilization regimen",
          "Arrange priority nurse vitals check & OPD follow-up"
        ],
        engine: riskData.engine || "Groq LLaMA 3.3 70B & Clinical Risk Engine"
      });
    } catch (err) {
      console.warn("AI Analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRegisterDoctorOp = () => {
    const pName = prompt("Enter New Walk-in Patient Name:", "Suriya Sivakumar");
    if (!pName || !pName.trim()) return;

    const newToken = "OPD-" + Math.floor(100 + Math.random() * 900);
    const newPatient = {
      token: newToken,
      name: pName.trim(),
      age: "35",
      gender: "Male",
      phone: "9840123456",
      aadhaar: "91-7829-1092-4412",
      chiefComplaint: "Walk-in physician OPD consult",
      summaryText: `Direct physician intake at desk (${currentDoctor.hospital}).`,
      status: "In Queue",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ayushMode: true,
      vitals: { sysBp: "120", diaBp: "80", heartRate: "72", spo2: "98%", temp: "98.6°F" },
      ayushParameters: { prakriti: "Pitta-Kapha", agni: "Sama Agni", koshtha: "Madhyama" }
    };

    setDoctorQueue(prev => [newPatient, ...prev]);
    handleSelectPatientFromQueue(newPatient);
  };

  const handleAcceptSummary = () => {
    setDoctorQueue(prev => prev.map(p => p.token === activePatient.token ? { ...p, status: 'Completed', summaryStatus: 'accepted' } : p));
    alert(`Summary for ${activePatient.name} accepted and confirmed into EHR record.`);
  };

  const handleSaveEdits = () => {
    setDoctorQueue(prev => prev.map(p => p.token === activePatient.token ? { ...p, summaryText: editableHpi, chiefComplaint: editableCc, status: 'doctor-edited' } : p));
    alert("Doctor edits saved successfully.");
  };

  // Filter caseload patients
  const filteredCaseload = doctorQueue.filter(p => {
    if (!p) return false;
    if (caseloadFilter === 'today') {
      return !p.isHomeBooked || p.status === 'In Queue' || p.status === 'Confirmed';
    }
    if (caseloadFilter === 'upcoming') {
      return p.isHomeBooked || (p.status && p.status.toLowerCase().includes('upcoming'));
    }
    return true;
  });

  return (
    <div className="h-screen w-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row overflow-hidden font-sans">
      {/* UNIFIED DARK LEFT SIDEBAR NAVIGATION */}
      <aside className="hidden md:flex md:flex-col md:w-72 bg-stone-900 text-white p-5 justify-between shrink-0 shadow-2xl border-r border-stone-800 sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-6">
          {/* Doctor Profile Card */}
          <div className="flex items-center gap-3 border-b border-stone-800 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-emerald-500/20 shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="font-extrabold text-sm text-white truncate">{currentDoctor.name}</h2>
                <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 font-mono text-[9px] font-bold border border-emerald-800">{currentDoctor.id}</span>
              </div>
              <div className="text-[11px] text-stone-300 truncate">{currentDoctor.spec}</div>
              <div className="text-[10px] text-emerald-400 font-medium truncate">{currentDoctor.hospital}</div>
              <div className="text-[10px] text-stone-400 font-semibold flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Dedicated Station Active
              </div>
            </div>
          </div>

          {/* Quick OP Token Search Enquiry Bar */}
          <form onSubmit={handleOpTokenSearch} className="space-y-2">
            <label className="block text-[10px] uppercase font-mono tracking-wider font-bold text-stone-400">
              OP Token / ABHA Record Lookup
            </label>
            <div className="relative">
              <input
                type="text"
                value={opTokenQuery}
                onChange={(e) => setOpTokenQuery(e.target.value)}
                placeholder="Enter OP Token (e.g. OPD-101)..."
                className="w-full pl-8 pr-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-2.5" />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
            >
              <Search className="w-3.5 h-3.5" /> Enquire & Fetch Patient Records
            </button>
          </form>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-semibold">
            <div className="text-[10px] uppercase font-mono font-bold text-stone-400 tracking-wider px-2 pt-1 pb-1">
              Doctor Clinical Desk
            </div>
            <button
              onClick={() => setActiveNavTab('360_portal')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeNavTab === '360_portal' ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" /> 360° Doctor Portal
            </button>
            <button
              onClick={() => setActiveNavTab('caseload')}
              className={`w-full p-3 rounded-xl flex items-center justify-between transition ${
                activeNavTab === 'caseload' ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <span className="flex items-center gap-3"><Users className="w-4 h-4 text-emerald-400" /> My Patients Caseload</span>
              <span className="px-2 py-0.5 rounded-full bg-stone-950 text-[10px] text-emerald-400 font-mono font-bold border border-stone-800">{doctorQueue.length}</span>
            </button>
            <button
              onClick={() => setActiveNavTab('appointments')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeNavTab === 'appointments' ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Calendar className="w-4 h-4 text-emerald-400" /> Appointments Schedule
            </button>
            <button
              onClick={() => setActiveNavTab('reports')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeNavTab === 'reports' ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Clinical Reports
            </button>

            <div className="text-[10px] uppercase font-mono font-bold text-stone-400 tracking-wider px-2 pt-3 pb-1">
              Account & Support
            </div>
            <button
              onClick={() => setActiveNavTab('settings')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeNavTab === 'settings' ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Settings className="w-4 h-4 text-stone-400" /> Settings
            </button>
            <button
              onClick={() => setActiveNavTab('help')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeNavTab === 'help' ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-stone-400" /> Help Center
            </button>
          </nav>
        </div>

        {/* Sidebar Footer & Role Switcher */}
        <div className="pt-4 border-t border-stone-800 space-y-3">
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-mono font-bold text-stone-400 tracking-wider px-1">Switch Role Portal</div>
            <div className="grid grid-cols-2 gap-1 text-[11px] font-semibold">
              <button onClick={() => setViewMode('patient-portal')} className="p-1.5 rounded-lg bg-stone-950 border border-stone-800 hover:bg-stone-800 text-stone-300 text-left truncate">
                ▸ Patient
              </button>
              <button onClick={() => setViewMode('receptionist')} className="p-1.5 rounded-lg bg-stone-950 border border-stone-800 hover:bg-stone-800 text-stone-300 text-left truncate">
                ▸ Receptionist
              </button>
              <button onClick={() => setViewMode('nurse')} className="p-1.5 rounded-lg bg-stone-950 border border-stone-800 hover:bg-stone-800 text-stone-300 text-left truncate">
                ▸ Nurse
              </button>
              <button onClick={() => setViewMode('admin')} className="p-1.5 rounded-lg bg-stone-950 border border-stone-800 hover:bg-stone-800 text-stone-300 text-left truncate">
                ▸ AYUSH
              </button>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full p-2.5 rounded-xl bg-stone-950 hover:bg-rose-950/60 text-stone-300 hover:text-rose-400 text-xs font-bold flex items-center justify-center gap-2 border border-stone-800 transition"
          >
            <LogOut className="w-4 h-4 text-emerald-400" /> Logout Doctor Station
          </button>
        </div>
      </aside>

      {/* MAIN CLINICAL WORKSPACE CONTENT */}
      <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto bg-stone-950">

        {/* VIEW 1: 360° DOCTOR PORTAL */}
        {activeNavTab === '360_portal' && (
          <>
            {/* Header Bar */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-lg flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Doctor OPD Station #04
                  </span>
                  <span className="text-xs text-stone-400">• All India Institute of Ayurveda (AIIA)</span>
                </div>
                <h1 className="text-xl md:text-2xl font-extrabold text-white mt-1 tracking-tight">
                  Clinical Intake & AI Medical Diagnosis Station
                </h1>
              </div>

              <div className="flex items-center gap-2 text-xs flex-wrap">
                <button
                  onClick={() => setHomeModalOpen(true)}
                  className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Home className="w-4 h-4" /> Book Home OP (+1)
                </button>
                <button
                  onClick={handleRegisterDoctorOp}
                  className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" /> Walk-in OP (+1)
                </button>
                <button
                  onClick={handleRunAiAnalysis}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" /> {isAnalyzing ? "Analyzing Records..." : "AI Analyze Patient Records"}
                </button>
                <button
                  onClick={() => setFhirModalOpen(true)}
                  className="px-3.5 py-2.5 rounded-xl border border-stone-800 hover:border-emerald-600 bg-stone-950 font-bold text-stone-200 flex items-center gap-1.5 transition shadow-xs"
                >
                  <Code className="w-4 h-4 text-emerald-400" /> View FHIR JSON
                </button>
              </div>
            </div>

            {/* AI Medical Analysis Insight Card */}
            {aiAnalysisResult && (
              <div className={`border rounded-2xl p-5 shadow-md space-y-3 text-xs animate-in fade-in duration-300 ${
                aiAnalysisResult.riskLevel === 'HIGH'
                  ? 'bg-rose-950/70 border-rose-700/80 shadow-rose-900/30'
                  : (aiAnalysisResult.riskLevel === 'MODERATE' ? 'bg-amber-950/60 border-amber-800/80' : 'bg-emerald-950/60 border-emerald-800/80')
              }`}>
                <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className={`w-5 h-5 ${aiAnalysisResult.riskLevel === 'HIGH' ? 'text-rose-400' : 'text-amber-400'}`} />
                    <span className="font-extrabold text-white text-sm">AI Patient History & Lab Report Clinical Assessment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono font-bold text-[10px] uppercase tracking-wider border ${
                      aiAnalysisResult.riskLevel === 'HIGH'
                        ? 'bg-rose-900 text-rose-200 border-rose-600 shadow-sm'
                        : (aiAnalysisResult.riskLevel === 'MODERATE' ? 'bg-amber-900/80 text-amber-200 border-amber-700' : 'bg-emerald-900/80 text-emerald-200 border-emerald-700')
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        aiAnalysisResult.riskLevel === 'HIGH' ? 'bg-rose-400 animate-ping' : (aiAnalysisResult.riskLevel === 'MODERATE' ? 'bg-amber-400' : 'bg-emerald-400')
                      }`} />
                      {aiAnalysisResult.riskLevel === 'HIGH' ? `HIGH RISK (${aiAnalysisResult.confidence})` : (aiAnalysisResult.riskLevel === 'MODERATE' ? `MODERATE RISK (${aiAnalysisResult.confidence})` : `LOW RISK (${aiAnalysisResult.confidence})`)}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {aiAnalysisResult.engine}
                    </span>
                  </div>
                </div>

                {aiAnalysisResult.riskReason && (
                  <div className={`p-3 rounded-xl border text-xs font-medium leading-relaxed ${
                    aiAnalysisResult.riskLevel === 'HIGH' ? 'bg-rose-900/40 border-rose-800 text-rose-200' : 'bg-stone-950 border-stone-800 text-stone-300'
                  }`}>
                    <strong className="block font-mono text-[10px] uppercase text-stone-400 mb-0.5">AI Clinical Triage Assessment</strong>
                    {aiAnalysisResult.riskReason}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <strong className="text-stone-400 uppercase font-mono text-[10px] block">Primary Modern Diagnosis</strong>
                    <p className="font-bold text-white text-sm mt-0.5">{aiAnalysisResult.primaryDiagnosis}</p>
                  </div>
                  <div>
                    <strong className="text-stone-400 uppercase font-mono text-[10px] block">AYUSH Ayurvedic Assessment</strong>
                    <p className="font-bold text-emerald-400 text-sm mt-0.5">{aiAnalysisResult.ayushDiagnosis}</p>
                  </div>
                </div>

                <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-1">
                  <strong className="text-stone-400 uppercase font-mono text-[10px] block">Abnormal Lab & Vital Flags</strong>
                  <p className="text-stone-200 font-semibold">{aiAnalysisResult.labSummary}</p>
                </div>

                <div>
                  <strong className="text-stone-400 uppercase font-mono text-[10px] block mb-1">Recommended Clinical Action Plan</strong>
                  <ul className="space-y-1 text-stone-200">
                    {aiAnalysisResult.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 2-PANE CLINICAL WORKSPACE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Pane: Triage Queue */}
              <div className="lg:col-span-4 space-y-4">
                <Screen11DoctorQueue
                  activePatientToken={activePatient?.token}
                  onSelectPatient={handleSelectPatientFromQueue}
                />

                {/* Medical Banner Visual Card */}
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-stone-800 h-44 group">
                  <img src={MEDICAL_IMAGES.doctorWorkspace} alt="Doctor Workspace" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent p-4 flex flex-col justify-end text-white">
                    <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 tracking-wider">AI Medical Diagnosis Engine</span>
                    <h3 className="font-bold text-sm">Clinical EHR & Voice Tele-Intake Integration</h3>
                    <p className="text-[11px] text-stone-300">
                      Synchronized live with Spring Boot MySQL DB • {isRecordUnlocked ? <span className="text-emerald-400 font-bold">Privacy Shield Unlocked</span> : <span className="text-amber-400 font-bold">5-Min Consent Guard Active</span>}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Pane: Clinical Intake EHR Workspace WRAPPED IN PRIVACY SHIELD */}
              <div className="lg:col-span-8 bg-stone-900 border border-stone-800 rounded-2xl shadow-lg flex flex-col min-h-[640px] overflow-hidden">
                <PatientPrivacyShield
                  activePatient={activePatient}
                  onUnlockedChange={setIsRecordUnlocked}
                >
                  <Screen12PatientHeader
                    activePatient={activePatient}
                    onSaveEdits={handleSaveEdits}
                    onOpenRejectModal={() => setRejectModalOpen(true)}
                    onAcceptSummary={handleAcceptSummary}
                  />

                  {/* Doctor Clinical Tabs */}
                  <div className="border-b border-stone-800 px-5 flex items-center gap-5 text-xs font-semibold bg-stone-950 overflow-x-auto">
                    <button
                      onClick={() => setActiveDoctorTab('summary')}
                      className={`py-3.5 border-b-2 flex items-center gap-1.5 transition ${
                        activeDoctorTab === 'summary' ? 'border-emerald-500 text-emerald-400 font-bold' : 'border-transparent text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <FileText className="w-4 h-4" /> Clinical Summary (Editable)
                    </button>
                    <button
                      onClick={() => setActiveDoctorTab('evidence')}
                      className={`py-3.5 border-b-2 flex items-center gap-1.5 transition ${
                        activeDoctorTab === 'evidence' ? 'border-emerald-500 text-emerald-400 font-bold' : 'border-transparent text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <Split className="w-4 h-4" /> Side-by-Side Evidence (OCR / Raw Intake)
                    </button>
                    <button
                      onClick={() => setActiveDoctorTab('timeline')}
                      className={`py-3.5 border-b-2 flex items-center gap-1.5 transition ${
                        activeDoctorTab === 'timeline' ? 'border-emerald-500 text-emerald-400 font-bold' : 'border-transparent text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <Calendar className="w-4 h-4" /> Document Timeline & Lab Values
                    </button>
                    {activePatient?.ayushMode && (
                      <button
                        onClick={() => setActiveDoctorTab('ayush')}
                        className={`py-3.5 border-b-2 flex items-center gap-1.5 transition ${
                          activeDoctorTab === 'ayush' ? 'border-emerald-500 text-emerald-400 font-bold' : 'border-transparent text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        <Leaf className="w-4 h-4" /> Dashavidha Pariksha
                      </button>
                    )}
                  </div>

                  {/* Tab Body */}
                  <div className="p-6 flex-1 overflow-y-auto space-y-4">
                    {activeDoctorTab === 'summary' && (
                      <Screen13ClinicalSummaryEdit
                        activePatient={activePatient}
                        editableHpi={editableHpi}
                        setEditableHpi={setEditableHpi}
                        editableCc={editableCc}
                        setEditableCc={setEditableCc}
                      />
                    )}
                    {activeDoctorTab === 'evidence' && (
                      <Screen14EvidenceSideBySide activePatient={activePatient} />
                    )}
                    {activeDoctorTab === 'timeline' && (
                      <Screen15TimelineAbnormalDoctor activePatient={activePatient} />
                    )}
                    {activeDoctorTab === 'ayush' && (
                      <div className="space-y-4 text-xs">
                        <h4 className="font-extrabold text-sm text-emerald-400 flex items-center gap-2">
                          <Leaf className="w-4 h-4" /> Dashavidha Pariksha Ayurvedic Assessment
                        </h4>
                        <div className="p-4 bg-stone-950 rounded-2xl border border-emerald-900/60 space-y-3 text-stone-200">
                          <div><strong className="text-emerald-400">Prakriti (Body Constitution):</strong> {activePatient?.ayushParameters?.prakriti || "Vata-Pitta"}</div>
                          <div><strong className="text-emerald-400">Agni (Digestive Fire):</strong> {activePatient?.ayushParameters?.agni || "Manda Agni"}</div>
                          <div><strong className="text-emerald-400">Koshtha (Bowel Habit):</strong> {activePatient?.ayushParameters?.koshtha || "Krura Koshtha"}</div>
                          <div><strong className="text-emerald-400">Sleep / Nidra:</strong> {activePatient?.ayushParameters?.sleep || "Alpa Nidra"}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </PatientPrivacyShield>
              </div>
            </div>
          </>
        )}

        {/* VIEW 2: MY PATIENTS CASELOAD (WITH TODAY'S SESSIONS & UPCOMING PATIENTS FILTERS) */}
        {activeNavTab === 'caseload' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-md flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-emerald-400" /> My Patients Caseload ({filteredCaseload.length})
                </h1>
                <p className="text-xs text-stone-400 mt-1">Complete roster of active OPD consultations, today's sessions, and upcoming home bookings.</p>
              </div>

              {/* Caseload Filter Buttons */}
              <div className="flex items-center gap-2 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
                <button
                  onClick={() => setCaseloadFilter('all')}
                  className={`px-3 py-1.5 rounded-lg transition font-bold ${
                    caseloadFilter === 'all' ? 'bg-emerald-600 text-white shadow-sm' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  All Patients ({doctorQueue.length})
                </button>
                <button
                  onClick={() => setCaseloadFilter('today')}
                  className={`px-3 py-1.5 rounded-lg transition font-bold ${
                    caseloadFilter === 'today' ? 'bg-emerald-600 text-white shadow-sm' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Today's Sessions
                </button>
                <button
                  onClick={() => setCaseloadFilter('upcoming')}
                  className={`px-3 py-1.5 rounded-lg transition font-bold ${
                    caseloadFilter === 'upcoming' ? 'bg-emerald-600 text-white shadow-sm' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Upcoming Patients (Home Booked)
                </button>
              </div>
            </div>

            {/* Grid of Patients */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCaseload.map((patient, idx) => {
                const risk = getPatientRiskMetrics(patient);
                return (
                  <div key={idx} className={`rounded-2xl border p-5 shadow-md transition space-y-3 flex flex-col justify-between ${
                    risk.riskLevel === 'HIGH'
                      ? 'bg-stone-900 border-rose-800/80 shadow-rose-950/20'
                      : 'bg-stone-900 border-stone-800 hover:border-emerald-600/60'
                  }`}>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-stone-950 text-emerald-400 rounded border border-stone-800">
                          {patient.token}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {patient.isHomeBooked && (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                              HOME BOOKED
                            </span>
                          )}
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            risk.riskLevel === 'HIGH' ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse' :
                            patient.ayushMode ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                            'bg-stone-800 text-stone-300 border border-stone-700'
                          }`}>
                            {patient.status || "In Queue"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-extrabold text-base text-white">{patient.name}</h3>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                          risk.riskLevel === 'HIGH'
                            ? 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
                            : (risk.riskLevel === 'MODERATE' ? 'bg-amber-950 text-amber-300 border-amber-800' : 'bg-emerald-950 text-emerald-300 border-emerald-800')
                        }`}>
                          {risk.badgeText}
                        </span>
                      </div>

                      <div className="text-xs text-stone-400 flex items-center gap-2">
                        <span>{patient.age}y / {patient.gender}</span>
                        <span>•</span>
                        <span>Time: <strong className="text-stone-200 font-mono">{patient.time || '10:30 AM'}</strong></span>
                      </div>

                      <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-300 space-y-1">
                        <div><strong className="text-white">Hospital:</strong> {patient.hospital}</div>
                        <div><strong className="text-white">Complaint:</strong> {patient.chiefComplaint}</div>
                        <div className={`text-[11px] font-semibold pt-1 ${risk.riskLevel === 'HIGH' ? 'text-rose-400' : 'text-stone-400'}`}>
                          {risk.riskReason}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        handleSelectPatientFromQueue(patient);
                        setActiveNavTab('360_portal');
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition mt-3"
                    >
                      <Lock className="w-3.5 h-3.5" /> Start Consultation (Consent Protected)
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 3: APPOINTMENTS SCHEDULE */}
        {activeNavTab === 'appointments' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-md flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-emerald-400" /> Today's OPD Appointments Schedule
                </h1>
                <p className="text-xs text-stone-400 mt-1">Confirmed appointments, home bookings, and scheduled follow-ups for OPD Room #4.</p>
              </div>
              <span className="px-3 py-1 bg-emerald-950 text-emerald-300 font-mono font-bold text-xs rounded-full border border-emerald-800">
                {appointments.length + doctorQueue.length} Scheduled
              </span>
            </div>

            <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden shadow-md">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-950 border-b border-stone-800 text-stone-400 font-mono uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Time Slot</th>
                    <th className="p-4">Patient Name</th>
                    <th className="p-4">Department / Room</th>
                    <th className="p-4">Booking Mode</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 text-stone-200">
                  {doctorQueue.map((p, idx) => (
                    <tr key={idx} className="hover:bg-stone-800/50 transition">
                      <td className="p-4 font-mono font-bold text-emerald-400">{p.time || `09:30 AM`}</td>
                      <td className="p-4 font-bold text-white">{p.name} ({p.age}y/{p.gender})</td>
                      <td className="p-4 text-stone-300">{p.department}</td>
                      <td className="p-4">
                        {p.isHomeBooked ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
                            HOME ONLINE OP
                          </span>
                        ) : (
                          <span className="text-stone-400 font-medium">Kiosk Walk-in</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {p.status || "CONFIRMED"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            handleSelectPatientFromQueue(p);
                            setActiveNavTab('360_portal');
                          }}
                          className="px-3 py-1 bg-stone-950 hover:bg-stone-800 text-emerald-400 border border-stone-800 rounded-lg text-xs font-bold transition flex items-center gap-1 ml-auto"
                        >
                          <Lock className="w-3 h-3" /> Consult (Locked)
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 4: CLINICAL REPORTS */}
        {activeNavTab === 'reports' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-md flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-6 h-6 text-emerald-400" /> Clinical Diagnostic Reports & Analytics
                </h1>
                <p className="text-xs text-stone-400 mt-1">Aggregated clinical summaries, FHIR bundles, and lab reports repository.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 shadow-md space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-white text-sm">FHIR R4 Diagnostic Bundles</h3>
                <p className="text-xs text-stone-400">Standardized HL7/FHIR JSON bundles generated for all OPD consultations.</p>
                <button onClick={() => setFhirModalOpen(true)} className="w-full py-2 bg-stone-950 hover:bg-stone-800 text-stone-200 font-bold border border-stone-800 rounded-xl text-xs transition">
                  Export All FHIR Bundles
                </button>
              </div>

              <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 shadow-md space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold">
                  <Leaf className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-white text-sm">AYUSH Prakriti Metrics</h3>
                <p className="text-xs text-stone-400">Dashavidha Pariksha assessments and body constitution breakdown reports.</p>
                <button onClick={() => alert("AYUSH Analytics report compiled successfully.")} className="w-full py-2 bg-stone-950 hover:bg-stone-800 text-stone-200 font-bold border border-stone-800 rounded-xl text-xs transition">
                  Download AYUSH Report PDF
                </button>
              </div>

              <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 shadow-md space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-white text-sm">AI Accuracy & Red Flag Logs</h3>
                <p className="text-xs text-stone-400">Diagnostic confidence rating stats (avg 94.2%) and automated red flag triage audit.</p>
                <button onClick={() => alert("AI Clinical Accuracy Audit generated.")} className="w-full py-2 bg-stone-950 hover:bg-stone-800 text-stone-200 font-bold border border-stone-800 rounded-xl text-xs transition">
                  Generate Clinical Audit
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODALS */}
      {fhirModalOpen && (
        <Screen16FhirModal
          isOpen={fhirModalOpen}
          onClose={() => setFhirModalOpen(false)}
          activePatient={activePatient}
        />
      )}

      {rejectModalOpen && (
        <ReinterviewModal
          isOpen={rejectModalOpen}
          onClose={() => setRejectModalOpen(false)}
          onConfirmReject={(reason) => {
            setDoctorQueue(prev => prev.map(p => p.token === activePatient.token ? { ...p, status: 'rejected' } : p));
            alert(`Patient ${activePatient.name} sent for re-interview.`);
            setRejectModalOpen(false);
          }}
        />
      )}

      {homeModalOpen && (
        <HomeAppointmentModal
          isOpen={homeModalOpen}
          onClose={() => setHomeModalOpen(false)}
        />
      )}
    </div>
  );
};
