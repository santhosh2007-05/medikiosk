import React, { useState } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { TN_DISTRICTS_HOSPITALS } from '../../data/tnHospitals';
import { HospitalLocationCard } from '../../components/common/HospitalLocationCard';
import { MEDICAL_IMAGES } from '../../data/images';
import { Building2, User, Phone, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

export const OnlineRegisterPage = ({ onNavigateLogin }) => {
  const { setAuthenticatedUser, updateIdentity, setViewMode, resetSession, setDoctorQueue } = usePatientSession();
  const [district, setDistrict] = useState("Chennai");
  const [hospital, setHospital] = useState(TN_DISTRICTS_HOSPITALS["Chennai"][0]);
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [mobile, setMobile] = useState("");
  const [aadhaar, setAadhaar] = useState("");

  const districtsList = Object.keys(TN_DISTRICTS_HOSPITALS);
  const hospitalsList = TN_DISTRICTS_HOSPITALS[district] || [];

  const handleDistrictChange = (e) => {
    const selectedDist = e.target.value;
    setDistrict(selectedDist);
    setHospital(TN_DISTRICTS_HOSPITALS[selectedDist][0]);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!fullName || !mobile) {
      alert("Please enter your Name and Mobile Number.");
      return;
    }

    resetSession(); // Wipes previous session documents & complaints for new user

    const tokenNum = "TN-OPD-" + Math.floor(1000 + Math.random() * 9000);
    const newProfile = {
      token: tokenNum,
      name: fullName,
      age: age || "32",
      gender: gender,
      mobile: mobile,
      phone: mobile,
      aadhaar: aadhaar || "918274635102",
      state: "Tamil Nadu",
      district: district,
      hospital: hospital,
      department: "General Medicine OPD",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chiefComplaint: "Online portal registration",
      summaryText: `Patient registered online via portal for ${hospital}. Pending voice intake.`,
      status: "Online Booked",
      abhaId: `91-${mobile.slice(-4)}-8812-3301`,
      visitHistory: [], // NEW USER STARTS WITH EMPTY RECORDS
      isNewUser: true
    };

    setAuthenticatedUser(newProfile);
    fetch("http://localhost:8080/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProfile)
    }).catch(err => console.log("Backend offline, session saved locally:", err));

    setDoctorQueue(prev => [newProfile, ...prev]);
    updateIdentity({
      name: fullName,
      age: age || "32",
      gender: gender,
      token: tokenNum,
      consentGiven: true
    });

    alert(`Registration Successful! OPD Token: ${newProfile.token} generated for ${hospital}`);
    setViewMode('patient-portal');
  };

  return (
    <div className="min-h-screen bg-stone-900 text-white flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="max-w-4xl w-full bg-stone-950 border border-stone-800 rounded-3xl p-6 md:p-10 shadow-2xl space-y-6 overflow-hidden">
        {/* Registration Hero Image Banner */}
        <div className="relative h-44 w-full rounded-2xl overflow-hidden shadow-lg border border-stone-800">
          <img
            src={MEDICAL_IMAGES.registerBanner}
            alt="Tamil Nadu OPD Registration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-emerald-400 bg-stone-900/80 px-2.5 py-1 rounded-md backdrop-blur-md border border-stone-700">
                Government Public Health Portal
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-white mt-1">
                New Patient OPD Registration
              </h2>
            </div>
            <button onClick={onNavigateLogin} className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline bg-stone-900/80 px-3 py-1.5 rounded-lg border border-stone-700 backdrop-blur-md">
              Sign in
            </button>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-6 text-xs">
          {/* Location Hierarchy */}
          <div className="p-4 bg-stone-900 border border-stone-800 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> Hospital Location Hierarchy (Tamil Nadu)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-stone-400 uppercase tracking-wider mb-1">Country</label>
                <input type="text" readOnly value="India" className="w-full p-2.5 bg-stone-800 border border-stone-700 rounded-lg text-white font-semibold" />
              </div>
              <div>
                <label className="block text-stone-400 uppercase tracking-wider mb-1">State</label>
                <input type="text" readOnly value="Tamil Nadu" className="w-full p-2.5 bg-stone-800 border border-stone-700 rounded-lg text-emerald-400 font-semibold" />
              </div>
              <div>
                <label className="block text-stone-400 uppercase tracking-wider mb-1">District (38 TN Districts) *</label>
                <select
                  value={district}
                  onChange={handleDistrictChange}
                  className="w-full p-2.5 bg-stone-800 border border-stone-700 rounded-lg text-white font-semibold focus:ring-1 focus:ring-emerald-500"
                >
                  {districtsList.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-stone-400 uppercase tracking-wider mb-1">Taluk / Area</label>
                <input type="text" placeholder="e.g. Central / HQ" className="w-full p-2.5 bg-stone-800 border border-stone-700 rounded-lg text-white" />
              </div>
            </div>

            <div>
              <label className="block text-stone-400 uppercase tracking-wider mb-1">Select Government Hospital (10 GHs per District) *</label>
              <select
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="w-full p-3 bg-stone-800 border border-stone-700 rounded-xl text-sm font-bold text-white focus:ring-2 focus:ring-emerald-500"
              >
                {hospitalsList.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>

            {/* LIVE HOSPITAL LOCATION & DIRECTIONS CARD */}
            <HospitalLocationCard hospitalName={hospital} className="mt-4" />
          </div>

          {/* Demographics */}
          <div className="p-4 bg-stone-900 border border-stone-800 rounded-2xl space-y-4">
            <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
              <User className="w-4 h-4" /> Patient Demographics & Identification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-400 uppercase tracking-wider mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Santhosh Kumar / இரமேஷ்"
                  className="w-full p-2.5 bg-stone-800 border border-stone-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-stone-400 uppercase tracking-wider mb-1">Age (Years) *</label>
                <input
                  type="number"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 28"
                  className="w-full p-2.5 bg-stone-800 border border-stone-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-stone-400 uppercase tracking-wider mb-1">Gender *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2.5 bg-stone-800 border border-stone-700 rounded-lg text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-400 uppercase tracking-wider mb-1">Mobile Number (For SMS OTP) *</label>
                <input
                  type="text"
                  maxLength="10"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 9840123456"
                  className="w-full p-2.5 bg-stone-800 border border-stone-700 rounded-lg text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-stone-400 uppercase tracking-wider mb-1">Aadhaar Number (Optional)</label>
                <input
                  type="text"
                  maxLength="12"
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 918274635102"
                  className="w-full p-2.5 bg-stone-800 border border-stone-700 rounded-lg text-white font-mono"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-base shadow-lg transition flex items-center justify-center gap-2"
          >
            Complete Registration & Generate Tamil Nadu OPD Token <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
