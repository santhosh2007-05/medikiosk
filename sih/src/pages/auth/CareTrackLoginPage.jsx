import React, { useState } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { sendRealSmsOtp, verifyRealSmsOtp } from '../../services/firebaseAuth';
import { Eye, EyeOff, ArrowRight, CheckCircle2, Phone, KeyRound, AlertCircle, Sparkles, UserCheck } from 'lucide-react';
import { findDoctorByIdOrUsername, getAll760Doctors, findPatientByIdOrUsername, getAllNetworkPatients } from '../../data/hospitalRosterData';

import { MEDICAL_IMAGES, ROLE_AVATARS, FALLBACK_HOSPITAL_SVG } from '../../data/images';

export const CareTrackLoginPage = ({ onNavigateRegister, onLoginSuccess }) => {
  const { setViewMode, setAuthenticatedUser, setAuthenticatedDoctor, resetSession, setSession } = usePatientSession();
  const [role, setRole] = useState("admin"); // 'admin' | 'doctor' | 'nurse' | 'patient' | 'receptionist'
  const [patientAuthMode, setPatientAuthMode] = useState("id"); // 'id' | 'otp'
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [selectedDoctorSample, setSelectedDoctorSample] = useState("");
  const [selectedPatientSample, setSelectedPatientSample] = useState("");

  const all760Doctors = React.useMemo(() => getAll760Doctors(), []);
  const all2280Patients = React.useMemo(() => getAllNetworkPatients(), []);

  const getRoleAvatar = () => {
    switch (role) {
      case 'admin': return ROLE_AVATARS?.admin || FALLBACK_HOSPITAL_SVG;
      case 'doctor': return ROLE_AVATARS?.doctor1 || FALLBACK_HOSPITAL_SVG;
      case 'nurse': return ROLE_AVATARS?.nurse1 || FALLBACK_HOSPITAL_SVG;
      case 'receptionist': return ROLE_AVATARS?.receptionist1 || FALLBACK_HOSPITAL_SVG;
      case 'patient': return ROLE_AVATARS?.patientMale1 || FALLBACK_HOSPITAL_SVG;
      default: return ROLE_AVATARS?.admin || FALLBACK_HOSPITAL_SVG;
    }
  };

  // Patient SMS OTP Conditional State Management
  const [aadhaarNum, setAadhaarNum] = useState("");
  const [otpVal, setOtpVal] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const handleRoleChange = (e) => {
    const selected = e.target.value;
    setRole(selected);
    setLoginError("");
    if (selected === 'admin') setUsername('admin');
    if (selected === 'receptionist') setUsername('receptionist');
    if (selected === 'doctor') setUsername('DOC-1001');
    if (selected === 'nurse') setUsername('nurse');
    if (selected === 'patient') {
      setUsername('PAT-1001');
      setAadhaarNum("");
      setIsOtpSent(false);
      setOtpVal("");
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");

    if (!username || !username.trim() || !password || !password.trim()) {
      setLoginError("Enter valid ID or password");
      return;
    }

    if (role === 'doctor') {
      const doc = findDoctorByIdOrUsername(username);
      if (!doc) {
        setLoginError("Enter valid ID or password");
        return;
      }
      setAuthenticatedDoctor(doc);
      setViewMode('doctor');
      onLoginSuccess && onLoginSuccess('doctor');
    } else if (role === 'patient') {
      const pat = findPatientByIdOrUsername(username);
      if (!pat) {
        setLoginError("Enter valid ID or password");
        return;
      }
      resetSession();
      setAuthenticatedUser(pat);
      setSession(prev => ({
        ...prev,
        identity: {
          ...prev.identity,
          name: pat.name,
          age: pat.age,
          gender: pat.gender,
          token: pat.token || pat.id || `OPD-${pat.id}`,
          abhaId: pat.abhaId,
          phone: pat.phone,
          aadhaar: pat.aadhaar,
          category: pat.category,
          consentGiven: true
        },
        documents: pat.documents || []
      }));
      setViewMode('patient-portal');
      onLoginSuccess && onLoginSuccess('patient');
    } else if (role === 'admin') {
      if (username.trim().toLowerCase() !== 'admin') {
        setLoginError("Enter valid ID or password");
        return;
      }
      setViewMode('admin');
      onLoginSuccess && onLoginSuccess('admin');
    } else if (role === 'receptionist') {
      setViewMode('receptionist');
      onLoginSuccess && onLoginSuccess('receptionist');
    } else if (role === 'nurse') {
      setViewMode('nurse');
      onLoginSuccess && onLoginSuccess('nurse');
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (aadhaarNum.length < 10) {
      alert("Please enter a valid 10-digit Mobile Number or 12-digit Aadhaar Number.");
      return;
    }
    setIsSendingOtp(true);
    const res = await sendRealSmsOtp(aadhaarNum);
    setIsSendingOtp(false);

    if (res.success) {
      setIsOtpSent(true);
      setConfirmationResult(res.confirmationResult || null);
      alert(res.message);
    } else {
      alert(res.error || "Could not send SMS. Please check your mobile number.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpVal || otpVal.trim().length < 4) {
      alert("Please enter the 6-digit OTP code shown in the popup alert.");
      return;
    }

    const verification = await verifyRealSmsOtp(confirmationResult, otpVal);
    if (!verification.success) {
      alert(verification.error || "Incorrect OTP code. Please enter the exact 6-digit code.");
      return;
    }

    resetSession(); // Wipes previous session documents and complaints

    const matched = findPatientByIdOrUsername(aadhaarNum);
    const patientProfile = matched || {
      id: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
      username: `pat_${aadhaarNum.slice(-4)}`,
      name: "JOSEPH VIJAY",
      phone: aadhaarNum,
      aadhaar: aadhaarNum,
      age: "36",
      gender: "Male",
      abhaId: `91-${aadhaarNum.slice(-4)}-7829-4412`,
      role: "PATIENT",
      visitHistory: [],
      documents: [],
      isNewUser: true
    };

    setAuthenticatedUser(patientProfile);
    setSession(prev => ({
      ...prev,
      identity: {
        ...prev.identity,
        name: patientProfile.name,
        age: patientProfile.age,
        gender: patientProfile.gender,
        token: patientProfile.token || patientProfile.id || patientProfile.abhaId,
        abhaId: patientProfile.abhaId,
        phone: patientProfile.phone,
        aadhaar: patientProfile.aadhaar,
        category: patientProfile.category || "Resident",
        consentGiven: true
      },
      documents: patientProfile.documents || []
    }));

    setViewMode('patient-portal');
    onLoginSuccess && onLoginSuccess('patient');
  };

  const loginSlides = [
    {
      image: MEDICAL_IMAGES?.loginSlide1 || FALLBACK_HOSPITAL_SVG,
      title: "Be Healthy & Preventative Care",
      subtitle: "Comprehensive health monitoring, heart wellness, and AI clinical triage."
    },
    {
      image: MEDICAL_IMAGES?.loginSlide2 || FALLBACK_HOSPITAL_SVG,
      title: "Dedicated Clinical Healthcare Team",
      subtitle: "Integrated Doctor Workstation, Nurse Triage, and OPD Queue."
    },
    {
      image: MEDICAL_IMAGES?.loginSlide3 || FALLBACK_HOSPITAL_SVG,
      title: "Digital Doctor & Tele-Health Network",
      subtitle: "State-of-the-art diagnostic imaging and ABDM Health Cloud EHR."
    }
  ];

  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlideIdx((prev) => (prev + 1) % loginSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [loginSlides.length]);

  return (
    <div className="min-h-screen bg-stone-900 text-white flex items-center justify-center p-4 pt-10 md:p-8 font-sans">
      <div className="max-w-5xl w-full bg-stone-950 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* LEFT COLUMN: Automatic 3-Image Sliding Carousel Visual */}
        <div className="md:col-span-6 relative p-8 md:p-10 flex flex-col justify-between overflow-hidden transition-all duration-700 min-h-[400px]">
          {/* Animated Background Images */}
          <div
            key={activeSlideIdx}
            className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-700"
            style={{
              backgroundImage: `linear-gradient(to top, rgba(12, 10, 9, 0.92), rgba(12, 10, 9, 0.4)), url('${loginSlides[activeSlideIdx].image}')`
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-md">
                MK
              </div>
              <span className="font-extrabold tracking-wider text-sm uppercase text-emerald-400">MediKiosk Portal</span>
            </div>
            
            <div
              key={`text-${activeSlideIdx}`}
              className="transition-all duration-500"
            >
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-6 tracking-tight">
                {loginSlides[activeSlideIdx].title}
              </h1>
              <p className="text-stone-300 text-xs mt-3 leading-relaxed">
                {loginSlides[activeSlideIdx].subtitle}
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-4">
            {/* Auto Carousel Indicator Dots */}
            <div className="flex items-center gap-2 mb-2">
              {loginSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlideIdx(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeSlideIdx === idx ? 'w-8 bg-emerald-400' : 'w-2 bg-stone-600 hover:bg-stone-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Active Role Preview Card with Avatar Image */}
            <div className="p-4 rounded-2xl bg-stone-900/85 backdrop-blur-md border border-stone-700/60 flex items-center gap-3.5 shadow-xl">
              <img src={getRoleAvatar()} alt="Role Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shadow-md" />
              <div>
                <div className="text-xs font-extrabold text-white uppercase tracking-wider">
                  {role === 'admin' ? 'AYUSH Operational Desk' : role === 'doctor' ? 'Doctor OPD Workstation' : role === 'nurse' ? 'Nurse Intervention Desk' : role === 'receptionist' ? 'Reception Counter Desk' : 'Patient Portal'}
                </div>
                <p className="text-[11px] text-emerald-400 font-medium">
                  Active Operational Access
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Authentication Form */}
        <div className="md:col-span-6 p-8 md:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white">Portal Sign In</h2>
              <p className="text-xs text-stone-400 mt-1">Select your portal role to access system modules.</p>
            </div>

            {/* Role Selection Tabs with Avatar Thumbnail */}
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider">Select Access Role</label>
              <div className="flex items-center gap-3">
                <img src={getRoleAvatar()} alt="Selected Role Avatar" className="w-10 h-10 rounded-xl object-cover border border-emerald-500 shadow-xs shrink-0" />
                <select
                  value={role}
                  onChange={handleRoleChange}
                  className="w-full p-3 bg-stone-900 border border-stone-700 rounded-xl text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="admin">AYUSH Operational Desk</option>
                  <option value="doctor">Doctor OPD Workstation (760 Doctor Panels)</option>
                  <option value="nurse">Nurse Intervention Desk</option>
                  <option value="receptionist">Reception Counter Desk</option>
                  <option value="patient">Patient Portal (2,280+ Distinct Patient Panels)</option>
                </select>
              </div>
            </div>

            {/* PATIENT SUB-TAB SELECTOR (User ID vs SMS OTP) */}
            {role === 'patient' && (
              <div className="flex rounded-xl bg-stone-900 p-1 border border-stone-800">
                <button
                  type="button"
                  onClick={() => { setPatientAuthMode('id'); setLoginError(""); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                    patientAuthMode === 'id' ? 'bg-emerald-600 text-white shadow' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Patient User ID / Directory
                </button>
                <button
                  type="button"
                  onClick={() => { setPatientAuthMode('otp'); setLoginError(""); }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
                    patientAuthMode === 'otp' ? 'bg-emerald-600 text-white shadow' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  Mobile SMS OTP
                </button>
              </div>
            )}

            {/* Standard ID / Password Form (For Staff & Patient ID Mode) */}
            {(role !== 'patient' || patientAuthMode === 'id') ? (
              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-rose-950/80 border border-rose-600/80 rounded-xl text-xs text-rose-200 flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="font-bold">{loginError}</span>
                  </div>
                )}

                {role === 'doctor' && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl space-y-1.5">
                    <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Quick Doctor Roster (760 Doctor Panels)
                    </label>
                    <select
                      value={selectedDoctorSample}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedDoctorSample(val);
                        if (val) {
                          setUsername(val);
                          setLoginError("");
                        }
                      }}
                      className="w-full p-2 bg-stone-900 border border-emerald-700/60 rounded-lg text-xs font-semibold text-emerald-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="">-- Choose from 760 State Doctors (or type ID below) --</option>
                      {all760Doctors.map((doc) => (
                        <option key={doc.id} value={doc.id}>
                          {doc.id} • {doc.name} ({doc.district} - {doc.spec.split('&')[0]})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {role === 'patient' && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl space-y-1.5">
                    <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <UserCheck className="w-3 h-3" /> Quick Patient Directory (2,280 Distinct Patient Panels)
                    </label>
                    <select
                      value={selectedPatientSample}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedPatientSample(val);
                        if (val) {
                          setUsername(val);
                          setLoginError("");
                        }
                      }}
                      className="w-full p-2 bg-stone-900 border border-emerald-700/60 rounded-lg text-xs font-semibold text-emerald-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="">-- Select Patient Panel (or type ID below) --</option>
                      {all2280Patients.slice(0, 50).map((pat) => (
                        <option key={pat.id} value={pat.id}>
                          {pat.id} ({pat.username}) • {pat.name} • {pat.district} ({pat.hospital.split(',')[0]})
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-stone-400">
                      Supports all 2,280+ IDs (<span className="text-emerald-400 font-mono">PAT-1001</span> to <span className="text-emerald-400 font-mono">PAT-3280</span> or <span className="text-emerald-400 font-mono">pat1001</span>).
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                    {role === 'doctor'
                      ? 'Doctor ID or Username (e.g. DOC-1001 to DOC-1760)'
                      : role === 'patient'
                      ? 'Patient User ID / Username / ABHA / Phone (e.g. PAT-1001, pat1001, OPD-1001)'
                      : 'Username / Staff ID'}
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (loginError) setLoginError("");
                    }}
                    placeholder={
                      role === 'doctor'
                        ? 'Enter Doctor ID (e.g. DOC-1042)...'
                        : role === 'patient'
                        ? 'Enter Patient ID (e.g. PAT-1001, pat1001, ABHA)...'
                        : 'Enter Staff ID...'
                    }
                    className="w-full p-3 bg-stone-900 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (loginError) setLoginError("");
                      }}
                      className="w-full p-3 bg-stone-900 border border-stone-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-stone-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition text-xs flex items-center justify-center gap-2"
                >
                  Sign in to {role === 'admin' ? 'AYUSH' : role === 'patient' ? 'Patient Portal' : role.toUpperCase()} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Patient Passwordless Aadhaar / Mobile OTP Login Form */
              <div className="space-y-4">
                <form onSubmit={handleSendOtp} className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-300 uppercase tracking-wider mb-1">
                      Mobile Number (10 Digits) or Aadhaar *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={aadhaarNum}
                        onChange={(e) => setAadhaarNum(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 10-digit mobile (e.g. 7598357132)"
                        className="w-full p-3 pl-9 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      />
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-md"
                  >
                    {isSendingOtp ? "Sending OTP..." : "Send SMS OTP"} <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* CONDITIONAL RENDERING BLOCK FOR LOWER OTP SECTION */}
                {isOtpSent && (
                  <div className="overflow-hidden transition-all duration-500 animate-in fade-in slide-in-from-top-2">
                    <form onSubmit={handleVerifyOtp} className="space-y-3 pt-3 border-t border-stone-800">
                      {/* 1. "SMS OTP Sent" Confirmation Banner */}
                      <div className="p-3 bg-emerald-950/70 border border-emerald-800/90 rounded-xl text-xs text-emerald-300 space-y-1 shadow-sm">
                        <div className="font-bold flex items-center gap-1.5 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> SMS OTP Sent to +91 {aadhaarNum}
                        </div>
                        <p className="text-[11px] text-stone-300">
                          Please enter the 6-digit OTP code displayed in the popup alert.
                        </p>
                      </div>

                      {/* 2. OTP Input Box */}
                      <div>
                        <label className="block text-[10px] font-bold text-stone-300 uppercase tracking-wider mb-1">
                          Enter 6-Digit SMS OTP Code *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength="6"
                            required
                            value={otpVal}
                            onChange={(e) => setOtpVal(e.target.value)}
                            placeholder="Enter 6-digit OTP from popup alert"
                            className="w-full p-3 pl-9 bg-stone-900 border border-emerald-600 rounded-xl text-center text-lg tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold shadow-inner"
                          />
                          <KeyRound className="w-4 h-4 text-emerald-400 absolute left-3 top-4" />
                        </div>
                      </div>

                      {/* 3. Primary "Verify OTP" Action Button */}
                      <button
                        type="submit"
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl transition text-xs shadow-lg flex items-center justify-center gap-2"
                      >
                        Verify OTP & Access Patient Portal <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>

          <div id="recaptcha-container"></div>
        </div>
      </div>
    </div>
  );
};
