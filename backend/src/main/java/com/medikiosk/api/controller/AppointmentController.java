package com.medikiosk.api.controller;

import com.medikiosk.api.model.AppointmentEntity;
import com.medikiosk.api.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @GetMapping
    public ResponseEntity<List<AppointmentEntity>> getAllAppointments() {
        return ResponseEntity.ok(appointmentRepository.findAll());
    }

    @PostMapping("/book")
    public ResponseEntity<AppointmentEntity> bookAppointment(@RequestBody AppointmentEntity appointment) {
        if (appointment.getAppointmentNumber() == null || appointment.getAppointmentNumber().isEmpty()) {
            appointment.setAppointmentNumber("APT-" + (100 + new Random().nextInt(900)));
        }
        AppointmentEntity saved = appointmentRepository.save(appointment);
        return ResponseEntity.ok(saved);
    }
}
