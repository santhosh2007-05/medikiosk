import React, { useState } from 'react';
import { usePatientSession } from '../../context/PatientSessionContext';
import { Calendar, Clock, CheckCircle2, User, Stethoscope, Home, Plus } from 'lucide-react';
import { HomeAppointmentModal } from '../home/HomeAppointmentModal';

export const AppointmentsPanel = () => {
  const { appointments, session, authenticatedUser } = usePatientSession();
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Filter so patient ONLY sees their OWN appointments
  const currentPatientName = (authenticatedUser?.name || session?.identity?.name || "JOSEPH VIJAY").toLowerCase().trim();
  const currentPhone = (authenticatedUser?.phone || session?.identity?.phone || "").trim();

  const myAppointments = appointments.filter(apt => {
    const aptName = (apt.patientName || "").toLowerCase().trim();
    const aptPhone = (apt.patientPhone || "").trim();
    const matchName = currentPatientName && (aptName === currentPatientName || aptName.includes(currentPatientName) || currentPatientName.includes(aptName));
    const matchPhone = currentPhone && aptPhone && (aptPhone.includes(currentPhone) || currentPhone.includes(aptPhone));
    return matchName || matchPhone;
  });

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 md:p-8 shadow-md space-y-6 text-stone-100 font-sans">
      <div className="flex items-center justify-between border-b border-stone-800 pb-4 flex-wrap gap-3">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-800">
            My OPD Appointments
          </span>
          <h2 className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-400" /> My OP Consultation Schedule
          </h2>
        </div>
        <button
          onClick={() => setShowBookingModal(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 active:scale-98"
        >
          <Home className="w-4 h-4" /> Apply OP from Home (+1)
        </button>
      </div>

      {/* Appointments List for Current Patient Only */}
      {myAppointments.length === 0 ? (
        <div className="p-8 bg-stone-950 border border-stone-800 rounded-xl text-center space-y-3">
          <Calendar className="w-10 h-10 text-stone-600 mx-auto" />
          <h3 className="font-bold text-sm text-white">No OP Appointments Scheduled</h3>
          <p className="text-xs text-stone-400 max-w-sm mx-auto">
            You do not have any active outpatient consultations. You can apply for an OP slot from home right now.
          </p>
          <button
            onClick={() => setShowBookingModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Book New OPD Slot
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myAppointments.map((apt) => (
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
                {apt.hospital && <div><strong>Hospital:</strong> {apt.hospital}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Book Appointment Modal */}
      <HomeAppointmentModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
      />
    </div>
  );
};
