import React, { useState, useEffect, useMemo } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { TN_HOSPITALS_BY_DISTRICT, TN_DISTRICTS, getPaginatedHospitals } from '../../data/tnHospitals';
import { getHospitalRoster, getAllNetworkPatients } from '../../data/hospitalRosterData';
import { HospitalLocationCard } from '../../components/common/HospitalLocationCard';
import { MEDICAL_IMAGES, ROLE_AVATARS } from '../../data/images';
import {
  UserPlus, QrCode, Printer, CheckCircle, Clock, ArrowRight, ShieldCheck,
  LogOut, Building, Activity, FileText, Search, Users, TrendingUp, MapPin,
  Calendar, AlertTriangle, ChevronLeft, ChevronRight, Eye, ShieldAlert, Sparkles, Filter,
  Stethoscope, HeartHandshake, UserCheck, Award, Pill, CheckCircle2, BarChart3, X
} from 'lucide-react';

export const AdminOfflineOpPage = ({ onStartKioskForPatient, onLogout }) => {
  const { doctorQueue, setDoctorQueue, setViewMode, updateIdentity, resetSession, appointments } = usePatientSession();
  
  // Navigation active tab: 'dashboard' | 'patients' | 'appointments' | 'hospitals' | 'registration' | 'tokens' | 'audit'
  const [activeTab, setActiveTab] = useState('dashboard');

  // Dynamic Backend Stats Integration
  const [adminStats, setAdminStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/admin/stats")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.status === "SUCCESS") {
          setAdminStats(data);
        }
      })
      .catch(() => {});
  }, [doctorQueue.length]);

  const totalScheduledVisits = adminStats?.totalScheduledVisits || 2280;
  const activeCaseload = adminStats?.activeHospitalCaseload || 2280;
  const dailyWalkInOpd = adminStats?.dailyWalkInOpd || 1480;
  const onlineAppointments = adminStats?.onlineAppointments || 892;
  const activeAppUsers = adminStats?.activeAppUsers || 342;

  // Accessibility & UI Toggles
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  // 2,280 Unique Network Patients across 380 Hospitals
  const allNetworkPatientsList = useMemo(() => getAllNetworkPatients(), []);

  // Patients Directory Tab State (2,280 Patients)
  const [patientDistrictFilter, setPatientDistrictFilter] = useState("All");
  const [patientSearchQuery, setPatientSearchQuery] = useState("");
  const [patientCurrentPage, setPatientCurrentPage] = useState(1);
  const [patientPageSize, setPatientPageSize] = useState(12);

  const filteredPatientsList = useMemo(() => {
    return allNetworkPatientsList.filter(p => {
      const matchDistrict = patientDistrictFilter === "All" || p.district === patientDistrictFilter;
      const q = patientSearchQuery.trim().toLowerCase();
      const matchSearch = !q ||
        p.name.toLowerCase().includes(q) ||
        p.token.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.hospital.toLowerCase().includes(q) ||
        p.diagnosis.toLowerCase().includes(q);
      return matchDistrict && matchSearch;
    });
  }, [allNetworkPatientsList, patientDistrictFilter, patientSearchQuery]);

  const totalPatientPages = Math.ceil(filteredPatientsList.length / patientPageSize) || 1;
  const paginatedPatientsList = filteredPatientsList.slice((patientCurrentPage - 1) * patientPageSize, patientCurrentPage * patientPageSize);

  // Appointments Tab State (892 Booked Appointments)
  const allAppointmentsList = useMemo(() => {
    return allNetworkPatientsList.filter((_, idx) => idx % 2.55 < 1).map((p, i) => ({
      ...p,
      appointmentTime: `${String(9 + (i % 7)).padStart(2, '0')}:${String((i * 15) % 60).padStart(2, '0')} ${i % 2 === 0 ? 'AM' : 'PM'}`,
      doctorName: p.assignedDoctor,
      deptName: p.diseaseCategory
    }));
  }, [allNetworkPatientsList]);

  const [appointmentDistrictFilter, setAppointmentDistrictFilter] = useState("All");
  const [appointmentSearchQuery, setAppointmentSearchQuery] = useState("");
  const [appointmentCurrentPage, setAppointmentCurrentPage] = useState(1);
  const [appointmentPageSize, setAppointmentPageSize] = useState(12);

  const filteredAppointmentsList = useMemo(() => {
    return allAppointmentsList.filter(a => {
      const matchDistrict = appointmentDistrictFilter === "All" || a.district === appointmentDistrictFilter;
      const q = appointmentSearchQuery.trim().toLowerCase();
      const matchSearch = !q ||
        a.name.toLowerCase().includes(q) ||
        a.token.toLowerCase().includes(q) ||
        a.doctorName.toLowerCase().includes(q) ||
        a.hospital.toLowerCase().includes(q);
      return matchDistrict && matchSearch;
    });
  }, [allAppointmentsList, appointmentDistrictFilter, appointmentSearchQuery]);

  const totalAppointmentPages = Math.ceil(filteredAppointmentsList.length / appointmentPageSize) || 1;
  const paginatedAppointmentsList = filteredAppointmentsList.slice((appointmentCurrentPage - 1) * appointmentPageSize, appointmentCurrentPage * appointmentPageSize);

  // Tokens Tab State (2,280 Token Slips)
  const [tokenDistrictFilter, setTokenDistrictFilter] = useState("All");
  const [tokenSearchQuery, setTokenSearchQuery] = useState("");
  const [tokenCurrentPage, setTokenCurrentPage] = useState(1);
  const [tokenPageSize, setTokenPageSize] = useState(12);

  const filteredTokensList = useMemo(() => {
    return allNetworkPatientsList.filter(t => {
      const matchDistrict = tokenDistrictFilter === "All" || t.district === tokenDistrictFilter;
      const q = tokenSearchQuery.trim().toLowerCase();
      const matchSearch = !q ||
        t.name.toLowerCase().includes(q) ||
        t.token.toLowerCase().includes(q) ||
        t.hospital.toLowerCase().includes(q);
      return matchDistrict && matchSearch;
    });
  }, [allNetworkPatientsList, tokenDistrictFilter, tokenSearchQuery]);

  const totalTokenPages = Math.ceil(filteredTokensList.length / tokenPageSize) || 1;
  const paginatedTokensList = filteredTokensList.slice((tokenCurrentPage - 1) * tokenPageSize, tokenCurrentPage * tokenPageSize);

  // Registration Form State
  const [district, setDistrict] = useState("Chennai");
  const [hospital, setHospital] = useState(TN_HOSPITALS_BY_DISTRICT["Chennai"][0]);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    aadhaar: "",
    department: "General Medicine OPD",
    triage: "Normal"
  });

  // Registered Tokens Queue uses doctorQueue from Context (10 Tamil Actor Patients)
  const registeredTokens = doctorQueue;

  const [generatedTicket, setGeneratedTicket] = useState(null);

  // Dedicated Hospital Panel State (Full Screen Control Panel with Left Sidebar)
  const [selectedHospitalView, setSelectedHospitalView] = useState(null);
  const [activeHospitalViewTab, setActiveHospitalViewTab] = useState('overview'); // 'overview' | 'doctors' | 'nurses' | 'receptionist' | 'patients' | 'analytics'
  const [analyticsCategoryFilter, setAnalyticsCategoryFilter] = useState('All');

  // Hospital Roster & Analytics Modal State (10 Members: 2 Doctors, 1 Nurse, 1 Receptionist, 6 Patients)
  const [rosterModalOpen, setRosterModalOpen] = useState(false);
  const [selectedHospitalRoster, setSelectedHospitalRoster] = useState(null);
  const [activeRosterTab, setActiveRosterTab] = useState('doctors'); // 'doctors' | 'nurses' | 'receptionist' | 'patients' | 'analytics'
  const [promotionStatusMap, setPromotionStatusMap] = useState({});

  const handleOpenHospitalPanel = (hospitalName, districtName = "Chennai") => {
    const fallback = getHospitalRoster(hospitalName, districtName);
    fetch(`http://localhost:8080/api/admin/hospitals/roster/${encodeURIComponent(hospitalName)}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.doctors) {
          setSelectedHospitalView({ ...fallback, ...data });
        } else {
          setSelectedHospitalView(fallback);
        }
      })
      .catch(() => {
        setSelectedHospitalView(fallback);
      });
    setActiveHospitalViewTab('overview');
  };

  const handleOpenRosterModal = (hospitalName, districtName = "Chennai") => {
    const fallback = getHospitalRoster(hospitalName, districtName);
    fetch(`http://localhost:8080/api/admin/hospitals/roster/${encodeURIComponent(hospitalName)}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.doctors) {
          setSelectedHospitalRoster({ ...fallback, ...data });
        } else {
          setSelectedHospitalRoster(fallback);
        }
      })
      .catch(() => {
        setSelectedHospitalRoster(fallback);
      });
    setActiveRosterTab('doctors');
    setRosterModalOpen(true);
  };

  const handlePromoteDoctor = (docId, docName, hospitalName) => {
    fetch("http://localhost:8080/api/admin/hospitals/promote-doctor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ doctorId: docId, doctorName: docName, hospitalName: hospitalName })
    }).catch(() => {});

    setPromotionStatusMap(prev => ({ ...prev, [docId]: true }));
    if (selectedHospitalRoster) {
      setSelectedHospitalRoster(prev => ({
        ...prev,
        doctors: prev.doctors.map(d => d.id === docId ? { ...d, promoted: true } : d)
      }));
    }
    if (selectedHospitalView) {
      setSelectedHospitalView(prev => ({
        ...prev,
        doctors: prev.doctors.map(d => d.id === docId ? { ...d, promoted: true } : d)
      }));
    }
    alert(`🏆 PROMOTION AWARDED! Dr. ${docName} has been officially granted Senior Specialist Distinction & Promotion by Executive Admin!`);
  };

  // TN Hospitals Pagination & Sorting State
  const [hospitalDistrict, setHospitalDistrict] = useState("All");
  const [hospitalSearch, setHospitalSearch] = useState("");
  const [sortBy, setSortBy] = useState("nameAsc"); // 'nameAsc' | 'nameDesc' | 'districtAsc' | 'opdDesc'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Fetch Paginated Hospitals using helper
  const paginatedData = getPaginatedHospitals({
    district: hospitalDistrict,
    searchQuery: hospitalSearch,
    sortBy: sortBy,
    page: currentPage,
    pageSize: pageSize
  });

  // Reset pagination page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [hospitalDistrict, hospitalSearch, sortBy, pageSize]);

  const handleDistrictChange = (e) => {
    const d = e.target.value;
    setDistrict(d);
    setHospital(TN_HOSPITALS_BY_DISTRICT[d][0]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitRegistration = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.phone) {
      alert("Please fill in patient name, age, and phone number.");
      return;
    }

    const tokenNum = "OPD-" + Math.floor(100 + Math.random() * 900);
    const newRecord = {
      token: tokenNum,
      name: formData.name,
      age: formData.age,
      gender: formData.gender,
      phone: formData.phone,
      aadhaar: formData.aadhaar || "N/A",
      hospital: hospital,
      department: formData.department,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "Registered Offline"
    };

    // REST call to Spring Boot Backend
    fetch("http://localhost:8080/api/admin/register-offline-op", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        phone: formData.phone,
        hospital: hospital,
        department: formData.department
      })
    })
      .then(res => res.ok ? res.json() : null)
      .then(() => {
        fetch("http://localhost:8080/api/admin/stats")
          .then(r => r.ok ? r.json() : null)
          .then(data => { if (data && data.status === "SUCCESS") setAdminStats(data); })
          .catch(() => {});
      })
      .catch(() => {});

    setAdminStats(prev => prev ? {
      ...prev,
      totalScheduledVisits: (prev.totalScheduledVisits || 2280) + 1,
      activeHospitalCaseload: (prev.activeHospitalCaseload || 2280) + 1,
      dailyWalkInOpd: (prev.dailyWalkInOpd || 1480) + 1,
      totalNetworkMembers: (prev.totalNetworkMembers || 3801) + 1
    } : {
      totalScheduledVisits: 2281,
      activeHospitalCaseload: 2281,
      dailyWalkInOpd: 1481,
      onlineAppointments: 892,
      totalNetworkMembers: 3802
    });
    setDoctorQueue(prev => [
      {
        token: tokenNum,
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        phone: formData.phone,
        aadhaar: formData.aadhaar || "N/A",
        hospital: hospital,
        department: formData.department,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chiefComplaint: "Walk-in registration at counter desk",
        summaryText: `Patient registered at counter desk (${hospital}). Pending voice intake.`,
        status: "Registered Offline",
        ayushMode: formData.department.includes("Ayush") || formData.department.includes("Ayurveda")
      },
      ...prev
    ]);
    setGeneratedTicket(newRecord);
  };

  const handleStartKioskIntake = (patientRecord) => {
    resetSession();
    updateIdentity({
      name: patientRecord.name,
      age: patientRecord.age,
      gender: patientRecord.gender,
      token: patientRecord.token,
      consentGiven: true
    });
    setViewMode('kiosk');
  };

  const handleTriggerSOS = () => {
    setSosTriggered(true);
    alert("🚨 CARDIAC EMERGENCY SOS ALARM TRIGGERED! Hospital Triage Team notified.");
  };

  // DEDICATED HOSPITAL CONTROL VIEW WITH FULL LEFT SIDEBAR
  if (selectedHospitalView) {
    const hospitalRoster = selectedHospitalView;
    const diseaseBreakdown = hospitalRoster.diseaseBreakdown || [
      { category: "Heart & Cardiac Care", total: 2, cured: 2, percentage: 33 },
      { category: "Orthopedic & Joint Care", total: 1, cured: 1, percentage: 17 },
      { category: "Respiratory & ENT Care", total: 1, cured: 1, percentage: 17 },
      { category: "Diabetes & Metabolic", total: 1, cured: 1, percentage: 17 },
      { category: "Ayush & Gastro Care", total: 1, cured: 1, percentage: 16 }
    ];
    const hospitalSummary = hospitalRoster.summary || {
      hospitalCureRate: 100,
      curedPatients: 6,
      totalPatients: 6,
      totalMembers: 10
    };

    return (
      <div className={`min-h-screen ${highContrast ? 'bg-black text-yellow-300' : 'bg-stone-950 text-white'} flex flex-col md:flex-row overflow-hidden ${largeText ? 'text-base' : 'text-xs'}`}>
        
        {/* DEDICATED HOSPITAL CONTROL PANEL SIDEBAR */}
        <aside className="hidden md:flex md:flex-col md:w-72 bg-stone-900 border-r border-stone-800 p-5 justify-between shrink-0 shadow-2xl sticky top-0 h-screen overflow-y-auto">
          <div className="space-y-5">
            {/* Back Button */}
            <button
              onClick={() => setSelectedHospitalView(null)}
              className="w-full p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-extrabold text-xs flex items-center justify-center gap-2 border border-stone-700 transition shadow-md"
            >
              <ChevronLeft className="w-4 h-4 text-emerald-400" />
              <span>Back to 380 Hospitals List</span>
            </button>

            {/* Hospital Branding Header */}
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-stone-950 text-base shadow-md">
                  H
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                    {hospitalRoster.districtName || 'Tamil Nadu District'}
                  </span>
                  <div className="text-[10px] text-stone-400 font-mono">10 Personnel Roster</div>
                </div>
              </div>
              <h2 className="font-black text-sm text-white leading-tight">
                {hospitalRoster.hospitalName}
              </h2>
              <div className="text-[10px] text-emerald-300 font-bold flex items-center gap-1.5 pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Active Hospital Operational Control</span>
              </div>
            </div>

            {/* Sidebar Sub-heading */}
            <div className="px-1 text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">
              Hospital Control Menu
            </div>

            {/* Dedicated Hospital Navigation Buttons */}
            <nav className="space-y-1 font-semibold text-xs">
              <button
                onClick={() => setActiveHospitalViewTab('overview')}
                className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                  activeHospitalViewTab === 'overview' ? 'bg-emerald-600 text-white shadow-md font-bold' : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <Activity className="w-4 h-4 text-emerald-300" /> Hospital Overview
              </button>

              <button
                onClick={() => setActiveHospitalViewTab('doctors')}
                className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                  activeHospitalViewTab === 'doctors' ? 'bg-emerald-600 text-white shadow-md font-bold' : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <Stethoscope className="w-4 h-4 text-emerald-300" /> Doctors Panel ({hospitalRoster.doctors?.length || 2})
              </button>

              <button
                onClick={() => setActiveHospitalViewTab('nurses')}
                className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                  activeHospitalViewTab === 'nurses' ? 'bg-emerald-600 text-white shadow-md font-bold' : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <HeartHandshake className="w-4 h-4 text-emerald-300" /> Nurses Staff (1)
              </button>

              <button
                onClick={() => setActiveHospitalViewTab('receptionist')}
                className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                  activeHospitalViewTab === 'receptionist' ? 'bg-emerald-600 text-white shadow-md font-bold' : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <UserCheck className="w-4 h-4 text-emerald-300" /> Receptionist Desk (1)
              </button>

              <button
                onClick={() => setActiveHospitalViewTab('patients')}
                className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                  activeHospitalViewTab === 'patients' ? 'bg-emerald-600 text-white shadow-md font-bold' : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <Users className="w-4 h-4 text-emerald-300" /> Patients Directory ({hospitalRoster.patients?.length || 6})
              </button>

              <button
                onClick={() => setActiveHospitalViewTab('analytics')}
                className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                  activeHospitalViewTab === 'analytics' ? 'bg-emerald-600 text-white shadow-md font-bold' : 'text-stone-300 hover:bg-stone-800'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-emerald-300" /> Disease Analytics Panel
              </button>
            </nav>
          </div>

          {/* Dedicated Sidebar Footer */}
          <div className="pt-4 border-t border-stone-800 space-y-3">
            <div className="p-3 bg-stone-950 rounded-xl border border-stone-800 space-y-1 text-[11px]">
              <div className="text-stone-400 font-bold">Network Integration</div>
              <div className="text-emerald-400 font-mono font-black">3,801 Members Live</div>
            </div>

            <button
              onClick={() => setSelectedHospitalView(null)}
              className="w-full p-2.5 rounded-xl bg-stone-800 hover:bg-rose-900/40 text-stone-300 hover:text-rose-400 text-xs font-bold flex items-center justify-center gap-2 border border-stone-700 transition"
            >
              <LogOut className="w-4 h-4" /> Exit Dedicated View
            </button>
          </div>
        </aside>

        {/* MAIN WORKSPACE FOR DEDICATED HOSPITAL CONTROL PANEL */}
        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-stone-950 p-4 md:p-6 space-y-6">
          {/* Top Bar Header */}
          <header className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-xl flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedHospitalView(null)}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
              >
                <ChevronLeft className="w-5 h-5 text-emerald-400" />
              </button>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                  Dedicated Hospital Control Panel • {hospitalRoster.districtName || 'TN District'}
                </span>
                <h1 className="text-lg font-black text-white">{hospitalRoster.hospitalName}</h1>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs flex-wrap">
              <div className="bg-emerald-950 border border-emerald-700 px-3 py-1.5 rounded-xl text-emerald-300 font-mono font-bold flex items-center gap-1.5">
                <span>Roster: 10 Personnel (0 Overlap)</span>
              </div>
              <button
                onClick={handleTriggerSOS}
                className="px-3 py-1.5 bg-rose-900/60 hover:bg-rose-800 border border-rose-600 text-rose-200 font-bold rounded-xl flex items-center gap-1.5 shadow-md"
              >
                <AlertTriangle className="w-4 h-4 text-rose-400" /> Cardiac SOS
              </button>
            </div>
          </header>

          {/* Hospital Location Card Banner */}
          <div className="bg-stone-900 p-2 rounded-2xl border border-stone-800">
            <HospitalLocationCard hospitalName={hospitalRoster.hospitalName} />
          </div>

          {/* DEDICATED TABS CONTENT */}
          {/* 1. OVERVIEW TAB */}
          {activeHospitalViewTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-2">
                  <div className="text-stone-400 text-xs font-bold uppercase">Doctors On Duty</div>
                  <div className="text-3xl font-black text-white font-mono">{hospitalRoster.doctors?.length || 2} Doctors</div>
                  <div className="text-emerald-400 text-[11px] font-semibold">1 Senior + 1 Associate</div>
                </div>
                <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-2">
                  <div className="text-stone-400 text-xs font-bold uppercase">Staff Nurse</div>
                  <div className="text-3xl font-black text-emerald-400 font-mono">1 Active Nurse</div>
                  <div className="text-stone-300 text-[11px] font-semibold">{hospitalRoster.nurse?.name}</div>
                </div>
                <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-2">
                  <div className="text-stone-400 text-xs font-bold uppercase">Reception Desk</div>
                  <div className="text-3xl font-black text-amber-400 font-mono">Counter Desk #1</div>
                  <div className="text-stone-300 text-[11px] font-semibold">{hospitalRoster.receptionist?.speed}</div>
                </div>
                <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl space-y-2">
                  <div className="text-stone-400 text-xs font-bold uppercase">Assigned Patients</div>
                  <div className="text-3xl font-black text-cyan-400 font-mono">6 Patients</div>
                  <div className="text-emerald-400 text-[11px] font-semibold">100% Cured & Resolved</div>
                </div>
              </div>

              {/* Clinical Highlights Card */}
              <div className="bg-stone-900 border border-stone-800 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-400" /> Hospital Clinical Outcome Highlights
                  </h3>
                  <button
                    onClick={() => setActiveHospitalViewTab('analytics')}
                    className="text-xs text-emerald-400 hover:underline font-bold"
                  >
                    View Full Disease Analytics Panel →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-1">
                    <div className="text-stone-400 font-bold">Overall Recovery Rate</div>
                    <div className="text-2xl font-black text-emerald-400 font-mono">{hospitalSummary.hospitalCureRate}%</div>
                    <div className="text-stone-500 text-[10px]">100% Prescriptions Efficacy</div>
                  </div>
                  <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-1">
                    <div className="text-stone-400 font-bold">Top Disease Specialization</div>
                    <div className="text-base font-extrabold text-white">Cardiology & Ayush</div>
                    <div className="text-emerald-400 text-[10px]">Integrative Care Protocol</div>
                  </div>
                  <div className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-1">
                    <div className="text-stone-400 font-bold">Average Cure Duration</div>
                    <div className="text-2xl font-black text-amber-400 font-mono">8.5 Days</div>
                    <div className="text-stone-500 text-[10px]">Within 14-day limit</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. DOCTORS TAB */}
          {activeHospitalViewTab === 'doctors' && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-400" /> Assigned Medical Doctors ({hospitalRoster.doctors?.length || 2})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hospitalRoster.doctors?.map((doc) => {
                  const isPromoted = doc.promoted || promotionStatusMap[doc.id];
                  return (
                    <div key={doc.id} className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4 shadow-md">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-300 font-bold">
                            <Stethoscope className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-sm text-white">{doc.name}</h3>
                            <div className="text-xs text-stone-400">{doc.qualification}</div>
                            <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">{doc.spec}</div>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 text-[10px] font-mono">{doc.id}</span>
                      </div>

                      <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-stone-400">Clinical Patient Recovery Rate:</span>
                          <strong className="text-emerald-400 font-mono text-sm">{doc.cureRate}%</strong>
                        </div>
                        <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden border border-stone-800">
                          <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${doc.cureRate}%` }}></div>
                        </div>
                      </div>

                      <div>
                        {isPromoted ? (
                          <div className="w-full p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/50 text-amber-300 font-bold text-xs flex items-center justify-center gap-2">
                            <Award className="w-4 h-4 text-amber-400 animate-pulse" />
                            <span>Promoted Senior Specialist Distinction (Admin Awarded)</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handlePromoteDoctor(doc.id, doc.name, hospitalRoster.hospitalName)}
                            className="w-full p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition"
                          >
                            <Award className="w-4 h-4" />
                            <span>Award Doctor Promotion & Senior Specialist Distinction</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. NURSES TAB */}
          {activeHospitalViewTab === 'nurses' && hospitalRoster.nurse && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-emerald-400" /> Staff Nurse Duty Assignment
              </h2>
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-300 font-bold text-lg">
                    <HeartHandshake className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">{hospitalRoster.nurse.name}</h3>
                    <div className="text-xs text-stone-400">{hospitalRoster.nurse.rank} • {hospitalRoster.nurse.dept}</div>
                    <div className="text-xs text-emerald-400 font-semibold">Shift: {hospitalRoster.nurse.shift}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs border-t border-stone-800 pt-4">
                  <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                    <div className="text-stone-500 font-bold text-[10px]">Triage Vitals Logged Today</div>
                    <div className="text-xl font-black text-emerald-400 font-mono mt-1">{hospitalRoster.nurse.vitalsLoggedToday} Patients</div>
                  </div>
                  <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                    <div className="text-stone-500 font-bold text-[10px]">Staff Nurse ID</div>
                    <div className="text-sm font-bold text-white font-mono mt-1">{hospitalRoster.nurse.id}</div>
                  </div>
                  <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                    <div className="text-stone-500 font-bold text-[10px]">Bedside Care Status</div>
                    <div className="text-xs font-bold text-emerald-300 mt-1">Active Duty • Ward Triage Ready</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. RECEPTIONIST TAB */}
          {activeHospitalViewTab === 'receptionist' && hospitalRoster.receptionist && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" /> Reception Desk Officer
              </h2>
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-700 flex items-center justify-center text-emerald-300 font-bold text-lg">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">{hospitalRoster.receptionist.name}</h3>
                    <div className="text-xs text-stone-400">Hospital Reception Desk Officer</div>
                    <div className="text-xs text-emerald-400 font-semibold">{hospitalRoster.receptionist.desk}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs border-t border-stone-800 pt-4">
                  <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                    <div className="text-stone-500 font-bold text-[10px]">OP Tokens Issued Today</div>
                    <div className="text-xl font-black text-emerald-400 font-mono mt-1">{hospitalRoster.receptionist.tokensIssuedToday} Tickets</div>
                  </div>
                  <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                    <div className="text-stone-500 font-bold text-[10px]">Processing Speed</div>
                    <div className="text-sm font-bold text-white font-mono mt-1">{hospitalRoster.receptionist.speed}</div>
                  </div>
                  <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                    <div className="text-stone-500 font-bold text-[10px]">Desk Counter Status</div>
                    <div className="text-xs font-bold text-emerald-300 mt-1">Active Walk-in OP Counter</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. PATIENTS TAB */}
          {activeHospitalViewTab === 'patients' && (
            <div className="space-y-4">
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" /> Hospital Patient Records ({hospitalRoster.patients?.length || 6})
              </h2>
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-950 text-stone-400 uppercase font-bold text-[10px] tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="p-3">Token / ID</th>
                      <th className="p-3">Patient Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Diagnosis & Specialty</th>
                      <th className="p-3">Prescribed Medication</th>
                      <th className="p-3">Prescription Limit</th>
                      <th className="p-3">Recovery Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {hospitalRoster.patients?.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-950/60 transition">
                        <td className="p-3 font-mono font-bold text-emerald-400">{p.token}</td>
                        <td className="p-3 font-bold text-white">
                          <div>{p.name}</div>
                          <div className="text-[10px] text-stone-500 font-normal">{p.age} yrs • {p.gender}</div>
                        </td>
                        <td className="p-3 text-stone-400">{p.category}</td>
                        <td className="p-3">
                          <div className="font-semibold text-stone-200">{p.diagnosis}</div>
                          <div className="text-[10px] text-emerald-400">{p.diseaseCategory}</div>
                        </td>
                        <td className="p-3 font-mono text-stone-300">
                          <div className="flex items-center gap-1">
                            <Pill className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <span>{p.tablets}</span>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-stone-400">{p.prescribedDays} Days Limit</td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1 w-max">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            {p.recoveryStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. DISEASE ANALYTICS TAB */}
          {activeHospitalViewTab === 'analytics' && (
            <div className="space-y-6">
              {/* Top Banner Stats */}
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4 border-b border-stone-800 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-emerald-400" /> Hospital Disease Analysis & Treatment Analytics
                    </h2>
                    <p className="text-xs text-stone-400">
                      Real-time breakdown of medical conditions, drug efficacy, and recovery outcomes for {hospitalRoster.hospitalName}
                    </p>
                  </div>
                  <div className="px-4 py-2 bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono font-bold text-xs rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Hospital Cure Rate: {hospitalSummary.hospitalCureRate}%</span>
                  </div>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                  <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1">
                    <div className="text-stone-400 font-bold uppercase text-[10px]">Total Patients Analyzed</div>
                    <div className="text-2xl font-black text-white font-mono">{hospitalRoster.patients?.length || 6} Patients</div>
                    <div className="text-emerald-400 text-[10px]">6 Unique Profiles</div>
                  </div>
                  <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1">
                    <div className="text-stone-400 font-bold uppercase text-[10px]">Cured & Resolved</div>
                    <div className="text-2xl font-black text-emerald-400 font-mono">{hospitalRoster.patients?.filter(p => p.cured).length || 6} / {hospitalRoster.patients?.length || 6}</div>
                    <div className="text-emerald-300 text-[10px]">100% Recovery Rate</div>
                  </div>
                  <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1">
                    <div className="text-stone-400 font-bold uppercase text-[10px]">Major Specializations</div>
                    <div className="text-2xl font-black text-amber-400 font-mono">5 Categories</div>
                    <div className="text-amber-300 text-[10px]">Allopathy & Ayush</div>
                  </div>
                  <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-1">
                    <div className="text-stone-400 font-bold uppercase text-[10px]">Avg Recovery Time</div>
                    <div className="text-2xl font-black text-cyan-400 font-mono">8.5 Days</div>
                    <div className="text-cyan-300 text-[10px]">Prescription Limit: 14 Days</div>
                  </div>
                </div>
              </div>

              {/* Disease Category Distribution Grid */}
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4">
                <h3 className="font-extrabold text-sm text-white">Disease Category Distribution & Recovery Metrics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {diseaseBreakdown.map((d, idx) => (
                    <div key={idx} className="bg-stone-950 border border-stone-800 p-4 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-400">{d.category}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono font-bold">{d.percentage || Math.round((d.total/6)*100)}% Load</span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-black text-white font-mono">{d.cured || d.total} / {d.total}</span>
                        <span className="text-[10px] text-emerald-300 font-bold">100% Cured</span>
                      </div>
                      <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden border border-stone-800">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
                      </div>
                      <div className="text-[10px] text-stone-400">
                        Prescription Efficacy: <strong className="text-white">High (Ayush + Allopathy)</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Filterable Disease & Patient Case Breakdown */}
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h3 className="font-extrabold text-sm text-white">Specific Diagnosed Conditions & Efficacy Tracking</h3>

                  {/* Filter Buttons */}
                  <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-bold">
                    {["All", "Heart & Cardiac Care", "Orthopedic & Joint Care", "Respiratory & ENT Care", "Diabetes & Metabolic", "Ayush & Gastro Care"].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setAnalyticsCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg transition shrink-0 ${
                          analyticsCategoryFilter === cat
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-950 text-stone-400 hover:bg-stone-800 hover:text-white border border-stone-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-950 text-stone-400 uppercase font-bold text-[10px] tracking-wider border-b border-stone-800">
                      <tr>
                        <th className="p-3">Patient ID</th>
                        <th className="p-3">Patient Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Specific Diagnosis</th>
                        <th className="p-3">Prescribed Treatment</th>
                        <th className="p-3">Limit vs Cure</th>
                        <th className="p-3">Outcome Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800">
                      {(hospitalRoster.patients || [])
                        .filter(p => analyticsCategoryFilter === 'All' || p.diseaseCategory === analyticsCategoryFilter)
                        .map(p => (
                          <tr key={p.id} className="hover:bg-stone-950/60 transition">
                            <td className="p-3 font-mono font-bold text-emerald-400">{p.id}</td>
                            <td className="p-3 font-bold text-white">{p.name}</td>
                            <td className="p-3 text-stone-400">{p.category}</td>
                            <td className="p-3">
                              <div className="font-semibold text-stone-200">{p.diagnosis}</div>
                              <div className="text-[10px] text-emerald-400">{p.diseaseCategory}</div>
                            </td>
                            <td className="p-3 font-mono text-stone-300">
                              <div className="flex items-center gap-1">
                                <Pill className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span>{p.tablets}</span>
                              </div>
                            </td>
                            <td className="p-3 font-mono text-stone-300">
                              <div>{p.prescribedDays} Days Limit</div>
                              <div className="text-[10px] text-emerald-400">Cured Day {p.recoveryDays || p.prescribedDays - 2}</div>
                            </td>
                            <td className="p-3">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1 w-max">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                {p.recoveryStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${highContrast ? 'bg-black text-yellow-300' : 'bg-stone-950 text-white'} flex flex-col md:flex-row overflow-hidden ${largeText ? 'text-base' : 'text-xs'}`}>
      
      {/* STATIC FIXED LEFT SIDEBAR (DESKTOP ONLY - HIDDEN ON MOBILE/PHONE VIEW) */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-stone-900 border-r border-stone-800 p-5 justify-between shrink-0 shadow-2xl sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-6">
          {/* Logo Branding */}
          <div className="flex items-center gap-3 border-b border-stone-800 pb-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-xl text-stone-950 shadow-md">
              M
            </div>
            <div>
              <h2 className="font-black text-base text-white tracking-tight">MediKiosk Platform</h2>
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Hospital Operations AI</div>
            </div>
          </div>

          {/* User Role Card */}
          <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800 space-y-1">
            <div className="text-[10px] uppercase font-bold text-stone-400">Logged in as:</div>
            <div className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Admin ROLE
            </div>
          </div>

          {/* Portal Sub-heading */}
          <div className="px-1 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
            Admin Command Center
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 font-semibold text-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeTab === 'dashboard' ? 'bg-emerald-600 text-white shadow-md font-bold' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Activity className="w-4 h-4 text-emerald-400" /> Admin Command Center
            </button>

            <button
              onClick={() => setActiveTab('patients')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeTab === 'patients' ? 'bg-emerald-600 text-white shadow-md font-bold' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Users className="w-4 h-4 text-emerald-400" /> Patients Management
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeTab === 'appointments' ? 'bg-emerald-600 text-white shadow-md font-bold' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Calendar className="w-4 h-4 text-emerald-400" /> Appointments Calendar
            </button>

            <button
              onClick={() => setActiveTab('hospitals')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeTab === 'hospitals' ? 'bg-emerald-600 text-white shadow-md font-bold' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Building className="w-4 h-4 text-emerald-400" /> TN Hospitals (380 Total)
            </button>

            <button
              onClick={() => setActiveTab('registration')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeTab === 'registration' ? 'bg-emerald-600 text-white shadow-md font-bold' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <UserPlus className="w-4 h-4 text-emerald-400" /> Walk-in OP Registration
            </button>

            <button
              onClick={() => setActiveTab('tokens')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeTab === 'tokens' ? 'bg-emerald-600 text-white shadow-md font-bold' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Printer className="w-4 h-4 text-emerald-400" /> Token Slips & Analytics ({registeredTokens.length})
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeTab === 'audit' ? 'bg-emerald-600 text-white shadow-md font-bold' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-400" /> System Audit Logs
            </button>
          </nav>
        </div>

        {/* Sidebar Footer & Role Switcher */}
        <div className="pt-4 border-t border-stone-800 space-y-3">
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-stone-500 tracking-wider px-1">Switch Role Portal</div>
            <div className="grid grid-cols-2 gap-1 text-[11px] font-semibold">
              <button onClick={() => setViewMode('patient-portal')} className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-left truncate">
                ▸ Patient
              </button>
              <button onClick={() => setViewMode('receptionist')} className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-left truncate">
                ▸ Receptionist
              </button>
              <button onClick={() => setViewMode('nurse')} className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-left truncate">
                ▸ Nurse
              </button>
              <button onClick={() => setViewMode('doctor')} className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-left truncate">
                ▸ Doctor
              </button>
            </div>
          </div>

          <button
            onClick={() => setViewMode('login')}
            className="w-full p-2.5 rounded-xl bg-stone-800 hover:bg-rose-900/40 text-stone-300 hover:text-rose-400 text-xs font-bold flex items-center justify-center gap-2 border border-stone-700 transition"
          >
            <LogOut className="w-4 h-4" /> Logout Admin Desk
          </button>

          <div className="text-[10px] text-stone-500 font-mono text-center pt-1">
            MediKiosk Hospital OS v2.4
          </div>
        </div>
      </aside>

      {/* MAIN WORKSPACE AREA */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-stone-950 p-4 md:p-6 space-y-6">

        {/* TOP ACCESSIBILITY & HEADER BAR (MATCHING REFERENCE SCREENSHOT) */}
        <header className="bg-stone-900 border border-stone-800 rounded-2xl p-4 shadow-xl flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Hospital Platform</span>
              <h1 className="text-lg font-black text-white">MediKiosk Operations</h1>
            </div>

            {/* Global Search Bar */}
            <div className="relative flex-1 hidden sm:block">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search patients, records, hospitals..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Right Header Status Controls & Accessibility */}
          <div className="flex items-center gap-3 text-xs flex-wrap">
            <div className="bg-emerald-950 border border-emerald-700 px-3 py-1.5 rounded-xl text-emerald-300 font-mono font-bold flex items-center gap-1.5">
              <span>SMS (+91 7598357132)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <div className="bg-stone-800 px-3 py-1.5 rounded-xl text-stone-200 font-bold border border-stone-700">
              Role: <strong className="text-emerald-400">Admin</strong>
            </div>

            {/* Cardiac Emergency SOS Trigger */}
            <button
              onClick={handleTriggerSOS}
              className={`px-3 py-1.5 font-bold rounded-xl flex items-center gap-1.5 shadow-md transition ${
                sosTriggered
                  ? 'bg-rose-600 text-white animate-bounce'
                  : 'bg-rose-900/60 hover:bg-rose-800 border border-rose-600 text-rose-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Trigger Cardiac SOS Alarm (10 Taps)</span>
            </button>

            {/* Accessibility Checkbox Toggles */}
            <div className="flex items-center gap-3 text-stone-300 font-medium text-[11px] bg-stone-950 p-2 rounded-xl border border-stone-800">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={largeText}
                  onChange={(e) => setLargeText(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span>Large Text</span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                  className="rounded text-emerald-600"
                />
                <span>High Contrast Mode</span>
              </label>
            </div>
          </div>
        </header>

        {/* TAB 1: ADMIN COMMAND CENTER DASHBOARD (MATCHING REFERENCE SCREENSHOT) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Hero Executive Banner */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-stone-900 via-stone-950 to-emerald-950 p-6 md:p-8 border border-stone-800 shadow-2xl space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Hospital Platform • MediKiosk Executive Operations
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-white">
                  MediKiosk Operations Command Center
                </h2>
                <p className="text-xs text-stone-300 max-w-2xl">
                  Real-time healthcare intelligence and follow-up management across {totalScheduledVisits} registered outpatient sessions and 380 Tamil Nadu Government Hospitals.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => alert("Generating Executive PDF Audit Report...")}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs flex items-center gap-2 shadow-md transition"
                >
                  <span>Export Executive PDF Report</span> <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('patients')}
                  className="px-5 py-2.5 bg-white text-stone-950 hover:bg-stone-200 font-extrabold rounded-xl text-xs flex items-center gap-2 transition"
                >
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>Patients Directory</span>
                </button>
              </div>
            </div>

            {/* 4 Stat Metric Cards (Dynamic Backend & Patient Queue Integration) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Card 1: Total Scheduled Visits */}
              <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl shadow-xl space-y-3">
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Total Scheduled Visits
                </div>
                <div className="text-3xl font-black text-white font-mono">
                  {totalScheduledVisits}
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span>Active hospital caseload</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px]">{activeCaseload} Active</span>
                </div>
              </div>

              {/* Card 2: Active Walk-ins */}
              <div className="bg-stone-900 border border-emerald-500/30 p-5 rounded-2xl shadow-xl space-y-3">
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Daily Walk-in OPD
                </div>
                <div className="text-3xl font-black text-emerald-400 font-mono">
                  {dailyWalkInOpd}
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span>High counter velocity</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px]">Counter Active</span>
                </div>
              </div>

              {/* Card 3: Online Appointments */}
              <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl shadow-xl space-y-3">
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Online Appointments
                </div>
                <div className="text-3xl font-black text-amber-400 font-mono">
                  {onlineAppointments}
                </div>
                <div className="text-[11px] text-stone-400 font-semibold flex items-center gap-1">
                  <span>Requires standard intake</span>
                  <span className="px-1.5 py-0.5 rounded bg-stone-800 text-amber-300 text-[10px]">Portal Booked</span>
                </div>
              </div>

              {/* Card 4: Active Kiosk Session Users */}
              <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl shadow-xl space-y-3">
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Active Kiosk Users
                </div>
                <div className="text-3xl font-black text-cyan-400 font-mono">
                  {activeAppUsers}
                </div>
                <div className="text-[11px] text-cyan-300 font-semibold flex items-center gap-1">
                  <span>Voice intake active</span>
                  <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px]">Voice Kiosk</span>
                </div>
              </div>
            </div>

            {/* Quick Live Patients Section */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" /> Active Outpatient Desk Intake Queue
                </h3>
                <button onClick={() => setActiveTab('registration')} className="text-xs text-emerald-400 hover:underline font-bold">
                  + Register New Walk-in Patient
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {registeredTokens.map(t => (
                  <div key={t.token} className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono font-bold">
                        {t.token}
                      </span>
                      <span className="text-stone-400 text-[11px]">{t.time}</span>
                    </div>

                    <div>
                      <div className="font-extrabold text-sm text-white">{t.name}</div>
                      <div className="text-stone-400">{t.age} yrs • {t.gender} • {t.department}</div>
                      <div className="text-stone-500 text-[11px] line-clamp-1">{t.hospital}</div>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-stone-800/60">
                      <span className="text-[10px] text-emerald-400 font-bold">Desk Status: {t.status}</span>
                      <button
                        onClick={() => handleStartKioskIntake(t)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] flex items-center gap-1"
                      >
                        Start Voice Kiosk
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PATIENTS MANAGEMENT */}
        {activeTab === 'patients' && (
          <div className="space-y-6">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3 flex-wrap gap-2">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-emerald-400" /> Outpatient Records Directory
                  </h2>
                  <p className="text-xs text-stone-400">Complete OPD registration history across all 380 Tamil Nadu Government Hospitals (2,280 Total Patients)</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-emerald-950 border border-emerald-700 text-emerald-300 rounded-xl font-bold text-xs font-mono">
                    Showing {((patientCurrentPage - 1) * patientPageSize) + 1} to {Math.min(patientCurrentPage * patientPageSize, filteredPatientsList.length)} of {filteredPatientsList.length} Patients
                  </span>
                  <button onClick={() => setActiveTab('registration')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition">
                    + New Walk-in Registration
                  </button>
                </div>
              </div>

              {/* Filter Controls Row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                {/* District Filter */}
                <div className="sm:col-span-4">
                  <label className="block text-stone-400 font-bold mb-1">Filter District (38 Districts)</label>
                  <select
                    value={patientDistrictFilter}
                    onChange={(e) => { setPatientDistrictFilter(e.target.value); setPatientCurrentPage(1); }}
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl font-semibold text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="All">All 38 Districts (2,280 Network Patients)</option>
                    {TN_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d} District (60 Patients)</option>
                    ))}
                  </select>
                </div>

                {/* Search Bar */}
                <div className="sm:col-span-6">
                  <label className="block text-stone-400 font-bold mb-1">Search Patient Name / Token / ID / Diagnosis / Hospital</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. JOSEPH / PAT-1001 / OPD-1001 / Cardiology / Stanley..."
                      value={patientSearchQuery}
                      onChange={(e) => { setPatientSearchQuery(e.target.value); setPatientCurrentPage(1); }}
                      className="w-full pl-9 pr-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Page Size Selector */}
                <div className="sm:col-span-2">
                  <label className="block text-stone-400 font-bold mb-1">Per Page</label>
                  <select
                    value={patientPageSize}
                    onChange={(e) => { setPatientPageSize(Number(e.target.value)); setPatientCurrentPage(1); }}
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl font-semibold text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value={12}>12 Per Page</option>
                    <option value={24}>24 Per Page</option>
                    <option value={50}>50 Per Page</option>
                    <option value={100}>100 Per Page</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-950 text-stone-400 uppercase font-bold text-[10px] tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="p-3">OP Ticket</th>
                      <th className="p-3">Patient ID</th>
                      <th className="p-3">Patient Name</th>
                      <th className="p-3">Age / Gender</th>
                      <th className="p-3">Demographics</th>
                      <th className="p-3">Hospital Facility</th>
                      <th className="p-3">Diagnosis & Specialty</th>
                      <th className="p-3">Prescribed Treatment</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {paginatedPatientsList.map(p => (
                      <tr key={p.id} className="hover:bg-stone-950/60 transition">
                        <td className="p-3 font-mono font-bold text-emerald-400">{p.token}</td>
                        <td className="p-3 font-mono text-stone-400">{p.id}</td>
                        <td className="p-3 font-bold text-white">{p.name}</td>
                        <td className="p-3 text-stone-300">{p.age} yrs • {p.gender}</td>
                        <td className="p-3 text-stone-400">{p.category}</td>
                        <td className="p-3 text-stone-300 font-medium">
                          <div>{p.hospital}</div>
                          <div className="text-[10px] text-emerald-400">{p.district} District</div>
                        </td>
                        <td className="p-3">
                          <div className="font-semibold text-stone-200">{p.diagnosis}</div>
                          <div className="text-[10px] text-emerald-400">{p.diseaseCategory}</div>
                        </td>
                        <td className="p-3 font-mono text-stone-300 text-[11px]">{p.tablets}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleStartKioskIntake(p)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px]"
                          >
                            Launch Kiosk
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION CONTROLS */}
              <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 flex items-center justify-between flex-wrap gap-4 text-xs text-stone-300">
                <div>
                  Page <strong>{patientCurrentPage}</strong> of <strong>{totalPatientPages}</strong> (<strong>{filteredPatientsList.length} Total Patients</strong>)
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={patientCurrentPage <= 1}
                    onClick={() => setPatientCurrentPage(prev => Math.max(1, prev - 1))}
                    className="px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-emerald-500 disabled:opacity-40 disabled:hover:border-stone-800 font-bold flex items-center gap-1 transition"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  <button
                    disabled={patientCurrentPage >= totalPatientPages}
                    onClick={() => setPatientCurrentPage(prev => Math.min(totalPatientPages, prev + 1))}
                    className="px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-emerald-500 disabled:opacity-40 disabled:hover:border-stone-800 font-bold flex items-center gap-1 transition"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: APPOINTMENTS CALENDAR */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3 flex-wrap gap-2">
                <div>
                  <h2 className="text-lg font-black text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-400" /> Hospital OPD Consultation Schedule
                  </h2>
                  <p className="text-xs text-stone-400">Total Booked Consultation Slots: 892 Scheduled Appointments Network-Wide</p>
                </div>
                <span className="px-3.5 py-1.5 bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono font-bold text-xs rounded-xl">
                  Showing {((appointmentCurrentPage - 1) * appointmentPageSize) + 1} to {Math.min(appointmentCurrentPage * appointmentPageSize, filteredAppointmentsList.length)} of {filteredAppointmentsList.length} Appointments
                </span>
              </div>

              {/* Filter Controls Row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                {/* District Filter */}
                <div className="sm:col-span-4">
                  <label className="block text-stone-400 font-bold mb-1">Filter District (38 Districts)</label>
                  <select
                    value={appointmentDistrictFilter}
                    onChange={(e) => { setAppointmentDistrictFilter(e.target.value); setAppointmentCurrentPage(1); }}
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl font-semibold text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="All">All 38 Districts (892 Booked Slots)</option>
                    {TN_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d} District</option>
                    ))}
                  </select>
                </div>

                {/* Search Bar */}
                <div className="sm:col-span-6">
                  <label className="block text-stone-400 font-bold mb-1">Search Patient / Doctor / Hospital Name</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. JOSEPH / Dr. Vijay / Stanley..."
                      value={appointmentSearchQuery}
                      onChange={(e) => { setAppointmentSearchQuery(e.target.value); setAppointmentCurrentPage(1); }}
                      className="w-full pl-9 pr-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Page Size */}
                <div className="sm:col-span-2">
                  <label className="block text-stone-400 font-bold mb-1">Per Page</label>
                  <select
                    value={appointmentPageSize}
                    onChange={(e) => { setAppointmentPageSize(Number(e.target.value)); setAppointmentCurrentPage(1); }}
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl font-semibold text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value={12}>12 Per Page</option>
                    <option value={24}>24 Per Page</option>
                    <option value={48}>48 Per Page</option>
                  </select>
                </div>
              </div>

              {/* Grid of Appointments */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                {paginatedAppointmentsList.map((slot, idx) => (
                  <div key={slot.id || idx} className="p-4 bg-stone-950 border border-stone-800 rounded-2xl space-y-2 hover:border-emerald-700/60 transition shadow-md">
                    <div className="flex items-center justify-between font-mono text-emerald-400 font-bold">
                      <span>{slot.appointmentTime}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] border border-emerald-700">{slot.token}</span>
                    </div>
                    <div className="font-extrabold text-sm text-white">{slot.name}</div>
                    <div className="text-stone-300 text-[11px]">{slot.assignedDoctor}</div>
                    <div className="text-emerald-400 text-[11px] font-semibold">{slot.diseaseCategory}</div>
                    <div className="text-stone-400 text-[10px] border-t border-stone-800 pt-1.5 line-clamp-1">{slot.hospital}</div>
                  </div>
                ))}
              </div>

              {/* PAGINATION CONTROLS */}
              <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 flex items-center justify-between flex-wrap gap-4 text-xs text-stone-300">
                <div>
                  Page <strong>{appointmentCurrentPage}</strong> of <strong>{totalAppointmentPages}</strong> (<strong>{filteredAppointmentsList.length} Total Appointments</strong>)
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={appointmentCurrentPage <= 1}
                    onClick={() => setAppointmentCurrentPage(prev => Math.max(1, prev - 1))}
                    className="px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-emerald-500 disabled:opacity-40 disabled:hover:border-stone-800 font-bold flex items-center gap-1 transition"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  <button
                    disabled={appointmentCurrentPage >= totalAppointmentPages}
                    onClick={() => setAppointmentCurrentPage(prev => Math.min(totalAppointmentPages, prev + 1))}
                    className="px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-emerald-500 disabled:opacity-40 disabled:hover:border-stone-800 font-bold flex items-center gap-1 transition"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TN HOSPITALS DIRECTORY WITH PAGINATION & SORTING */}
        {activeTab === 'hospitals' && (
          <div className="space-y-6">
            {/* Filter & Sorting Controls Header */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-lg font-black text-white">Tamil Nadu Government Hospitals Directory</h2>
                  <p className="text-xs text-stone-400">38 Districts x 10 Hospitals = 380 Total Hospitals with Physical Location & Directions</p>
                </div>
                <div className="px-3 py-1.5 bg-emerald-950 border border-emerald-700 text-emerald-300 rounded-xl font-bold text-xs">
                  Showing {paginatedData.hospitals.length} of {paginatedData.totalItems} Hospitals
                </div>
              </div>

              {/* Filter Controls Row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                {/* District Dropdown Filter */}
                <div className="sm:col-span-3">
                  <label className="block text-stone-400 font-bold mb-1">Filter District (38 Districts)</label>
                  <select
                    value={hospitalDistrict}
                    onChange={(e) => setHospitalDistrict(e.target.value)}
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl font-semibold text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="All">All 38 Districts (380 Hospitals)</option>
                    {TN_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d} District (10 GHs)</option>
                    ))}
                  </select>
                </div>

                {/* Sorting Dropdown */}
                <div className="sm:col-span-3">
                  <label className="block text-stone-400 font-bold mb-1">Sort Directory By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl font-semibold text-emerald-400 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="nameAsc">Hospital Name (A-Z)</option>
                    <option value="nameDesc">Hospital Name (Z-A)</option>
                    <option value="districtAsc">District Name (A-Z)</option>
                    <option value="opdDesc">OPD Daily Load (High to Low)</option>
                  </select>
                </div>

                {/* Search Bar */}
                <div className="sm:col-span-4">
                  <label className="block text-stone-400 font-bold mb-1">Search Hospital Name / Address / Landmark</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Stanley / Rajaji / Pollachi / EVR Salai..."
                      value={hospitalSearch}
                      onChange={(e) => setHospitalSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Page Size Selector */}
                <div className="sm:col-span-2">
                  <label className="block text-stone-400 font-bold mb-1">Per Page</label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl font-semibold text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value={6}>6 Per Page</option>
                    <option value={12}>12 Per Page</option>
                    <option value={24}>24 Per Page</option>
                    <option value={50}>50 Per Page</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Hospital Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedData.hospitals.map((h, idx) => (
                <div key={h.id || idx} className="space-y-2.5 bg-stone-900 p-2.5 rounded-2xl border border-stone-800 shadow-lg">
                  <HospitalLocationCard hospitalName={h.name} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() => handleOpenHospitalPanel(h.name, h.district || hospitalDistrict)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition"
                    >
                      <Building className="w-4 h-4" />
                      <span>Open Hospital Control Panel (Sidebar & Full View)</span>
                    </button>
                    <button
                      onClick={() => handleOpenRosterModal(h.name, h.district || hospitalDistrict)}
                      className="w-full py-2.5 bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300 font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition"
                    >
                      <Users className="w-4 h-4 text-emerald-400" />
                      <span>Quick Roster Modal (10 Members)</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* PAGINATION CONTROLS */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-4 text-xs text-stone-300">
              <div>
                Showing <strong>{((paginatedData.currentPage - 1) * paginatedData.pageSize) + 1}</strong> to <strong>{Math.min(paginatedData.currentPage * paginatedData.pageSize, paginatedData.totalItems)}</strong> of <strong>{paginatedData.totalItems}</strong> Hospitals (Page {paginatedData.currentPage} of {paginatedData.totalPages})
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={paginatedData.currentPage <= 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 hover:border-emerald-500 disabled:opacity-40 disabled:hover:border-stone-800 font-bold flex items-center gap-1 transition"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                {/* Page numbers */}
                <div className="flex items-center gap-1 font-mono font-bold">
                  {Array.from({ length: Math.min(5, paginatedData.totalPages) }, (_, idx) => {
                    let pageNum = idx + 1;
                    if (paginatedData.currentPage > 3 && paginatedData.totalPages > 5) {
                      pageNum = paginatedData.currentPage - 2 + idx;
                      if (pageNum > paginatedData.totalPages) pageNum = paginatedData.totalPages - (4 - idx);
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
                          paginatedData.currentPage === pageNum
                            ? 'bg-emerald-600 text-white font-black'
                            : 'bg-stone-950 border border-stone-800 text-stone-300 hover:bg-stone-800'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={paginatedData.currentPage >= paginatedData.totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(paginatedData.totalPages, prev + 1))}
                  className="px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 hover:border-emerald-500 disabled:opacity-40 disabled:hover:border-stone-800 font-bold flex items-center gap-1 transition"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: WALK-IN OP REGISTRATION */}
        {activeTab === 'registration' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Form */}
            <div className="lg:col-span-7 bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-2 text-white font-bold border-b border-stone-800 pb-3">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                <span>New Walk-in Patient OPD Registration</span>
              </div>

              <form onSubmit={handleSubmitRegistration} className="space-y-4 text-xs">
                {/* Location Hierarchy */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-950 p-4 rounded-xl border border-stone-800">
                  <div>
                    <label className="block font-bold text-stone-300 mb-1">Select District (38 Districts)</label>
                    <select
                      value={district}
                      onChange={handleDistrictChange}
                      className="w-full p-2.5 bg-stone-900 border border-stone-700 rounded-lg font-semibold text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      {TN_DISTRICTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-300 mb-1">Government Hospital Facility</label>
                    <select
                      value={hospital}
                      onChange={(e) => setHospital(e.target.value)}
                      className="w-full p-2.5 bg-stone-900 border border-stone-700 rounded-lg font-semibold text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      {TN_HOSPITALS_BY_DISTRICT[district]?.map(h => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Patient Information */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-stone-300 mb-1">Patient Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Malarvizhi K."
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-300 mb-1">Age *</label>
                    <input
                      type="number"
                      name="age"
                      required
                      placeholder="e.g. 38"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-stone-300 mb-1">Gender *</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white font-medium"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Transgender">Transgender</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-300 mb-1">Mobile Number *</label>
                    <input
                      type="text"
                      name="phone"
                      required
                      placeholder="10-digit mobile"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg font-mono text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-300 mb-1">Aadhaar No. (Optional)</label>
                    <input
                      type="text"
                      name="aadhaar"
                      placeholder="12-digit Aadhaar"
                      value={formData.aadhaar}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg font-mono text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-300 mb-1">Target Department / Specialty</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg text-white font-medium"
                    >
                      <option value="General Medicine OPD">General Medicine OPD</option>
                      <option value="Ayurveda / Ayush Specialty OPD">Ayurveda / Ayush Specialty OPD</option>
                      <option value="Orthopedics & Joint Care">Orthopedics & Joint Care</option>
                      <option value="Cardiology Triage Desk">Cardiology Triage Desk</option>
                      <option value="ENT & Respiratory Care">ENT & Respiratory Care</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-300 mb-1">Initial Triage Priority</label>
                    <select
                      name="triage"
                      value={formData.triage}
                      onChange={handleInputChange}
                      className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-lg font-semibold text-white"
                    >
                      <option value="Normal">Normal Walk-in</option>
                      <option value="Elderly / Priority">Elderly / Senior Citizen</option>
                      <option value="Emergency / Urgent">Urgent Triage (Chest Pain/Trauma)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition text-sm flex items-center justify-center gap-2 mt-2"
                >
                  <Printer className="w-4 h-4" /> Issue OP Ticket & Register Patient
                </button>
              </form>

              {/* LIVE HOSPITAL LOCATION CARD */}
              <div className="pt-2">
                <div className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Selected Hospital Physical Address & Directions
                </div>
                <HospitalLocationCard hospitalName={hospital} />
              </div>
            </div>

            {/* Right Column: Printed Ticket Preview */}
            <div className="lg:col-span-5 space-y-6">
              {generatedTicket ? (
                <div className="bg-stone-900 border border-stone-800 text-white rounded-2xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <span className="font-bold text-sm text-emerald-400">OP Ticket Slip Issued</span>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-xs text-stone-300 rounded-lg font-semibold flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Ticket
                    </button>
                  </div>

                  <div className="text-center p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                    <div className="text-xs text-stone-400 uppercase tracking-widest">OP Token Number</div>
                    <div className="text-4xl font-black text-emerald-400 font-mono tracking-tight">
                      {generatedTicket.token}
                    </div>
                    <div className="text-xs text-stone-300 font-semibold">{generatedTicket.hospital}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-300 border-t border-stone-800 pt-3">
                    <div><span className="text-stone-500">Patient:</span> <strong>{generatedTicket.name}</strong></div>
                    <div><span className="text-stone-500">Age/Gender:</span> <strong>{generatedTicket.age} / {generatedTicket.gender}</strong></div>
                    <div><span className="text-stone-500">Phone:</span> <strong className="font-mono">{generatedTicket.phone}</strong></div>
                    <div><span className="text-stone-500">Dept:</span> <strong>{generatedTicket.department}</strong></div>
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => handleStartKioskIntake(generatedTicket)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
                    >
                      Send to Voice Kiosk Intake <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-stone-900 border border-stone-800 border-dashed rounded-2xl p-6 text-center text-xs text-stone-400 space-y-2">
                  <QrCode className="w-8 h-8 mx-auto text-stone-500" />
                  <div className="font-semibold text-white">No Ticket Printed Yet</div>
                  <div>Complete the walk-in form on the left to issue an OP ticket.</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: TOKEN SLIPS & ANALYTICS */}
        {activeTab === 'tokens' && (
          <div className="space-y-6">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3 flex-wrap gap-2">
                <div>
                  <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                    <Printer className="w-5 h-5 text-emerald-400" /> Issued OP Slips Registry ({filteredTokensList.length} Network Tokens)
                  </h3>
                  <p className="text-xs text-stone-400">Complete OPD token generation ledger across all 380 Tamil Nadu Hospitals</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 bg-emerald-950 border border-emerald-700 text-emerald-300 rounded-xl font-bold text-xs font-mono">
                    Showing {((tokenCurrentPage - 1) * tokenPageSize) + 1} to {Math.min(tokenCurrentPage * tokenPageSize, filteredTokensList.length)} of {filteredTokensList.length} Tokens
                  </span>
                  <button onClick={() => window.print()} className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md">
                    <Printer className="w-3.5 h-3.5" /> Print Summary Report
                  </button>
                </div>
              </div>

              {/* Filter Controls Row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                {/* District Filter */}
                <div className="sm:col-span-4">
                  <label className="block text-stone-400 font-bold mb-1">Filter District (38 Districts)</label>
                  <select
                    value={tokenDistrictFilter}
                    onChange={(e) => { setTokenDistrictFilter(e.target.value); setTokenCurrentPage(1); }}
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl font-semibold text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="All">All 38 Districts (2,280 Network Tokens)</option>
                    {TN_DISTRICTS.map(d => (
                      <option key={d} value={d}>{d} District</option>
                    ))}
                  </select>
                </div>

                {/* Search Bar */}
                <div className="sm:col-span-6">
                  <label className="block text-stone-400 font-bold mb-1">Search Token No / Patient / Hospital Facility</label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. OPD-1001 / JOSEPH / Stanley..."
                      value={tokenSearchQuery}
                      onChange={(e) => { setTokenSearchQuery(e.target.value); setTokenCurrentPage(1); }}
                      className="w-full pl-9 pr-3 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Page Size */}
                <div className="sm:col-span-2">
                  <label className="block text-stone-400 font-bold mb-1">Per Page</label>
                  <select
                    value={tokenPageSize}
                    onChange={(e) => { setTokenPageSize(Number(e.target.value)); setTokenCurrentPage(1); }}
                    className="w-full p-2.5 bg-stone-950 border border-stone-800 rounded-xl font-semibold text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value={12}>12 Per Page</option>
                    <option value={24}>24 Per Page</option>
                    <option value={50}>50 Per Page</option>
                    <option value={100}>100 Per Page</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-950 text-stone-400 uppercase font-bold text-[10px] tracking-wider border-b border-stone-800">
                    <tr>
                      <th className="p-3">Token No</th>
                      <th className="p-3">Patient Name</th>
                      <th className="p-3">Demographics</th>
                      <th className="p-3">Hospital Facility</th>
                      <th className="p-3">Department</th>
                      <th className="p-3">Issue Time</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {paginatedTokensList.map(t => (
                      <tr key={t.token} className="hover:bg-stone-950/50">
                        <td className="p-3 font-mono font-bold text-emerald-400">{t.token}</td>
                        <td className="p-3 font-bold text-white">{t.name}</td>
                        <td className="p-3 text-stone-300">{t.age} yrs • {t.gender}</td>
                        <td className="p-3 text-stone-300 font-medium">
                          <div>{t.hospital}</div>
                          <div className="text-[10px] text-emerald-400">{t.district} District</div>
                        </td>
                        <td className="p-3 text-stone-400">{t.diseaseCategory}</td>
                        <td className="p-3 text-stone-500 font-mono">{t.time}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                            {t.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleStartKioskIntake(t)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-[10px]"
                          >
                            Launch Kiosk
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION CONTROLS */}
              <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 flex items-center justify-between flex-wrap gap-4 text-xs text-stone-300">
                <div>
                  Page <strong>{tokenCurrentPage}</strong> of <strong>{totalTokenPages}</strong> (<strong>{filteredTokensList.length} Total Tokens</strong>)
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={tokenCurrentPage <= 1}
                    onClick={() => setTokenCurrentPage(prev => Math.max(1, prev - 1))}
                    className="px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-emerald-500 disabled:opacity-40 disabled:hover:border-stone-800 font-bold flex items-center gap-1 transition"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  <button
                    disabled={tokenCurrentPage >= totalTokenPages}
                    onClick={() => setTokenCurrentPage(prev => Math.min(totalTokenPages, prev + 1))}
                    className="px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-emerald-500 disabled:opacity-40 disabled:hover:border-stone-800 font-bold flex items-center gap-1 transition"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SYSTEM AUDIT LOGS */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div>
                  <h2 className="text-lg font-black text-white">System Security & ABDM Audit Logs</h2>
                  <p className="text-xs text-stone-400">HIPAA compliant security event logging for all staff operations</p>
                </div>
                <span className="px-3 py-1 bg-emerald-950 border border-emerald-700 text-emerald-300 rounded-xl font-mono font-bold text-xs">
                  Active Encryption: AES-256
                </span>
              </div>

              <div className="space-y-2 font-mono text-xs">
                {[
                  { id: "LOG-901", time: "2026-09-06 21:05:12", user: "Operational Staff (Admin)", action: "WALK_IN_OP_REGISTRATION", details: "Issued OPD Token for Walk-in Patient at Desk #02", status: "SUCCESS" },
                  { id: "LOG-902", time: "2026-09-06 20:47:30", user: "Dr. V. S. Ramachandran", action: "AI_PATIENT_RECORD_ANALYSIS", details: "Generated AI Clinical Summary for OP Token #OPD-882", status: "SUCCESS" },
                  { id: "LOG-903", time: "2026-09-06 20:22:15", user: "Nurse Malarvizhi", action: "PATIENT_VITALS_LOGGED", details: "Logged BP: 120/80, SpO2: 98%, Pulse: 72 bpm", status: "SUCCESS" }
                ].map(log => (
                  <div key={log.id} className="p-3.5 bg-stone-950 border border-stone-800 rounded-xl flex items-center justify-between flex-wrap gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">{log.id}</span>
                        <span className="text-stone-500">•</span>
                        <span className="text-stone-300 font-bold">{log.user}</span>
                        <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 text-[10px]">{log.action}</span>
                      </div>
                      <div className="text-stone-400 text-[11px] font-sans">{log.details}</div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700 text-[10px] font-bold">{log.status}</span>
                      <div className="text-stone-500 text-[10px]">{log.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {/* HOSPITAL ROSTER & CLINICAL ANALYTICS MODAL (10 MEMBERS: 2 DOCTORS, 1 NURSE, 1 RECEPTIONIST, 6 PATIENTS) */}
        {rosterModalOpen && selectedHospitalRoster && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 overflow-y-auto">
            <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-5xl w-full text-white shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-stone-800 pb-4 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                      {selectedHospitalRoster.districtName} District
                    </span>
                    <span className="text-xs text-stone-400 font-mono">10 Roster Members • 3,801 Network Total</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white mt-1">
                    {selectedHospitalRoster.hospitalName}
                  </h2>
                  <p className="text-xs text-stone-400">
                    Comprehensive Staff Roster, Patient Records, Prescriptions & Disease Recovery Outcome Analytics
                  </p>
                </div>

                <button
                  onClick={() => setRosterModalOpen(false)}
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 5 Distinct Panel Tab Navigation Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-800 text-xs font-bold">
                <button
                  onClick={() => setActiveRosterTab('doctors')}
                  className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition shrink-0 ${
                    activeRosterTab === 'doctors'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-stone-950 text-stone-400 hover:bg-stone-800 hover:text-white border border-stone-800'
                  }`}
                >
                  <Stethoscope className="w-4 h-4 text-emerald-300" />
                  <span>Doctors Panel ({selectedHospitalRoster.doctors.length})</span>
                </button>

                <button
                  onClick={() => setActiveRosterTab('nurses')}
                  className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition shrink-0 ${
                    activeRosterTab === 'nurses'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-stone-950 text-stone-400 hover:bg-stone-800 hover:text-white border border-stone-800'
                  }`}
                >
                  <HeartHandshake className="w-4 h-4 text-emerald-300" />
                  <span>Nurses Panel (1)</span>
                </button>

                <button
                  onClick={() => setActiveRosterTab('receptionist')}
                  className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition shrink-0 ${
                    activeRosterTab === 'receptionist'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-stone-950 text-stone-400 hover:bg-stone-800 hover:text-white border border-stone-800'
                  }`}
                >
                  <UserCheck className="w-4 h-4 text-emerald-300" />
                  <span>Receptionists Panel (1)</span>
                </button>

                <button
                  onClick={() => setActiveRosterTab('patients')}
                  className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition shrink-0 ${
                    activeRosterTab === 'patients'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-stone-950 text-stone-400 hover:bg-stone-800 hover:text-white border border-stone-800'
                  }`}
                >
                  <Users className="w-4 h-4 text-emerald-300" />
                  <span>Patients Panel ({selectedHospitalRoster.patients.length})</span>
                </button>

                <button
                  onClick={() => setActiveRosterTab('analytics')}
                  className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition shrink-0 ${
                    activeRosterTab === 'analytics'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-stone-950 text-stone-400 hover:bg-stone-800 hover:text-white border border-stone-800'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-emerald-300" />
                  <span>Disease Analytics Panel</span>
                </button>
              </div>

              {/* PANEL 1: DOCTORS PANEL */}
              {activeRosterTab === 'doctors' && (
                <div className="space-y-4">
                  <div className="text-xs text-stone-400">
                    Showing assigned Medical Doctors and clinical performance cure rates for {selectedHospitalRoster.hospitalName}:
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedHospitalRoster.doctors.map((doc) => {
                      const isPromoted = doc.promoted || promotionStatusMap[doc.id];
                      return (
                        <div key={doc.id} className="bg-stone-950 border border-stone-800 rounded-2xl p-5 space-y-4 shadow-md">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <img
                                src={doc.id.endsWith('1') ? ROLE_AVATARS.doctor1 : ROLE_AVATARS.doctor2}
                                alt={doc.name}
                                className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-500 shadow-md shrink-0"
                              />
                              <div>
                                <h3 className="font-extrabold text-sm text-white">{doc.name}</h3>
                                <div className="text-xs text-stone-400">{doc.qualification}</div>
                                <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">{doc.spec}</div>
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 text-[10px] font-mono">{doc.id}</span>
                          </div>

                          <div className="bg-stone-900 p-3 rounded-xl border border-stone-800 space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-stone-400">Clinical Patient Recovery Rate:</span>
                              <strong className="text-emerald-400 font-mono text-sm">{doc.cureRate}%</strong>
                            </div>
                            <div className="w-full bg-stone-950 rounded-full h-2 overflow-hidden border border-stone-800">
                              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${doc.cureRate}%` }}></div>
                            </div>
                            <div className="text-[10px] text-stone-500 text-right">
                              {doc.curedCount} Patients Cured out of {doc.totalCount} Cases
                            </div>
                          </div>

                          <div className="pt-1">
                            {isPromoted ? (
                              <div className="w-full p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/50 text-amber-300 font-bold text-xs flex items-center justify-center gap-2">
                                <Award className="w-4 h-4 text-amber-400 animate-pulse" />
                                <span>Promoted Senior Specialist Distinction (Admin Awarded)</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handlePromoteDoctor(doc.id, doc.name, selectedHospitalRoster.hospitalName)}
                                className="w-full p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition"
                              >
                                <Award className="w-4 h-4" />
                                <span>Award Doctor Promotion & Senior Specialist Distinction</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PANEL 2: NURSES PANEL */}
              {activeRosterTab === 'nurses' && (
                <div className="space-y-4">
                  <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={ROLE_AVATARS.nurse1}
                        alt="Staff Nurse Avatar"
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-md shrink-0"
                      />
                      <div>
                        <h3 className="font-extrabold text-base text-white">{selectedHospitalRoster.nurse.name}</h3>
                        <div className="text-xs text-stone-400">{selectedHospitalRoster.nurse.rank} • {selectedHospitalRoster.nurse.dept}</div>
                        <div className="text-xs text-emerald-400 font-semibold">Shift: {selectedHospitalRoster.nurse.shift}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs border-t border-stone-800 pt-4">
                      <div className="bg-stone-900 p-3 rounded-xl border border-stone-800">
                        <div className="text-stone-500 font-bold text-[10px]">Triage Vitals Logged Today</div>
                        <div className="text-xl font-black text-emerald-400 font-mono mt-1">{selectedHospitalRoster.nurse.vitalsLoggedToday} Patients</div>
                      </div>
                      <div className="bg-stone-900 p-3 rounded-xl border border-stone-800">
                        <div className="text-stone-500 font-bold text-[10px]">Staff Nurse ID</div>
                        <div className="text-sm font-bold text-white font-mono mt-1">{selectedHospitalRoster.nurse.id}</div>
                      </div>
                      <div className="bg-stone-900 p-3 rounded-xl border border-stone-800">
                        <div className="text-stone-500 font-bold text-[10px]">Bedside Care Status</div>
                        <div className="text-xs font-bold text-emerald-300 mt-1">Active Duty • Ward Triage Ready</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PANEL 3: RECEPTIONISTS PANEL */}
              {activeRosterTab === 'receptionist' && (
                <div className="space-y-4">
                  <div className="bg-stone-950 border border-stone-800 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={ROLE_AVATARS.receptionist1}
                        alt="Receptionist Avatar"
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-md shrink-0"
                      />
                      <div>
                        <h3 className="font-extrabold text-base text-white">{selectedHospitalRoster.receptionist.name}</h3>
                        <div className="text-xs text-stone-400">Hospital Reception Desk Officer</div>
                        <div className="text-xs text-emerald-400 font-semibold">{selectedHospitalRoster.receptionist.desk}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs border-t border-stone-800 pt-4">
                      <div className="bg-stone-900 p-3 rounded-xl border border-stone-800">
                        <div className="text-stone-500 font-bold text-[10px]">OP Tokens Issued Today</div>
                        <div className="text-xl font-black text-emerald-400 font-mono mt-1">{selectedHospitalRoster.receptionist.tokensIssuedToday} Tickets</div>
                      </div>
                      <div className="bg-stone-900 p-3 rounded-xl border border-stone-800">
                        <div className="text-stone-500 font-bold text-[10px]">Processing Speed</div>
                        <div className="text-sm font-bold text-white font-mono mt-1">{selectedHospitalRoster.receptionist.speed}</div>
                      </div>
                      <div className="bg-stone-900 p-3 rounded-xl border border-stone-800">
                        <div className="text-stone-500 font-bold text-[10px]">Desk Counter Status</div>
                        <div className="text-xs font-bold text-emerald-300 mt-1">Active Walk-in OP Counter</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PANEL 4: PATIENTS PANEL */}
              {activeRosterTab === 'patients' && (
                <div className="space-y-4">
                  <div className="text-xs text-stone-400">
                    6 South Indian Patients assigned to {selectedHospitalRoster.hospitalName} with diagnosis, prescribed medications, duration limit, and recovery results:
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-950 text-stone-400 uppercase font-bold text-[10px] tracking-wider border-b border-stone-800">
                        <tr>
                          <th className="p-3">Token / ID</th>
                          <th className="p-3">Patient Name</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Diagnosis & Specialty</th>
                          <th className="p-3">Prescribed Medication</th>
                          <th className="p-3">Prescription Limit</th>
                          <th className="p-3">Recovery Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-800">
                        {selectedHospitalRoster.patients.map((p) => (
                          <tr key={p.id} className="hover:bg-stone-950/60 transition">
                            <td className="p-3 font-mono font-bold text-emerald-400">{p.token}</td>
                            <td className="p-3 font-bold text-white">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={p.gender === 'Female' ? ROLE_AVATARS.patientFemale1 : ROLE_AVATARS.patientMale1}
                                  alt={p.name}
                                  className="w-8 h-8 rounded-lg object-cover border border-emerald-600 shrink-0"
                                />
                                <div>
                                  <div>{p.name}</div>
                                  <div className="text-[10px] text-stone-500 font-normal">{p.age} yrs • {p.gender}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-stone-400">{p.category}</td>
                            <td className="p-3">
                              <div className="font-semibold text-stone-200">{p.diagnosis}</div>
                              <div className="text-[10px] text-emerald-400">{p.diseaseCategory}</div>
                            </td>
                            <td className="p-3 font-mono text-stone-300">
                              <div className="flex items-center gap-1">
                                <Pill className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                <span>{p.tablets}</span>
                              </div>
                            </td>
                            <td className="p-3 font-mono text-stone-400">{p.prescribedDays} Days Limit</td>
                            <td className="p-3">
                              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1 w-max">
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                {p.recoveryStatus}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PANEL 5: DISEASE ANALYTICS PANEL */}
              {activeRosterTab === 'analytics' && (
                <div className="space-y-5">
                  <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-emerald-400" /> Hospital Clinical Outcome Analysis
                      </h3>
                      <p className="text-xs text-stone-400">Breakdown of specific medical conditions, cured rates, and prescription efficacy</p>
                    </div>
                    <div className="px-3 py-1.5 bg-emerald-950 border border-emerald-700 text-emerald-300 font-mono font-bold text-xs rounded-xl flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Hospital Recovery Rate: {selectedHospitalRoster?.summary?.hospitalCureRate || 100}%</span>
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-stone-950 border border-stone-800 p-3.5 rounded-xl space-y-1">
                      <div className="text-stone-400 font-bold uppercase text-[10px]">Total Patients Analyzed</div>
                      <div className="text-xl font-black text-white font-mono">{selectedHospitalRoster?.patients?.length || 6} Patients</div>
                      <div className="text-emerald-400 text-[10px]">6 Unique Profiles</div>
                    </div>
                    <div className="bg-stone-950 border border-stone-800 p-3.5 rounded-xl space-y-1">
                      <div className="text-stone-400 font-bold uppercase text-[10px]">Cured & Resolved</div>
                      <div className="text-xl font-black text-emerald-400 font-mono">{selectedHospitalRoster?.patients?.filter(p => p.cured).length || 6} / {selectedHospitalRoster?.patients?.length || 6}</div>
                      <div className="text-emerald-300 text-[10px]">100% Recovery Rate</div>
                    </div>
                    <div className="bg-stone-950 border border-stone-800 p-3.5 rounded-xl space-y-1">
                      <div className="text-stone-400 font-bold uppercase text-[10px]">Avg Recovery Time</div>
                      <div className="text-xl font-black text-amber-400 font-mono">8.5 Days</div>
                      <div className="text-stone-400 text-[10px]">Within Prescription Limit</div>
                    </div>
                  </div>

                  {/* Disease Categories Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {(selectedHospitalRoster?.diseaseBreakdown || [
                      { category: "Heart & Cardiac Care", total: 2, cured: 2, percentage: 33 },
                      { category: "Orthopedic & Joint Care", total: 1, cured: 1, percentage: 17 },
                      { category: "Respiratory & ENT Care", total: 1, cured: 1, percentage: 17 },
                      { category: "Diabetes & Metabolic", total: 1, cured: 1, percentage: 17 },
                      { category: "Ayush & Gastro Care", total: 1, cured: 1, percentage: 16 }
                    ]).map((d, idx) => (
                      <div key={idx} className="bg-stone-950 border border-stone-800 p-4 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400">{d.category}</span>
                          <span className="text-[10px] font-mono text-stone-400">{d.percentage || Math.round((d.total/6)*100)}%</span>
                        </div>
                        <div className="flex items-baseline justify-between">
                          <span className="text-xl font-black text-white font-mono">{d.cured || d.total} / {d.total}</span>
                          <span className="text-[10px] text-emerald-300 font-bold">100% Cured</span>
                        </div>
                        <div className="w-full bg-stone-900 rounded-full h-1.5 overflow-hidden border border-stone-800">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Patients Diagnosed Diseases Table */}
                  <div className="bg-stone-950 border border-stone-800 p-4 rounded-xl space-y-3">
                    <div className="font-extrabold text-xs text-white">Diagnosed Conditions & Medication Efficacy Table</div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-stone-900 text-stone-400 uppercase font-bold text-[10px] tracking-wider border-b border-stone-800">
                          <tr>
                            <th className="p-2.5">ID</th>
                            <th className="p-2.5">Patient Name</th>
                            <th className="p-2.5">Specific Diagnosis</th>
                            <th className="p-2.5">Prescribed Treatment</th>
                            <th className="p-2.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-800">
                          {(selectedHospitalRoster?.patients || []).map((p) => (
                            <tr key={p.id} className="hover:bg-stone-900/50">
                              <td className="p-2.5 font-mono text-emerald-400 font-bold">{p.id}</td>
                              <td className="p-2.5 font-bold text-white">{p.name}</td>
                              <td className="p-2.5 text-stone-200">
                                <div>{p.diagnosis}</div>
                                <div className="text-[10px] text-emerald-400">{p.diseaseCategory}</div>
                              </td>
                              <td className="p-2.5 font-mono text-stone-300">{p.tablets}</td>
                              <td className="p-2.5">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                                  {p.recoveryStatus}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </main>
    </div>
  );
};
