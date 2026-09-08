import React, { useState } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { MEDICAL_IMAGES, ROLE_AVATARS } from '../../data/images';
import {
  Activity, CheckCircle, UserCheck, HeartPulse, LogOut, Users, ShieldCheck, UserPlus,
  Calendar, Bell, Settings, HelpCircle, Thermometer, Droplet, Stethoscope, AlertTriangle, ArrowRight
} from 'lucide-react';

export const NursePortalPage = ({ onLogout }) => {
  const { doctorQueue, setDoctorQueue, setViewMode, appointments } = usePatientSession();

  const handleRegisterNurseOp = () => {
    const pName = prompt("Enter New Walk-in Patient Name:", "Trisha Krishnan");
    if (!pName || !pName.trim()) return;

    const newToken = "OPD-" + Math.floor(100 + Math.random() * 900);
    const newPatient = {
      token: newToken,
      name: pName.trim(),
      age: "34",
      gender: "Female",
      phone: "9840291029",
      aadhaar: "91-7738-9901-2281",
      hospital: "Rajiv Gandhi Government General Hospital, Chennai",
      department: "General Nursing & Triage",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chiefComplaint: "Direct Nurse Triage Station Walk-in Intake",
      summaryText: `Patient ${pName.trim()} registered directly at Nurse Triage Station.`,
      status: "Nurse Triaged",
      ayushMode: false
    };

    fetch("http://localhost:8080/api/nurse/register-op", {
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
    }).catch(err => console.log("Backend offline, nurse registration saved locally:", err));

    setDoctorQueue(prev => [newPatient, ...prev]);
    setSelectedPatientToken(newToken);
    alert(`New OP Patient [${newToken}] ${pName.trim()} registered directly at Nurse Station and saved to Backend!`);
  };

  // Nurse Sidebar Tab State: 'triage' | 'patients_list' | 'appointments_calendar' | 'notifications' | 'settings' | 'help'
  const [activeTab, setActiveTab] = useState('triage');

  const [selectedPatientToken, setSelectedPatientToken] = useState(
    doctorQueue.length > 0 ? doctorQueue[0].token : null
  );

  const activePatient = doctorQueue.find(p => p.token === selectedPatientToken) || doctorQueue[0];

  const [vitals, setVitals] = useState({
    sysBp: "120",
    diaBp: "80",
    heartRate: "72",
    spo2: "98",
    temp: "98.6",
    weight: "68",
    height: "170",
    bg: "105",
    nurseNotes: ""
  });

  const [recordedVitals, setRecordedVitals] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVitals(prev => ({ ...prev, [name]: value }));
  };

  // Automated Vitals Risk Calculation
  const calculateVitalsRisk = () => {
    const sys = parseInt(vitals.sysBp) || 120;
    const dia = parseInt(vitals.diaBp) || 80;
    const hr = parseInt(vitals.heartRate) || 72;
    const o2 = parseInt(vitals.spo2) || 98;
    const temp = parseFloat(vitals.temp) || 98.6;

    if (sys >= 160 || dia >= 100 || o2 < 92 || hr > 110 || temp > 102.5) {
      return { level: "RED", text: "Urgent Triage (Critical Vitals)", bg: "bg-rose-950 text-rose-300 border-rose-800" };
    }
    if (sys >= 140 || dia >= 90 || o2 < 95 || hr > 95 || temp > 100.4) {
      return { level: "YELLOW", text: "Moderate Alert (Monitor Closely)", bg: "bg-amber-950 text-amber-300 border-amber-800" };
    }
    return { level: "GREEN", text: "Vitals Within Normal Range", bg: "bg-emerald-950 text-emerald-300 border-emerald-800" };
  };

  const riskStatus = calculateVitalsRisk();

  const handleSaveVitals = (e) => {
    e.preventDefault();
    const vitalsRecord = {
      ...vitals,
      riskLevel: riskStatus.level,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (activePatient && activePatient.token) {
      fetch(`http://localhost:8080/api/nurse/record-vitals/${activePatient.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vitals)
      }).catch(err => console.log("Backend offline, vitals saved locally:", err));
    }

    setRecordedVitals(prev => ({
      ...prev,
      [activePatient.token]: vitalsRecord
    }));

    setDoctorQueue(prev => prev.map(p => {
      if (p.token === activePatient.token) {
        return {
          ...p,
          vitals: vitalsRecord,
          status: 'nurse-triaged',
          summaryText: p.summaryText + `\n\n[NURSE TRIAGE VITALS]: BP: ${vitals.sysBp}/${vitals.diaBp} mmHg, HR: ${vitals.heartRate} bpm, SpO2: ${vitals.spo2}%, Temp: ${vitals.temp}°F.`
        };
      }
      return p;
    }));

    alert(`Vitals recorded for ${activePatient.name}. Patient triaged as [${riskStatus.level}] and forwarded to Doctor Station.`);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row font-sans">
      {/* LEFT SIDEBAR NAVIGATION (DESKTOP ONLY - HIDDEN ON MOBILE/PHONE VIEW) */}
      <aside className="hidden md:flex md:flex-col md:w-72 bg-stone-900 text-white p-5 justify-between shrink-0 shadow-2xl border-r border-stone-800 sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-6">
          {/* Staff Nurse Profile Card */}
          <div className="flex items-center gap-3 border-b border-stone-800 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-emerald-600/20 font-mono">
              SN
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white">Staff Nurse Desk</h2>
              <div className="text-[11px] text-stone-400">OPD Triage • Station #01</div>
              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Shift Active
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-xs font-semibold">
            <div className="text-[10px] uppercase font-mono font-bold text-stone-400 tracking-wider px-2 pt-1 pb-1">
              Nurse Station Workspace
            </div>
            <button
              onClick={() => setActiveTab('triage')}
              className={`w-full p-3 rounded-xl flex items-center justify-between transition ${
                activeTab === 'triage' ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <span className="flex items-center gap-3"><HeartPulse className="w-4 h-4 text-emerald-400" /> Nurse Intervention Desk</span>
              <span className="px-2 py-0.5 rounded-full bg-stone-950 text-[10px] text-emerald-400 font-mono font-bold border border-stone-800">{doctorQueue.length}</span>
            </button>
            <button
              onClick={() => setActiveTab('patients_list')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeTab === 'patients_list' ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" /> Patients List
            </button>
            <button
              onClick={() => setActiveTab('appointments_calendar')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeTab === 'appointments_calendar' ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Calendar className="w-4 h-4 text-emerald-400" /> Appointments Calendar
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeTab === 'notifications' ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Bell className="w-4 h-4 text-emerald-400" /> Outreach Notifications
            </button>

            <div className="text-[10px] uppercase font-mono font-bold text-stone-400 tracking-wider px-2 pt-3 pb-1">
              Account & Support
            </div>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeTab === 'settings' ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Settings className="w-4 h-4 text-stone-400" /> Settings
            </button>
            <button
              onClick={() => setActiveTab('help')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeTab === 'help' ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30' : 'text-stone-300 hover:bg-stone-800'
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
              <button onClick={() => setViewMode('doctor')} className="p-1.5 rounded-lg bg-stone-950 border border-stone-800 hover:bg-stone-800 text-stone-300 text-left truncate">
                ▸ Doctor
              </button>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full p-2.5 rounded-xl bg-stone-950 hover:bg-rose-950/60 text-stone-300 hover:text-rose-400 text-xs font-bold flex items-center justify-center gap-2 border border-stone-800 transition"
          >
            <LogOut className="w-4 h-4 text-emerald-400" /> Logout Nurse Station
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE CONTENT */}
      <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto bg-stone-950">

        {/* VIEW 1: NURSE INTERVENTION DESK (TRIAGE WORKSPACE) */}
        {activeTab === 'triage' && (
          <>
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-md flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Nurse Station #01
                  </span>
                  <span className="text-xs text-stone-400">• OPD Clinical Triage Desk</span>
                </div>
                <h1 className="text-xl md:text-2xl font-extrabold text-white mt-1 tracking-tight">
                  Nurse Intervention & Vitals Triage Station
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRegisterNurseOp}
                  className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md text-xs transition flex items-center gap-1.5"
                >
                  <UserPlus className="w-4 h-4" /> Register New OP (+1)
                </button>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-xl text-xs font-mono font-bold">
                  <HeartPulse className="w-4 h-4 text-emerald-400" /> Triage Queue: {doctorQueue.length} Active Patients
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Triage Queue List */}
              <div className="lg:col-span-4 bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-md space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" /> Triage Patient Queue ({doctorQueue.length})
                  </h3>
                  <span className="text-[10px] text-stone-500 font-mono">Real-time</span>
                </div>

                <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                  {doctorQueue.map((patient) => {
                    const isSelected = patient.token === selectedPatientToken;
                    const hasVitals = recordedVitals[patient.token];
                    return (
                      <div
                        key={patient.token}
                        onClick={() => setSelectedPatientToken(patient.token)}
                        className={`p-3 rounded-xl border cursor-pointer transition ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-950/60 shadow-md'
                            : 'border-stone-800 hover:border-stone-700 bg-stone-950'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-white">{patient.name}</span>
                          <span className="font-mono text-[10px] font-bold text-emerald-400 px-2 py-0.5 bg-stone-900 rounded border border-stone-800">
                            {patient.token}
                          </span>
                        </div>

                        <div className="text-[11px] text-stone-400 mt-1">
                          {patient.age}y / {patient.gender} • {patient.hospital?.split(",")[0]}
                        </div>

                        {hasVitals && (
                          <div className="mt-2 flex items-center gap-2 text-[10px]">
                            <span className={`px-2 py-0.5 rounded font-mono font-extrabold border ${
                              hasVitals.riskLevel === 'RED' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                              hasVitals.riskLevel === 'YELLOW' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                              'bg-emerald-950 text-emerald-300 border-emerald-800'
                            }`}>
                              TRIAGED: {hasVitals.riskLevel}
                            </span>
                            <span className="text-stone-500 font-mono">{hasVitals.timestamp}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="relative rounded-xl overflow-hidden shadow-md border border-stone-800 h-36 mt-4">
                  <img src={MEDICAL_IMAGES.nurseStation} alt="Nurse Station" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 bg-stone-950/60 p-3 flex flex-col justify-end text-white">
                    <span className="text-[10px] font-mono font-bold text-emerald-400">STAFF NURSE DESK</span>
                    <h4 className="font-bold text-xs">Vitals Entry & Automated Clinical Alerting</h4>
                  </div>
                </div>
              </div>

              {/* Right Column: Vitals Form & Active Patient Details */}
              <div className="lg:col-span-8 bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-md space-y-6">
                {activePatient ? (
                  <>
                    <div className="flex items-center justify-between pb-4 border-b border-stone-800 flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={activePatient.gender === 'Female' ? ROLE_AVATARS.patientFemale1 : ROLE_AVATARS.patientMale1}
                          alt={activePatient.name}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shadow-md shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xl font-extrabold text-white">{activePatient.name}</h2>
                            <span className="px-2.5 py-0.5 rounded-full bg-stone-950 text-xs font-mono font-bold text-stone-300 border border-stone-800">
                              {activePatient.age}y / {activePatient.gender}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-mono text-xs font-bold border border-emerald-800">
                              {activePatient.token}
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 mt-1">
                            Hospital: <strong className="text-stone-200">{activePatient.hospital}</strong> | Phone: <strong className="font-mono text-emerald-400">{activePatient.phone}</strong>
                          </p>
                        </div>
                      </div>

                      <div className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-extrabold ${riskStatus.bg}`}>
                        {riskStatus.text}
                      </div>
                    </div>

                    {/* Vitals Input Form */}
                    <form onSubmit={handleSaveVitals} className="space-y-5">
                      <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-emerald-400" /> Enter Patient Vitals & Triage Data
                      </h3>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                          <label className="font-mono font-bold text-stone-400 block">Systolic BP (mmHg)</label>
                          <input
                            type="number"
                            name="sysBp"
                            value={vitals.sysBp}
                            onChange={handleInputChange}
                            className="w-full p-2 bg-stone-900 border border-stone-800 rounded-lg font-mono font-bold text-white focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>

                        <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                          <label className="font-mono font-bold text-stone-400 block">Diastolic BP (mmHg)</label>
                          <input
                            type="number"
                            name="diaBp"
                            value={vitals.diaBp}
                            onChange={handleInputChange}
                            className="w-full p-2 bg-stone-900 border border-stone-800 rounded-lg font-mono font-bold text-white focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>

                        <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                          <label className="font-mono font-bold text-stone-400 block">Heart Rate (bpm)</label>
                          <input
                            type="number"
                            name="heartRate"
                            value={vitals.heartRate}
                            onChange={handleInputChange}
                            className="w-full p-2 bg-stone-900 border border-stone-800 rounded-lg font-mono font-bold text-white focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>

                        <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                          <label className="font-mono font-bold text-stone-400 block">SpO2 Oxygen (%)</label>
                          <input
                            type="number"
                            name="spo2"
                            value={vitals.spo2}
                            onChange={handleInputChange}
                            className="w-full p-2 bg-stone-900 border border-stone-800 rounded-lg font-mono font-bold text-white focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>

                        <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                          <label className="font-mono font-bold text-stone-400 block">Body Temp (°F)</label>
                          <input
                            type="text"
                            name="temp"
                            value={vitals.temp}
                            onChange={handleInputChange}
                            className="w-full p-2 bg-stone-900 border border-stone-800 rounded-lg font-mono font-bold text-white focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>

                        <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                          <label className="font-mono font-bold text-stone-400 block">Weight (kg)</label>
                          <input
                            type="number"
                            name="weight"
                            value={vitals.weight}
                            onChange={handleInputChange}
                            className="w-full p-2 bg-stone-900 border border-stone-800 rounded-lg font-mono font-bold text-white focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>

                        <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                          <label className="font-mono font-bold text-stone-400 block">Height (cm)</label>
                          <input
                            type="number"
                            name="height"
                            value={vitals.height}
                            onChange={handleInputChange}
                            className="w-full p-2 bg-stone-900 border border-stone-800 rounded-lg font-mono font-bold text-white focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>

                        <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                          <label className="font-mono font-bold text-stone-400 block">Blood Glucose (mg/dL)</label>
                          <input
                            type="number"
                            name="bg"
                            value={vitals.bg}
                            onChange={handleInputChange}
                            className="w-full p-2 bg-stone-900 border border-stone-800 rounded-lg font-mono font-bold text-white focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="font-mono font-bold text-stone-400 block">Nurse Assessment Notes</label>
                        <textarea
                          name="nurseNotes"
                          rows={3}
                          value={vitals.nurseNotes}
                          onChange={handleInputChange}
                          placeholder="Add clinical observations, mobility status, or nursing notes..."
                          className="w-full p-3 bg-stone-950 border border-stone-800 rounded-xl text-white focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl shadow-md transition text-xs flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" /> Save Vitals & Forward to Doctor Queue
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="text-center py-12 text-stone-400 font-mono">Select a patient from the queue to enter vitals.</div>
                )}
              </div>
            </div>
          </>
        )}

        {/* VIEW 2: PATIENTS LIST */}
        {activeTab === 'patients_list' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-md flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Users className="w-6 h-6 text-emerald-400" /> Triage Patients List ({doctorQueue.length})
                </h1>
                <p className="text-xs text-stone-400 mt-1">Full list of checked-in walk-in patients awaiting vitals triage.</p>
              </div>
            </div>

            <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden shadow-md">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-950 border-b border-stone-800 text-stone-400 font-mono uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Token</th>
                    <th className="p-4">Patient Name</th>
                    <th className="p-4">Age / Gender</th>
                    <th className="p-4">Hospital Location</th>
                    <th className="p-4">Chief Complaint</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800 text-stone-200">
                  {doctorQueue.map((p, idx) => (
                    <tr key={idx} className="hover:bg-stone-800/50 transition">
                      <td className="p-4 font-mono font-bold text-emerald-400">{p.token}</td>
                      <td className="p-4 font-bold text-white">{p.name}</td>
                      <td className="p-4 text-stone-300">{p.age}y / {p.gender}</td>
                      <td className="p-4 text-stone-300">{p.hospital?.split(",")[0]}</td>
                      <td className="p-4 text-stone-300 line-clamp-1">{p.chiefComplaint}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedPatientToken(p.token);
                            setActiveTab('triage');
                          }}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition"
                        >
                          Triage Patient
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 3: APPOINTMENTS CALENDAR */}
        {activeTab === 'appointments_calendar' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-md flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-emerald-400" /> Nurse Station Appointments Calendar
                </h1>
                <p className="text-xs text-stone-400 mt-1">Daily schedule of triage arrivals and nursing check-ins.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {doctorQueue.slice(0, 6).map((p, idx) => (
                <div key={idx} className="bg-stone-900 p-5 rounded-2xl border border-stone-800 shadow-md space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-emerald-400">{p.time || `0${9+idx}:15 AM`}</span>
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold rounded border border-emerald-800">SCHEDULED</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-white">{p.name}</h3>
                  <div className="text-xs text-stone-400">Token: <strong className="font-mono text-emerald-400">{p.token}</strong></div>
                  <p className="text-xs text-stone-300 line-clamp-1 bg-stone-950 p-2 rounded border border-stone-800">{p.chiefComplaint}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: OUTREACH NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
            <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-md">
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <Bell className="w-6 h-6 text-emerald-400" /> Outreach Notifications & Patient Broadcasts
              </h1>
              <p className="text-xs text-stone-400 mt-1">SMS alerts, triage queue calls, and emergency outreach notifications.</p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 shadow-md flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">SMS OPD Token Dispatch</h4>
                  <p className="text-stone-400">Automated SMS sent to registered mobile numbers for OPD walk-ins.</p>
                </div>
                <span className="px-3 py-1 bg-emerald-950 text-emerald-300 font-mono text-xs font-bold rounded-full border border-emerald-800">ACTIVE</span>
              </div>

              <div className="p-4 bg-stone-900 rounded-2xl border border-stone-800 shadow-md flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Critical Vitals Triage Escalation</h4>
                  <p className="text-stone-400">Instant notification to Doctor Station on RED risk vitals input.</p>
                </div>
                <span className="px-3 py-1 bg-emerald-950 text-emerald-300 font-mono text-xs font-bold rounded-full border border-emerald-800">ENABLED</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-3xl">
            <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-md">
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <Settings className="w-6 h-6 text-emerald-400" /> Nurse Station Preferences
              </h1>
              <p className="text-xs text-stone-400 mt-1">Configure vitals threshold alerts, triage queues, and hardware sync.</p>
            </div>

            <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-md space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div>
                  <h4 className="font-bold text-white">Automated Vitals Risk Categorization</h4>
                  <p className="text-stone-400">Auto-tag RED/YELLOW/GREEN triage status based on BP, SpO2 & Temperature.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-500" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Spring Boot REST Vitals API Sync</h4>
                  <p className="text-stone-400">POST vitals directly to backend server endpoint `/api/nurse/record-vitals/`.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-500" />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: HELP CENTER */}
        {activeTab === 'help' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
            <div className="bg-stone-900 p-6 rounded-2xl border border-stone-800 shadow-md">
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-emerald-400" /> Nurse Help Center
              </h1>
              <p className="text-xs text-stone-400 mt-1">Triage documentation and vitals entry guidelines.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 shadow-md space-y-2">
                <h3 className="font-extrabold text-white text-sm">How to Triage a Patient</h3>
                <p className="text-stone-300">Select any patient from the queue, input Systolic/Diastolic BP, Heart Rate, SpO2, and Temp. The system will auto-calculate risk status and forward the triaged record to the Doctor Queue.</p>
              </div>

              <div className="bg-stone-900 p-5 rounded-2xl border border-stone-800 shadow-md space-y-2">
                <h3 className="font-extrabold text-white text-sm">Handling Critical Vitals Alerts</h3>
                <p className="text-stone-300">Patients with SpO2 &lt; 92% or Systolic BP &gt; 160 are automatically flagged RED for immediate priority attention in the Doctor Station.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
