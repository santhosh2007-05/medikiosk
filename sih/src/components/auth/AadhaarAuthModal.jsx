import React, { useState } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { sendRealSmsOtp, verifyRealSmsOtp } from '../../services/firebaseAuth';
import { ShieldCheck, Lock, CheckCircle2, User, KeyRound } from 'lucide-react';

export const AadhaarAuthModal = ({ isOpen, onClose }) => {
  const { setAuthenticatedUser, updateIdentity } = usePatientSession();
  const [step, setStep] = useState('aadhaar'); // 'aadhaar' | 'otp' | 'register'
  const [aadhaarNum, setAadhaarNum] = useState("");
  const [otpVal, setOtpVal] = useState("");
  const [regName, setRegName] = useState("");
  const [regAge, setRegAge] = useState("");
  const [regGender, setRegGender] = useState("Male");
  const [confirmationResult, setConfirmationResult] = useState(null);

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (aadhaarNum.length < 10) {
      alert("Please enter a valid 12-digit Aadhaar Number or 10-digit Mobile Number.");
      return;
    }
    const res = await sendRealSmsOtp(aadhaarNum, "recaptcha-container-modal");
    if (res.success) {
      setConfirmationResult(res.confirmationResult || null);
      alert(res.message);
    }
    setStep('otp');
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otpVal.length < 4) {
      alert("Please enter a valid OTP code.");
      return;
    }
    const verification = await verifyRealSmsOtp(confirmationResult, otpVal);
    if (!verification.success) {
      alert(verification.error || "Invalid OTP code.");
      return;
    }
    const userProfile = {
      aadhaar: aadhaarNum,
      name: regName || "JOSEPH VIJAY",
      age: regAge || "36",
      gender: regGender,
      abhaId: `91-${aadhaarNum.slice(-4)}-8291-${aadhaarNum.slice(0, 4)}`,
      authenticatedAt: new Date().toLocaleTimeString()
    };

    setAuthenticatedUser(userProfile);
    updateIdentity({
      name: userProfile.name,
      age: userProfile.age,
      gender: userProfile.gender,
      token: userProfile.abhaId,
      consentGiven: true
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-kiosk-border">
        <div className="flex items-center justify-between mb-4 border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-kiosk-teal" />
            <h3 className="font-bold text-base text-kiosk-text">Aadhaar / ABHA Patient Authentication</h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 text-base">✕</button>
        </div>

        {step === 'aadhaar' && (
          <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-600 leading-relaxed">
              Enter your 12-digit Aadhaar Number to authenticate your patient account & retrieve previous ABHA medical history.
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">Aadhaar Number (12 Digits) *</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength="12"
                  required
                  value={aadhaarNum}
                  onChange={(e) => setAadhaarNum(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 918274635102"
                  className="w-full text-base px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-kiosk-teal focus:outline-none font-mono"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute right-3 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-kiosk-teal hover:bg-kiosk-teal-hover text-white font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-2 text-sm"
            >
              Get One-Time Password (OTP)
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 leading-relaxed flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>OTP sent to mobile linked with Aadhaar ending in <strong>****{aadhaarNum.slice(-4)}</strong>.</span>
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">Enter 6-Digit OTP *</label>
              <input
                type="text"
                maxLength="6"
                required
                value={otpVal}
                onChange={(e) => setOtpVal(e.target.value)}
                placeholder="e.g. 582491"
                className="w-full text-center tracking-widest text-xl px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-kiosk-teal focus:outline-none font-mono"
              />
            </div>

            <div className="grid grid-cols-1 gap-2 pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-kiosk-teal hover:bg-kiosk-teal-hover text-white font-bold rounded-xl transition shadow-xs text-sm"
              >
                Verify & Login Patient Session
              </button>
              <button
                type="button"
                onClick={() => setStep('aadhaar')}
                className="text-xs text-stone-500 hover:text-stone-800 underline text-center"
              >
                Change Aadhaar Number
              </button>
            </div>
          </form>
        )}
        <div id="recaptcha-container-modal"></div>
      </div>
    </div>
  );
};
