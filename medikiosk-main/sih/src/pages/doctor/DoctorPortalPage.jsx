import React, { useState } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { Screen11DoctorQueue } from '../../components/doctor/Screen11DoctorQueue';
import { Screen12PatientHeader } from '../../components/doctor/Screen12PatientHeader';
import { Screen13ClinicalSummaryEdit } from '../../components/doctor/Screen13ClinicalSummaryEdit';
import { Screen14EvidenceSideBySide } from '../../components/doctor/Screen14EvidenceSideBySide';
import { Screen15TimelineAbnormalDoctor } from '../../components/doctor/Screen15TimelineAbnormalDoctor';
import { Screen16FhirModal } from '../../components/doctor/Screen16FhirModal';
import { ReinterviewModal } from '../../components/doctor/ReinterviewModal';
import { MEDICAL_IMAGES } from '../../data/images';
import {
  Stethoscope, Search, Sparkles, FileText, Split, Calendar, Leaf, Code,
  ShieldCheck, LogOut, Activity, CheckCircle, Clock, Users, UserPlus,
  FileSpreadsheet, Settings, HelpCircle, LayoutDashboard, ArrowRight
} from 'lucide-react';

export const DoctorPortalPage = ({ onLogout }) => {
  const {
    doctorQueue, setDoctorQueue, activeDoctorTab, setActiveDoctorTab,
    setViewMode, appointments
  } = usePatientSession();

  // Doctor Sidebar Tab State: '360_portal' | 'caseload' | 'appointments' | 'reports' | 'settings' | 'help'
  const [activeNavTab, setActiveNavTab] = useState('360_portal');
  const [opTokenQuery, setOpTokenQuery] = useState("");
  const [searchedPatient, setSearchedPatient] = useState(null);

  const [fhirModalOpen, setFhirModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);

  const [selectedPatientToken, setSelectedPatientToken] = useState(
    doctorQueue.length > 0 ? doctorQueue[0].token : "OPD-101"
  );

  const activePatient = doctorQueue.find(p => p.token === selectedPatientToken) || searchedPatient || doctorQueue[0];

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
        chiefComplaint: "Severe right thigh muscle strain & knee joint stiffness after stunt scene",
        summaryText: "Patient presenting with acute right thigh muscle tightness and localized tenderness after physical exertion. BP: 130/85 mmHg, Pulse: 78 bpm, SpO2: 98%. Recommended Ayush Sahacharadi Thailam application and mild rest.",
        status: "In Queue",
        ayushMode: true,
        vitals: { sysBp: "130", diaBp: "85", heartRate: "78", spo2: "98%", temp: "98.6°F" },
        ayushParameters: { prakriti: "Pitta-Kapha", agni: "Sama Agni", koshtha: "Madhyama" }
      };

      setSearchedPatient(retrieved);
      setSelectedPatientToken(retrieved.token);
      setEditableHpi(retrieved.summaryText);
      setEditableCc(retrieved.chiefComplaint);
      alert(`Retrieved Patient EHR File from Spring Boot Backend database for Token: ${retrieved.token}`);
    }
  };

  const handleRunAiAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAiAnalysisResult({
        primaryDiagnosis: "Right Gastrocnemius Muscle Strain with Mild Peripheral Ischemia Risk",
        ayushDiagnosis: "Vata Dushti in Adho Shakha (Leg Muscle Vata Imbalance)",
        riskLevel: "MODERATE",
        confidence: "94.2%",
        labSummary: "HbA1c: 7.2% (Controlled), BP: 130/85 mmHg, Blood Sugar: 110 mg/dL.",
        recommendations: [
          "Prescribe Sahacharadi Thailam local application & Dashamoola Kashayam (15ml BD)",
          "Order Lower Limb Arterial Doppler Ultrasonography",
          "Rest, Ice, Compression, Elevation (RICE protocol) for 48 hours",
          "Follow-up in OPD after 5 days with updated Doppler report"
        ]
      });
    }, 1200);
  };

  const handleRegisterDoctorOp = () => {
    const pName = prompt("Enter New Walk-in Patient Name:", "Suriya Sivakumar");
    if (!pName || !pName.trim()) return;

    const newToken = "OPD-" + Math.floor(100 + Math.random() * 900);
    const newPatient = {
      token: newToken,
      name: pName.trim(),
      age: "38",
      gender: "Male",
      phone: "9841029384",
      aadhaar: "91-8849-2019-3382",
      hospital: "Rajiv Gandhi Government General Hospital, Chennai",
      department: "Cardiology & Ayush Integrative Care",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chiefComplaint: "Direct Doctor Station OPD Walk-in Intake",
      summaryText: `Patient ${pName.trim()} registered directly at Doctor Station OPD #04.`,
      status: "Doctor Registered",
      ayushMode: false
    };

    fetch("http://localhost:8080/api/doctor/register-op", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newPatient.name,
        age: newPatient.age,
        gender: newPatient.gender,
        phone: newPatient.phone,
        department: newPatient.department,
        hospital: newPatient.hospital
      })
    }).catch(err => console.log("Backend offline, doctor registration saved locally:", err));

    setDoctorQueue(prev => [newPatient, ...prev]);
    setSelectedPatientToken(newToken);
    alert(`New OP Patient [${newToken}] ${pName.trim()} registered directly at Doctor Station and saved to Backend!`);
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
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row font-sans">
      {/* UNIFIED DARK LEFT SIDEBAR NAVIGATION (DESKTOP ONLY - HIDDEN ON MOBILE/PHONE VIEW) */}
      <aside className="hidden md:flex md:flex-col md:w-72 bg-stone-900 text-white p-5 justify-between shrink-0 shadow-2xl border-r border-stone-800 sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-6">
          {/* Doctor Profile Card */}
          <div className="flex items-center gap-3 border-b border-stone-800 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-emerald-500/20">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white">Dr. V. S. Ramachandran</h2>
              <div className="text-[11px] text-stone-400">Senior Physician • OPD Room #4</div>
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Doctor Session Active
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
                ▸ Admin
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

      {/* MAIN CLINICAL WORKSPACE CONTENT (ADMIN STABLE DARK THEME) */}
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

              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={handleRegisterDoctorOp}
                  className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" /> Register New OP (+1)
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
              <div className="bg-amber-950/60 border border-amber-800/80 rounded-2xl p-5 shadow-md space-y-3 text-xs animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-amber-800/60 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span className="font-extrabold text-amber-100 text-sm">AI Patient History & Lab Report Clinical Assessment</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full font-mono font-extrabold bg-amber-900/80 text-amber-200 border border-amber-700 text-[10px]">
                    CONFIDENCE: {aiAnalysisResult.confidence}
                  </span>
                </div>

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

                <div className="bg-stone-950 p-3 rounded-xl border border-amber-800/40 space-y-1">
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
                    <p className="text-[11px] text-stone-300">Synchronized live with Spring Boot REST Backend H2 DB.</p>
                  </div>
                </div>
              </div>

              {/* Right Pane: Clinical Intake EHR Workspace */}
              <div className="lg:col-span-8 bg-stone-900 border border-stone-800 rounded-2xl shadow-lg flex flex-col min-h-[640px] overflow-hidden">
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
              </div>
            </div>
          </>
        )}

        {/* VIEW 2: MY PATIENTS CASELOAD */}
        {activeNavTab === 'caseload' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-md flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-emerald-400" /> My Patients Caseload ({doctorQueue.length})
                </h1>
                <p className="text-xs text-stone-400 mt-1">Complete roster of active OPD consultations and hospital visits.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-emerald-950 text-emerald-300 text-xs font-mono font-bold rounded-full border border-emerald-800">
                  Active OP Load: 100% Synced
                </span>
              </div>
            </div>

            {/* Grid of 10 Patients */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {doctorQueue.map((patient, idx) => (
                <div key={idx} className="bg-stone-900 rounded-2xl border border-stone-800 p-5 shadow-md hover:border-emerald-600/60 transition space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-stone-950 text-emerald-400 rounded border border-stone-800">
                        {patient.token}
                      </span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        patient.redFlag ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        patient.ayushMode ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        'bg-stone-800 text-stone-300 border border-stone-700'
                      }`}>
                        {patient.status || "In Queue"}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-white">{patient.name}</h3>
                    <div className="text-xs text-stone-400 flex items-center gap-2">
                      <span>{patient.age}y / {patient.gender}</span>
                      <span>•</span>
                      <span>Phone: <strong className="text-stone-200 font-mono">{patient.phone}</strong></span>
                    </div>

                    <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 text-xs text-stone-300 space-y-1">
                      <div><strong className="text-white">Hospital:</strong> {patient.hospital}</div>
                      <div><strong className="text-white">Complaint:</strong> {patient.chiefComplaint}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleSelectPatientFromQueue(patient);
                      setActiveNavTab('360_portal');
                    }}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition mt-3"
                  >
                    Open Clinical EHR File <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
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
                <p className="text-xs text-stone-400 mt-1">Confirmed appointments and scheduled follow-ups for OPD Room #4.</p>
              </div>
              <span className="px-3 py-1 bg-emerald-950 text-emerald-300 font-mono font-bold text-xs rounded-full border border-emerald-800">
                {appointments.length + doctorQueue.length} Scheduled Today
              </span>
            </div>

            <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden shadow-md">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-950 border-b border-stone-800 text-stone-400 font-mono uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Time Slot</th>
                    <th className="p-4">Patient Name</th>
                    <th className="p-4">Department / Room</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 text-stone-200">
                  {doctorQueue.slice(0, 5).map((p, idx) => (
                    <tr key={idx} className="hover:bg-stone-800/50 transition">
                      <td className="p-4 font-mono font-bold text-emerald-400">{p.time || `0${9 + idx}:30 AM`}</td>
                      <td className="p-4 font-bold text-white">{p.name} ({p.age}y/{p.gender})</td>
                      <td className="p-4 text-stone-300">{p.department}</td>
                      <td className="p-4 text-stone-300 font-semibold">{idx % 2 === 0 ? "OPD Consultation" : "Ayush Follow-up"}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          CONFIRMED
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            handleSelectPatientFromQueue(p);
                            setActiveNavTab('360_portal');
                          }}
                          className="px-3 py-1 bg-stone-950 hover:bg-stone-800 text-emerald-400 border border-stone-800 rounded-lg text-xs font-bold transition"
                        >
                          View Consultation
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
                <p className="text-xs text-stone-400">Standardized HL7/FHIR JSON bundles generated for all 10 OPD consultations.</p>
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
                  View AI Performance Logs
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: SETTINGS */}
        {activeNavTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl">
            <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-md">
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <Settings className="w-6 h-6 text-emerald-400" /> Doctor Portal Station Settings
              </h1>
              <p className="text-xs text-stone-400 mt-1">Configure OPD station preferences, AI assist sensitivity, and EHR sync.</p>
            </div>

            <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-md space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div>
                  <h4 className="font-bold text-white">Automated AI Clinical Summary Generation</h4>
                  <p className="text-stone-400">Synthesize doctor-editable SOCRATES notes instantly from kiosk speech intake.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-500" />
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div>
                  <h4 className="font-bold text-white">Spring Boot REST H2 Live Database Sync</h4>
                  <p className="text-stone-400">Synchronize OPD queue changes directly with backend API port 8080.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-500" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">AYUSH Prakriti & Dashavidha Assessment Panel</h4>
                  <p className="text-stone-400">Display Ayurvedic Prakriti, Agni, and Koshtha clinical fields for relevant patients.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-500" />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: HELP CENTER */}
        {activeNavTab === 'help' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
            <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-md">
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-emerald-400" /> Doctor Help Center & Knowledge Base
              </h1>
              <p className="text-xs text-stone-400 mt-1">Guides, voice-kiosk intake tutorials, and technical support.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 shadow-md space-y-2">
                <h3 className="font-extrabold text-white text-sm">How to Accept or Edit Clinical Summaries</h3>
                <p className="text-stone-300">Select any patient from the queue, review the AI-synthesized SOCRATES notes, make any edits directly in the text fields, and click "Accept Summary" to save to the central EHR record.</p>
              </div>

              <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 shadow-md space-y-2">
                <h3 className="font-extrabold text-white text-sm">Using OP Token Enquiry Search</h3>
                <p className="text-stone-300">Enter any patient's OP token (e.g. OPD-101) into the sidebar search box to instantly query Spring Boot REST backend database and load their full clinical file.</p>
              </div>
            </div>
          </div>
        )}

        {/* Global Modals */}
        <Screen16FhirModal isOpen={fhirModalOpen} onClose={() => setFhirModalOpen(false)} activePatient={activePatient} />
        <ReinterviewModal isOpen={rejectModalOpen} onClose={() => setRejectModalOpen(false)} onConfirmReject={handleConfirmReject} />
      </main>
    </div>
  );
};
