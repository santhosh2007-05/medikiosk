import React, { useState } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { Calendar, Clock, Plus, CheckCircle2, User, Stethoscope, X } from 'lucide-react';

export const AppointmentsPanel = () => {
  const { appointments, addAppointment, session } = usePatientSession();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState("Ayurveda OPD Room #4");
  const [selectedDoctor, setSelectedDoctor] = useState("Dr. V. S. Ramachandran");
  const [selectedDate, setSelectedDate] = useState("2026-09-07");
  const [selectedSlot, setSelectedSlot] = useState("10:30 AM");

  const handleBookSlot = (e) => {
    e.preventDefault();
    const newApt = addAppointment({
      patientName: session.identity.name || "JOSEPH VIJAY",
      doctorName: selectedDoctor,
      department: selectedDept,
      date: selectedDate,
      timeSlot: selectedSlot,
      type: "OPD Intake"
    });
    alert(`Appointment Confirmed! Ticket ID: ${newApt.id} for ${selectedDate} at ${selectedSlot}`);
    setShowBookingModal(false);
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 shadow-md space-y-6 text-stone-100 font-sans">
      <div className="flex items-center justify-between border-b border-stone-800 pb-4 flex-wrap gap-3">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800">
            OPD Appointment Management
          </span>
          <h2 className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-400" /> Hospital OPD Consultation Schedule
          </h2>
        </div>
        <button
          onClick={() => setShowBookingModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 active:scale-98"
        >
          <Plus className="w-4 h-4" /> Book New OPD Appointment
        </button>
      </div>

      {/* Appointments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {appointments.map((apt) => (
          <div key={apt.id} className="p-4 bg-stone-950 border border-stone-800 rounded-xl space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold">{apt.id}</span>
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5 mt-0.5">
                  <User className="w-4 h-4 text-stone-400" /> {apt.patientName}
                </h4>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-mono font-bold flex items-center gap-1 border border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> {apt.status}
              </span>
            </div>

            <div className="text-xs text-stone-300 space-y-1 bg-stone-900 p-3 rounded-lg border border-stone-800">
              <div className="flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-emerald-400" /> <strong>Doctor:</strong> {apt.doctorName}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400" /> <strong>Date:</strong> {apt.date}
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-stone-400" /> <strong>Time Slot:</strong> {apt.timeSlot}
              </div>
              <div><strong>Specialty:</strong> {apt.department}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Book Appointment Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-800 text-stone-100">
            <div className="flex items-center justify-between mb-4 border-b border-stone-800 pb-3">
              <h3 className="font-bold text-base text-white">Book OPD Doctor Consultation Slot</h3>
              <button onClick={() => setShowBookingModal(false)} className="text-stone-400 hover:text-white p-1 rounded-lg bg-stone-950 border border-stone-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleBookSlot} className="space-y-4 text-xs">
              <div>
                <label className="block font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">Select Department / Specialty *</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-stone-800 bg-stone-950 text-white focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Ayurveda OPD Room #4">Ayurveda OPD (Trividha / Dashavidha)</option>
                  <option value="Cardiology OPD">Cardiology OPD</option>
                  <option value="General Medicine OPD">General Medicine OPD</option>
                  <option value="Respiratory OPD">Respiratory OPD</option>
                </select>
              </div>

              <div>
                <label className="block font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">Attending Physician *</label>
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-stone-800 bg-stone-950 text-white focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Dr. V. S. Ramachandran">Dr. V. S. Ramachandran (Senior Physician)</option>
                  <option value="Dr. Tamilselvi M.">Dr. Tamilselvi M. (Ayurvedic Specialist)</option>
                  <option value="Dr. V. S. Ramachandran">Dr. V. S. Ramachandran (General OPD)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">Appointment Date *</label>
                  <input
                    type="date"
                    required
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-stone-800 bg-stone-950 text-white focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-mono font-bold text-stone-400 uppercase tracking-wider mb-1">Time Slot *</label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full p-2.5 text-xs rounded-xl border border-stone-800 bg-stone-950 text-white focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:15 AM">10:15 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:15 AM">11:15 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 border border-stone-800 rounded-xl font-semibold text-stone-300 hover:bg-stone-950 bg-stone-950"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition"
                >
                  Confirm Appointment Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
