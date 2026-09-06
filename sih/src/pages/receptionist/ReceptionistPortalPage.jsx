import React, { useState, useEffect } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { TN_DISTRICTS, TN_HOSPITALS_BY_DISTRICT, ALL_380_TN_HOSPITALS, getPaginatedHospitals } from '../../data/tnHospitals';
import { HospitalLocationCard } from '../../components/common/HospitalLocationCard';
import { MEDICAL_IMAGES, ROLE_AVATARS } from '../../data/images';
import {
  UserPlus, QrCode, Printer, CheckCircle, Clock, ArrowRight, UserCheck,
  Building, Phone, Search, LogOut, ShieldCheck, Activity, Users, PlusCircle,
  TrendingUp, MapPin, ChevronLeft, ChevronRight
} from 'lucide-react';

export const ReceptionistPortalPage = ({ onLogout }) => {
  const { doctorQueue, setDoctorQueue, setViewMode, updateIdentity, resetSession, appointments } = usePatientSession();
  const [activeTab, setActiveTab] = useState('register'); // 'register' | 'tokens' | 'hospitals' | 'search'

  // Dynamic Backend Stats Integration
  const [receptionStats, setReceptionStats] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/admin/stats")
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.status === "SUCCESS") {
          setReceptionStats(data);
        }
      })
      .catch(() => {});
  }, [doctorQueue.length]);

  const dailyWalkInOpd = receptionStats?.dailyWalkInOpd || doctorQueue.filter(p => p.status !== 'Online Booked').length;
  const onlineAppointments = receptionStats?.onlineAppointments || doctorQueue.filter(p => p.status === 'Online Booked').length || (appointments ? appointments.length : 2);
  const activeAppUsers = receptionStats?.activeAppUsers || doctorQueue.filter(p => p.status === 'In Queue' || p.status === 'With Nurse' || p.status === 'Triaged' || p.status === 'Registered at Counter').length;

  const [district, setDistrict] = useState("Chennai");
  const [hospital, setHospital] = useState(TN_HOSPITALS_BY_DISTRICT["Chennai"][0]);

  // Search, sorting & pagination state for hospitals directory
  const [hospitalSearch, setHospitalSearch] = useState("");
  const [selectedDirectoryDistrict, setSelectedDirectoryDistrict] = useState("All");
  const [sortBy, setSortBy] = useState("nameAsc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const paginatedData = getPaginatedHospitals({
    district: selectedDirectoryDistrict,
    searchQuery: hospitalSearch,
    sortBy: sortBy,
    page: currentPage,
    pageSize: pageSize
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDirectoryDistrict, hospitalSearch, sortBy, pageSize]);

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
  const [searchQuery, setSearchQuery] = useState("");

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
      status: "Registered at Counter"
    };

    // BACKEND REST INTEGRATION: POST to Spring Boot
    fetch("http://localhost:8080/api/receptionist/register-walkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        phone: formData.phone,
        aadhaar: formData.aadhaar,
        hospital: hospital,
        department: formData.department
      })
    })
      .then(res => res.ok ? res.json() : null)
      .then(() => {
        fetch("http://localhost:8080/api/admin/stats")
          .then(r => r.ok ? r.json() : null)
          .then(data => { if (data && data.status === "SUCCESS") setReceptionStats(data); })
          .catch(() => {});
      })
      .catch(err => console.log("Backend offline, state updated locally:", err));

    setReceptionStats(prev => prev ? {
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
        chiefComplaint: "Walk-in registration at Reception counter",
        summaryText: `Patient registered at counter desk (${hospital}). Pending voice intake.`,
        status: "Registered at Counter",
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

  // Filtered list of hospitals for Directory
  const filteredHospitals = ALL_380_TN_HOSPITALS.filter(h => {
    const matchesDistrict = selectedDirectoryDistrict === "All" || h.district === selectedDirectoryDistrict;
    const matchesSearch = !hospitalSearch ||
      h.name.toLowerCase().includes(hospitalSearch.toLowerCase()) ||
      h.district.toLowerCase().includes(hospitalSearch.toLowerCase()) ||
      h.address.toLowerCase().includes(hospitalSearch.toLowerCase()) ||
      h.landmark.toLowerCase().includes(hospitalSearch.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col md:flex-row">
      {/* LEFT SIDEBAR NAVIGATION (STATIC STICKY TOP-0 H-SCREEN) */}
      <aside className="w-full md:w-64 bg-stone-900 text-white p-5 flex flex-col justify-between shrink-0 shadow-xl sticky top-0 h-screen overflow-y-auto">
        <div className="space-y-6">
          {/* Receptionist Profile Card */}
          <div className="flex items-center gap-3 border-b border-stone-800 pb-5">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center font-bold text-lg text-white shadow-md">
              RD
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white">Reception Desk</h2>
              <div className="text-[11px] text-stone-400">Counter #01 • Walk-in OP</div>
              <div className="text-[11px] text-teal-400 font-semibold flex items-center gap-1 mt-0.5">
                <UserCheck className="w-3.5 h-3.5" /> Active Staff
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('register')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeTab === 'register' ? 'bg-teal-600 text-white shadow-md' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <UserPlus className="w-4 h-4" /> Walk-in OP Registration
            </button>
            <button
              onClick={() => setActiveTab('tokens')}
              className={`w-full p-3 rounded-xl flex items-center gap-3 transition ${
                activeTab === 'tokens' ? 'bg-teal-600 text-white shadow-md' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Printer className="w-4 h-4" /> Token Slips & Analytics ({registeredTokens.length})
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
              <button onClick={() => setViewMode('nurse')} className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-left truncate">
                ▸ Nurse
              </button>
              <button onClick={() => setViewMode('doctor')} className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-left truncate">
                ▸ Doctor
              </button>
              <button onClick={() => setViewMode('admin')} className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-left truncate">
                ▸ CMCELL
              </button>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full p-2.5 rounded-xl bg-stone-800 hover:bg-rose-900/40 text-stone-300 hover:text-rose-400 text-xs font-bold flex items-center justify-center gap-2 border border-stone-700 transition"
          >
            <LogOut className="w-4 h-4" /> Sign Out Desk
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE CONTENT */}
      <main className="flex-1 p-4 md:p-8 space-y-6 overflow-y-auto">
        {/* Header Banner */}
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-300">
                Hospital Reception Station
              </span>
              <span className="text-xs text-stone-500">• Walk-in OP Desk & Hospital Locations</span>
            </div>
            <h1 className="text-xl font-extrabold text-stone-900 mt-1">
              {activeTab === 'register' && "Walk-in Patient OP Slip Generation Desk"}
              {activeTab === 'tokens' && "Issued Token Slips & OPD Traffic Analytics"}
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200 font-semibold text-stone-700">
              Counter Status: Active (Desk #01)
            </div>
          </div>
        </div>

        {/* TAB 1: WALK-IN REGISTRATION */}
        {activeTab === 'register' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Form */}
            <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-stone-800 font-bold border-b border-stone-100 pb-3">
                <UserPlus className="w-5 h-5 text-teal-600" />
                <span>New Walk-in Patient Registration</span>
              </div>

              <form onSubmit={handleSubmitRegistration} className="space-y-4 text-xs">
                {/* Location Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Select District (38 TN Districts)</label>
                    <select
                      value={district}
                      onChange={handleDistrictChange}
                      className="w-full p-2.5 bg-white border border-stone-300 rounded-lg font-semibold text-stone-800 focus:ring-2 focus:ring-teal-500"
                    >
                      {TN_DISTRICTS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Government Hospital Facility</label>
                    <select
                      value={hospital}
                      onChange={(e) => setHospital(e.target.value)}
                      className="w-full p-2.5 bg-white border border-stone-300 rounded-lg font-semibold text-stone-800 focus:ring-2 focus:ring-teal-500"
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
                    <label className="block font-bold text-stone-700 mb-1">Patient Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Malarvizhi K."
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-800 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Age *</label>
                    <input
                      type="number"
                      name="age"
                      required
                      placeholder="e.g. 38"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-800 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Gender *</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-stone-300 rounded-lg font-medium"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Transgender">Transgender</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Mobile Number *</label>
                    <input
                      type="text"
                      name="phone"
                      required
                      placeholder="10-digit mobile"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-stone-300 rounded-lg font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Aadhaar No. (Optional)</label>
                    <input
                      type="text"
                      name="aadhaar"
                      placeholder="12-digit Aadhaar"
                      value={formData.aadhaar}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-stone-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Target Department / Specialty</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-stone-300 rounded-lg font-medium"
                    >
                      <option value="General Medicine OPD">General Medicine OPD</option>
                      <option value="Ayurveda / Ayush Specialty OPD">Ayurveda / Ayush Specialty OPD</option>
                      <option value="Orthopedics & Joint Care">Orthopedics & Joint Care</option>
                      <option value="Cardiology Triage Desk">Cardiology Triage Desk</option>
                      <option value="ENT & Respiratory Care">ENT & Respiratory Care</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Initial Triage Priority</label>
                    <select
                      name="triage"
                      value={formData.triage}
                      onChange={handleInputChange}
                      className="w-full p-2.5 border border-stone-300 rounded-lg font-semibold"
                    >
                      <option value="Normal">Normal Walk-in</option>
                      <option value="Elderly / Priority">Elderly / Senior Citizen</option>
                      <option value="Emergency / Urgent">Urgent Triage (Chest Pain/Trauma)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-md transition text-sm flex items-center justify-center gap-2 mt-2"
                >
                  <Printer className="w-4 h-4" /> Issue OP Ticket & Print Slip
                </button>
              </form>

              {/* LIVE HOSPITAL LOCATION CARD */}
              <div className="pt-2">
                <div className="text-xs font-bold text-stone-600 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-teal-600" /> Selected Hospital Address & Directions
                </div>
                <HospitalLocationCard hospitalName={hospital} />
              </div>
            </div>

            {/* Right Column: Printed Ticket Preview & Queue */}
            <div className="lg:col-span-5 space-y-6">
              {/* Ticket Slip Card */}
              {generatedTicket ? (
                <div className="bg-stone-900 border border-stone-800 text-white rounded-2xl p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-teal-400" />
                      <span className="font-bold text-sm text-teal-400">OP Slip Issued</span>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-xs text-stone-300 rounded-lg font-semibold flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print
                    </button>
                  </div>

                  <div className="text-center p-4 bg-stone-950 rounded-xl border border-stone-800 space-y-1">
                    <div className="text-xs text-stone-400 uppercase tracking-widest">OP Token Number</div>
                    <div className="text-4xl font-black text-teal-400 font-mono tracking-tight">
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
                      className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
                    >
                      Send to Kiosk Intake <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-stone-50 border border-stone-200 border-dashed rounded-2xl p-6 text-center text-xs text-stone-500 space-y-2">
                  <QrCode className="w-8 h-8 mx-auto text-stone-400" />
                  <div className="font-semibold text-stone-700">No Ticket Printed Yet</div>
                  <div>Complete the walk-in form on the left to issue an OP slip.</div>
                </div>
              )}

              {/* Today's Registrations */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600" /> Counter Registrations ({registeredTokens.length})
                  </h3>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-xs">
                  {registeredTokens.map((item) => (
                    <div
                      key={item.token}
                      className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between hover:border-teal-500 transition"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-stone-900 flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-teal-100 text-teal-800 font-mono rounded text-[10px]">{item.token}</span>
                          <span>{item.name}</span>
                        </div>
                        <div className="text-stone-500 text-[11px]">
                          {item.age} yrs • {item.gender} • {item.department}
                        </div>
                      </div>

                      <button
                        onClick={() => handleStartKioskIntake(item)}
                        className="px-2.5 py-1.5 bg-white border border-stone-300 hover:border-teal-600 text-stone-800 rounded-lg font-semibold text-[11px] flex items-center gap-1 shadow-2xs"
                      >
                        Start Kiosk
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TOKENS & ANALYTICS */}
        {activeTab === 'tokens' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
                  <span>Daily OPD Traffic</span>
                  <Users className="w-4 h-4 text-teal-600" />
                </div>
                <div className="text-2xl font-black text-stone-900">{dailyWalkInOpd} Walk-ins</div>
                <div className="text-[11px] text-teal-600 font-medium">Counter Active Sessions</div>
              </div>

              <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
                  <span>Online Appointments</span>
                  <Activity className="w-4 h-4 text-teal-600" />
                </div>
                <div className="text-2xl font-black text-stone-900">{onlineAppointments} Booked</div>
                <div className="text-[11px] text-stone-500">Via App & Kiosk Portal</div>
              </div>

              <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
                  <span>Active App Users</span>
                  <TrendingUp className="w-4 h-4 text-teal-600" />
                </div>
                <div className="text-2xl font-black text-stone-900">{activeAppUsers} Active</div>
                <div className="text-[11px] text-teal-600 font-medium">Live patient session tracking</div>
              </div>

              <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
                  <span>Token Velocity</span>
                  <Clock className="w-4 h-4 text-teal-600" />
                </div>
                <div className="text-2xl font-black text-stone-900">3.8 min/patient</div>
                <div className="text-[11px] text-teal-600 font-medium">Speed intake operational</div>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3 flex-wrap gap-2">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                  <Printer className="w-4 h-4 text-teal-600" /> Counter Issued OP Slips ({registeredTokens.length})
                </h3>
                <button onClick={() => window.print()} className="px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <Printer className="w-3.5 h-3.5" /> Print Summary
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 text-stone-700 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
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
                  <tbody className="divide-y divide-stone-200">
                    {registeredTokens.map(t => (
                      <tr key={t.token} className="hover:bg-stone-50 transition">
                        <td className="p-3 font-mono font-bold text-teal-700">{t.token}</td>
                        <td className="p-3 font-bold text-stone-900">{t.name}</td>
                        <td className="p-3 text-stone-600">{t.age} yrs • {t.gender}</td>
                        <td className="p-3 text-stone-800 font-medium">{t.hospital}</td>
                        <td className="p-3 text-stone-600">{t.department}</td>
                        <td className="p-3 text-stone-500 font-mono">{t.time}</td>
                        <td className="p-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-300">
                            {t.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleStartKioskIntake(t)}
                            className="px-2.5 py-1 bg-teal-600 text-white hover:bg-teal-500 rounded font-bold text-[10px]"
                          >
                            Launch Kiosk
                          </button>
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
};
