import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePatientSession } from '../../context/PatientSessionContext';
import { sendRealSmsOtp, verifyRealSmsOtp } from '../../services/firebaseAuth';
import { Eye, EyeOff, ArrowRight, CheckCircle2, Phone, ShieldCheck, KeyRound } from 'lucide-react';

import { MEDICAL_IMAGES, ROLE_AVATARS } from '../../data/images';

export const CareTrackLoginPage = ({ onNavigateRegister, onLoginSuccess }) => {
  const { setViewMode, setAuthenticatedUser, updateIdentity, resetSession } = usePatientSession();
  const [role, setRole] = useState("admin"); // 'admin' | 'doctor' | 'nurse' | 'patient' | 'receptionist'
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);

  // Dynamic image mapping based on selected role
  const getRoleBgImage = () => {
    switch (role) {
      case 'admin': return MEDICAL_IMAGES.cmcellHero;
      case 'doctor': return MEDICAL_IMAGES.doctorWorkspace;
      case 'nurse': return MEDICAL_IMAGES.nurseStation;
      case 'receptionist': return MEDICAL_IMAGES.receptionDesk;
      case 'patient': return MEDICAL_IMAGES.digitalKiosk;
      default: return MEDICAL_IMAGES.hero;
    }
  };

  const getRoleAvatar = () => {
    switch (role) {
      case 'admin': return ROLE_AVATARS.admin;
      case 'doctor': return ROLE_AVATARS.doctor1;
      case 'nurse': return ROLE_AVATARS.nurse1;
      case 'receptionist': return ROLE_AVATARS.receptionist1;
      case 'patient': return ROLE_AVATARS.patientMale1;
      default: return ROLE_AVATARS.admin;
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
    if (selected === 'receptionist') setUsername('receptionist');
    if (selected === 'doctor') setUsername('doctor');
    if (selected === 'nurse') setUsername('nurse');
    if (selected === 'patient') {
      setUsername('josephvijay');
      setAadhaarNum("");
      setIsOtpSent(false);
      setOtpVal("");
    }
  };

  const handleStaffLogin = (e) => {
    e.preventDefault();
    if (role === 'admin') setViewMode('admin');
    else if (role === 'receptionist') setViewMode('receptionist');
    else if (role === 'doctor') setViewMode('doctor');
    else if (role === 'nurse') setViewMode('nurse');
    else setViewMode('patient-portal');

    onLoginSuccess && onLoginSuccess(role);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
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

    const patientProfile = {
      name: "JOSEPH VIJAY",
      phone: aadhaarNum,
      aadhaar: aadhaarNum,
      age: "36",
      gender: "Male",
      abhaId: `91-${aadhaarNum.slice(-4)}-7829-4412`,
      role: "PATIENT",
      visitHistory: [],
      isNewUser: true
    };

    setAuthenticatedUser(patientProfile);
    updateIdentity({
      name: patientProfile.name,
      age: patientProfile.age,
      gender: patientProfile.gender,
      token: patientProfile.abhaId,
      consentGiven: true
    });

    setViewMode('patient-portal');
    onLoginSuccess && onLoginSuccess('patient');
  };

  return (
    <div className="min-h-screen bg-stone-900 text-white flex items-center justify-center p-4 pt-10 md:p-8 font-sans">
      <div className="max-w-5xl w-full bg-stone-950 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 min-h-[580px]">
        {/* LEFT COLUMN: MediKiosk Hospital Visual with Dynamic Internet Image */}
        <div className="md:col-span-6 relative p-8 md:p-10 flex flex-col justify-between bg-cover bg-center overflow-hidden transition-all duration-700"
             style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.3)), url('${getRoleBgImage()}')` }}>
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-md">
                MK
              </div>
              <span className="font-extrabold tracking-wider text-sm uppercase text-emerald-400">MediKiosk Portal</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-6 tracking-tight">
              Unified Healthcare & Doctor Workstation
            </h1>
            <p className="text-stone-300 text-xs mt-3 leading-relaxed">
              Integrated AI Clinical Intake, Doctor Station EHR, Nurse Triage, and ABDM Patient Portal with SMS OTP Authentication.
            </p>
          </div>

          {/* Active Role Preview Card with Avatar Image */}
          <div className="p-4 rounded-2xl bg-stone-900/85 backdrop-blur-md border border-stone-700/60 flex items-center gap-3.5 shadow-xl">
            <img src={getRoleAvatar()} alt="Role Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shadow-md" />
            <div>
              <div className="text-xs font-extrabold text-white uppercase tracking-wider">
                {role === 'admin' ? 'CMCELL Operational Desk' : role === 'doctor' ? 'Doctor OPD Workstation' : role === 'nurse' ? 'Nurse Intervention Desk' : role === 'receptionist' ? 'Reception Counter Desk' : 'Patient Portal'}
              </div>
              <p className="text-[11px] text-emerald-400 font-medium">
                Active Operational Access
              </p>
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
                  <option value="admin">CMCELL Operational Desk</option>
                  <option value="doctor">Doctor OPD Workstation</option>
                  <option value="nurse">Nurse Intervention Desk</option>
                  <option value="receptionist">Reception Counter Desk</option>
                  <option value="patient">Patient Portal (Passwordless Mobile OTP)</option>
                </select>
              </div>
            </div>

            {/* FORM CONDITIONAL RENDERING */}
            {role !== 'patient' ? (
              /* Staff Login Form */
              <form onSubmit={handleStaffLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Staff Username *</label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Password *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 bg-stone-900 border border-stone-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10 font-mono"
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
                  Sign in to {role === 'admin' ? 'CMCELL' : role.toUpperCase()} Portal <ArrowRight className="w-4 h-4" />
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

                {/* CONDITIONAL RENDERING BLOCK FOR LOWER OTP SECTION WITH SMOOTH SLIDE-DOWN & FADE-IN TRANSITION */}
                <AnimatePresence>
                  {isOtpSent && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, y: -12 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -12 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div id="recaptcha-container"></div>
        </div>
      </div>
    </div>
  );
};
