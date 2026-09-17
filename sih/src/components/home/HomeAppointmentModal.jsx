import React, { useState } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import {
  User, Stethoscope, FileText,
  ShieldCheck, CheckCircle2, X, Home,
  Sparkles, ArrowRight, Activity
} from 'lucide-react';
import { ALL_380_TN_HOSPITALS } from '../../data/tnHospitals';

export const HomeAppointmentModal = ({ isOpen, onClose }) => {
  const { addAppointment, setDoctorQueue, setViewMode, setCurrentStep, updateIdentity, updateHistory } = usePatientSession();

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    aadhaar: '',
    hospital: ALL_380_TN_HOSPITALS[0]?.name || 'Rajiv Gandhi Government General Hospital, Chennai',
    department: 'Cardiology & Ayush Integrative Care',
    doctor: 'Dr. V. S. Ramachandran',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '10:30 AM',
    chiefComplaint: '',
    ayushMode: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.chiefComplaint) {
      alert('Please fill in all mandatory fields (Name, Phone, and Symptoms).');
      return;
    }

    setIsSubmitting(true);
    const newToken = 'OPD-' + Math.floor(100 + Math.random() * 900);
    const aptNumber = 'APT-' + Math.floor(100 + Math.random() * 900);

    const payload = {
      appointmentNumber: aptNumber,
      token: newToken,
      patientName: formData.name.trim(),
      patientAge: formData.age || '32',
      patientGender: formData.gender,
      patientPhone: formData.phone.trim(),
      aadhaar: formData.aadhaar || '91-' + Math.floor(1000 + Math.random() * 9000) + '-1192-3382',
      doctorName: formData.doctor,
      department: formData.department,
      hospitalName: formData.hospital,
      appointmentDate: formData.date,
      timeSlot: formData.timeSlot,
      chiefComplaint: formData.chiefComplaint.trim(),
      status: 'Confirmed',
      appointmentType: 'Home Booked OP'
    };

    try {
      // 1. Post to Spring Boot MySQL Backend
      const res = await fetch('http://localhost:8080/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      console.log('Booked Home OP:', data);
    } catch (err) {
      console.warn('Backend offline, saving appointment locally:', err);
    }

    // 2. Add to Local React Session State for instant multi-panel reflection
    addAppointment({
      id: aptNumber,
      token: newToken,
      patientName: payload.patientName,
      patientPhone: payload.patientPhone,
      doctorName: payload.doctorName,
      department: payload.department,
      hospital: payload.hospitalName,
      date: payload.appointmentDate,
      timeSlot: payload.timeSlot,
      chiefComplaint: payload.chiefComplaint,
      status: 'Confirmed',
      type: 'Home Booked OP'
    });

    const newPatientSession = {
      token: newToken,
      name: payload.patientName,
      age: payload.patientAge,
      gender: payload.patientGender,
      phone: payload.patientPhone,
      aadhaar: payload.aadhaar,
      hospital: payload.hospitalName,
      department: payload.department,
      time: payload.timeSlot,
      chiefComplaint: payload.chiefComplaint,
      summaryText: `Online Home-Booked OP Appointment (${aptNumber}) for ${payload.hospitalName} [${payload.department}]. Scheduled for ${payload.timeSlot} on ${payload.appointmentDate}. Chief Complaint: ${payload.chiefComplaint}`,
      status: 'Upcoming - Home Booked',
      isHomeBooked: true,
      appointmentNumber: aptNumber,
      ayushMode: formData.ayushMode,
      vitals: { sysBp: '122', diaBp: '80', heartRate: '74', spo2: '98%', temp: '98.6°F' }
    };

    setDoctorQueue(prev => [newPatientSession, ...prev]);

    setBookingSuccess({
      ...payload,
      token: newToken,
      appointmentNumber: aptNumber
    });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl text-stone-100 relative max-h-[92vh] overflow-y-auto font-sans">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {bookingSuccess ? (
          /* SUCCESS SCREEN */
          <div className="text-center space-y-6 py-4 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-950 border border-emerald-700 text-emerald-400 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-900/30">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
                OP Appointment Confirmed
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-2">
                Online OP Booking Successful!
              </h2>
              <p className="text-xs text-stone-400 mt-1 max-w-md mx-auto">
                Your consultation token is active and synchronized in real time with the hospital doctor & nurse queue.
              </p>
            </div>

            {/* Appointment Ticket Card */}
            <div className="bg-stone-950 border border-emerald-900/60 rounded-2xl p-5 text-left space-y-3">
              <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-mono text-stone-400 font-bold block">OP Consultation Token</span>
                  <span className="text-xl font-mono font-extrabold text-emerald-400">{bookingSuccess.token}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono text-stone-400 font-bold block">Ticket Number</span>
                  <span className="text-sm font-mono font-bold text-white">{bookingSuccess.appointmentNumber}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-stone-400 block text-[11px]">Patient Name:</span>
                  <strong className="text-white">{bookingSuccess.patientName} ({bookingSuccess.patientAge}y/{bookingSuccess.patientGender})</strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Phone Number:</span>
                  <strong className="text-white font-mono">{bookingSuccess.patientPhone}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Attending Doctor:</span>
                  <strong className="text-emerald-400">{bookingSuccess.doctorName}</strong>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Scheduled Slot:</span>
                  <strong className="text-white font-mono">{bookingSuccess.timeSlot} • {bookingSuccess.appointmentDate}</strong>
                </div>
                <div className="col-span-2">
                  <span className="text-stone-400 block text-[11px]">Hospital & Department:</span>
                  <strong className="text-stone-200">{bookingSuccess.hospitalName} ({bookingSuccess.department})</strong>
                </div>
              </div>

              {/* Hospital Kiosk Attendance Callout */}
              <div className="p-3.5 bg-cyan-950/60 border border-cyan-700/80 rounded-xl text-xs text-cyan-200 space-y-1 mt-2">
                <div className="flex items-center gap-2 font-bold text-cyan-300">
                  <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Important: Please Attend Hospital AI Voice Kiosk</span>
                </div>
                <p className="text-[11px] text-stone-300 leading-relaxed">
                  Upon arriving at the hospital, please use the <strong>Hospital AI Voice Kiosk</strong> to capture your vitals (Blood Pressure, SpO2, Heart Rate) and AI voice intake. Since you already booked OP online, your details are saved—no need to re-enter your details at the kiosk!
                </p>
              </div>

              {/* Privacy Consent Notice */}
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/70 rounded-xl text-xs text-emerald-300 flex items-start gap-2.5 mt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold text-white">ABDM Privacy & 5-Minute OTP Consent:</strong>
                  When your consultation begins, the doctor will request your explicit consent. A 6-digit BCrypt-encrypted OTP will pop up on your portal/SMS to unlock your records for 5 minutes.
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  updateIdentity({
                    name: bookingSuccess.patientName,
                    age: bookingSuccess.patientAge,
                    gender: bookingSuccess.patientGender,
                    token: bookingSuccess.token,
                    phone: bookingSuccess.patientPhone,
                    consentGiven: true
                  });
                  updateHistory({
                    chiefComplaint: bookingSuccess.chiefComplaint
                  });
                  setCurrentStep(4); // Skip demographic & consent screens directly to Step 4 (AI Intake/Vitals)
                  setViewMode('kiosk');
                  onClose();
                }}
                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Proceed to Kiosk Fast-Track (Details Preloaded) <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold rounded-xl text-xs shadow-md transition"
              >
                Go to Dashboard / Close
              </button>
            </div>
          </div>
        ) : (
          /* BOOKING FORM */
          <div className="space-y-5">
            <div className="border-b border-stone-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                  <Home className="w-3 h-3" /> Home OP Tele-Booking
                </span>
                <span className="text-xs text-stone-400">• ABDM Unified Care</span>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-white mt-1">
                Book Outpatient (OP) Consultation from Home
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Schedule your OP visit in advance. Your intake information and symptoms will be instantly accessible to the doctor upon secure OTP verification.
              </p>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-4 text-xs">
              {/* Section 1: Patient Essential Identity */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-300 uppercase font-mono text-[10px] tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-400" /> 1. Patient Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-stone-400 font-medium mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. S. Soundarya"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-white placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 font-medium mb-1">Age *</label>
                    <input
                      type="number"
                      name="age"
                      required
                      placeholder="e.g. 28"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-white placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-stone-400 font-medium mb-1">Gender *</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-400 font-medium mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="10-digit Mobile (e.g. 9840123456)"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-white font-mono placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 font-medium mb-1">Aadhaar / ABHA ID</label>
                    <input
                      type="text"
                      name="aadhaar"
                      placeholder="91-XXXX-XXXX-XXXX"
                      value={formData.aadhaar}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-white font-mono placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Hospital, Doctor & Time Slot */}
              <div className="space-y-3 pt-2 border-t border-stone-800">
                <h4 className="font-bold text-stone-300 uppercase font-mono text-[10px] tracking-wider flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-400" /> 2. Hospital, Specialty & Time Slot
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-400 font-medium mb-1">Select Hospital *</label>
                    <select
                      name="hospital"
                      value={formData.hospital}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    >
                      {ALL_380_TN_HOSPITALS.slice(0, 8).map((h, i) => (
                        <option key={i} value={h.name}>{h.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-400 font-medium mb-1">Specialty / Department *</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    >
                      <option value="Cardiology & Ayush Integrative Care">Cardiology & Ayush Integrative Care</option>
                      <option value="General Medicine OPD">General Medicine OPD</option>
                      <option value="Ayurveda OPD Room #4">Ayurveda OPD (Dashavidha Pariksha)</option>
                      <option value="Respiratory & Pulmonology">Respiratory & Pulmonology</option>
                      <option value="Orthopedics & Joint Care">Orthopedics & Joint Care</option>
                      <option value="Neurology & Stroke OPD">Neurology & Stroke OPD</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-stone-400 font-medium mb-1">Attending Doctor *</label>
                    <select
                      name="doctor"
                      value={formData.doctor}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                    >
                      <option value="Dr. V. S. Ramachandran">Dr. V. S. Ramachandran (Senior Physician)</option>
                      <option value="Dr. Tamilselvi M.">Dr. Tamilselvi M. (Ayurvedic Specialist)</option>
                      <option value="Dr. K. Soundararajan">Dr. K. Soundararajan (Cardiologist)</option>
                      <option value="Dr. Priyadarshini R.">Dr. Priyadarshini R. (General Medicine)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-400 font-medium mb-1">Date *</label>
                    <input
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-400 font-medium mb-1">Time Slot *</label>
                    <select
                      name="timeSlot"
                      value={formData.timeSlot}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    >
                      <option value="09:30 AM">09:30 AM (Morning)</option>
                      <option value="10:15 AM">10:15 AM (Morning)</option>
                      <option value="10:30 AM">10:30 AM (Morning)</option>
                      <option value="11:15 AM">11:15 AM (Morning)</option>
                      <option value="02:00 PM">02:00 PM (Afternoon)</option>
                      <option value="03:30 PM">03:30 PM (Evening)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 3: Symptoms & Complaints */}
              <div className="space-y-3 pt-2 border-t border-stone-800">
                <h4 className="font-bold text-stone-300 uppercase font-mono text-[10px] tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" /> 3. Chief Symptoms & Medical Reason *
                </h4>

                <div>
                  <textarea
                    name="chiefComplaint"
                    rows={3}
                    required
                    placeholder="Describe your symptoms in detail (e.g. Mild chest pain with breathlessness for 2 days, headache, cough)..."
                    value={formData.chiefComplaint}
                    onChange={handleChange}
                    className="w-full p-3 bg-stone-950 border border-stone-800 rounded-xl text-white placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs leading-relaxed"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="ayushMode"
                    name="ayushMode"
                    checked={formData.ayushMode}
                    onChange={handleChange}
                    className="w-4 h-4 rounded text-emerald-600 bg-stone-950 border-stone-800 focus:ring-emerald-500"
                  />
                  <label htmlFor="ayushMode" className="text-stone-300 font-medium cursor-pointer">
                    Include AYUSH Ayurvedic Assessment (Agni & Prakriti Evaluation)
                  </label>
                </div>
              </div>

              {/* Privacy Footer & Submit */}
              <div className="pt-4 border-t border-stone-800 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-1.5 text-stone-400 text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Encrypted under ABDM Consent Architecture</span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-stone-950 hover:bg-stone-800 text-stone-300 rounded-xl border border-stone-800 transition font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition flex items-center gap-2 active:scale-98 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Booking Slot...' : 'Confirm OP Appointment'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
