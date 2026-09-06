package com.medikiosk.api.controller;

import com.medikiosk.api.model.PatientSessionEntity;
import com.medikiosk.api.repository.PatientSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/receptionist")
@CrossOrigin(origins = "*")
public class ReceptionistController {

    @Autowired
    private PatientSessionRepository patientSessionRepository;

    @GetMapping("/walkin-tokens")
    public ResponseEntity<List<PatientSessionEntity>> getWalkinTokens() {
        return ResponseEntity.ok(patientSessionRepository.findAll());
    }

    @PostMapping("/register-walkin")
    public ResponseEntity<?> registerWalkinPatient(@RequestBody Map<String, String> request) {
        String token = "OPD-" + (100 + new Random().nextInt(900));
        String name = request.getOrDefault("name", "Walk-in Patient");
        String age = request.getOrDefault("age", "30");
        String gender = request.getOrDefault("gender", "Male");
        String department = request.getOrDefault("department", "General Medicine OPD");
        String hospital = request.getOrDefault("hospital", "Rajiv Gandhi Government General Hospital, Chennai");

        PatientSessionEntity session = new PatientSessionEntity();
        session.setToken(token);
        session.setName(name);
        session.setAge(age);
        session.setGender(gender);
        session.setLanguage("ta-IN");
        session.setChiefComplaint("Offline walk-in registration at hospital counter (" + department + ")");
        session.setSummaryText("Patient registered offline at Reception Desk (" + hospital + "). Pending voice intake.");
        session.setSummaryStatus("kiosk-pending");

        PatientSessionEntity saved = patientSessionRepository.save(session);
        AdminController.incrementRegistrationCounter();

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("token", token);
        response.put("hospital", hospital);
        response.put("department", department);
        response.put("record", saved);

        return ResponseEntity.ok(response);
    }
}
