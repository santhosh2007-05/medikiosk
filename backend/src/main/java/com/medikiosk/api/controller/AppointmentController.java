package com.medikiosk.api.controller;

import com.medikiosk.api.model.AppointmentEntity;
import com.medikiosk.api.model.PatientSessionEntity;
import com.medikiosk.api.repository.AppointmentRepository;
import com.medikiosk.api.repository.PatientSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientSessionRepository patientSessionRepository;

    @GetMapping
    public ResponseEntity<List<AppointmentEntity>> getAllAppointments() {
        return ResponseEntity.ok(appointmentRepository.findAll());
    }

    @PostMapping("/book")
    public ResponseEntity<Map<String, Object>> bookAppointment(@RequestBody AppointmentEntity appointment) {
        String token = appointment.getToken();
        if (token == null || token.trim().isEmpty()) {
            token = "OPD-" + (100 + new Random().nextInt(900));
            appointment.setToken(token);
        }

        if (appointment.getAppointmentNumber() == null || appointment.getAppointmentNumber().isEmpty()) {
            appointment.setAppointmentNumber("APT-" + (100 + new Random().nextInt(900)));
        }

        AppointmentEntity savedApt = appointmentRepository.save(appointment);

        // Synchronize automatically into patient_sessions table
        PatientSessionEntity session = patientSessionRepository.findByToken(token).orElse(new PatientSessionEntity());
        session.setToken(token);
        session.setName(appointment.getPatientName() != null ? appointment.getPatientName() : "Home OP Patient");
        session.setAge(appointment.getPatientAge() != null ? appointment.getPatientAge() : "32");
        session.setGender(appointment.getPatientGender() != null ? appointment.getPatientGender() : "Female");
        session.setPhone(appointment.getPatientPhone() != null ? appointment.getPatientPhone() : "9840123456");
        session.setAadhaar(appointment.getAadhaar() != null ? appointment.getAadhaar() : "91-8821-4491-0021");
        session.setHospital(appointment.getHospitalName() != null ? appointment.getHospitalName() : "Rajiv Gandhi Government General Hospital, Chennai");
        session.setDepartment(appointment.getDepartment() != null ? appointment.getDepartment() : "General Medicine OPD");
        session.setTime(appointment.getTimeSlot() != null ? appointment.getTimeSlot() : "10:30 AM");
        session.setChiefComplaint(appointment.getChiefComplaint() != null ? appointment.getChiefComplaint() : "Online OP Appointment booked from Home");
        session.setSummaryText("Online Home-Booked OP Appointment (" + appointment.getAppointmentNumber() + ") for " +
                session.getHospital() + " [" + session.getDepartment() + "]. Time Slot: " + session.getTime() +
                ". Chief Complaint: " + session.getChiefComplaint());
        session.setStatus("Upcoming - Home Booked");
        session.setSummaryStatus("home-booked");

        patientSessionRepository.save(session);
        AdminController.incrementRegistrationCounter();

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("appointment", savedApt);
        response.put("sessionToken", token);
        response.put("message", "Home OP Appointment successfully confirmed and synchronized to Hospital Doctor & Nurse Workstation.");

        return ResponseEntity.ok(response);
    }
}
