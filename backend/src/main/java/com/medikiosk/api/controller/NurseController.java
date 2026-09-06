package com.medikiosk.api.controller;

import com.medikiosk.api.model.PatientSessionEntity;
import com.medikiosk.api.repository.PatientSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/nurse")
@CrossOrigin(origins = "*")
public class NurseController {

    @Autowired
    private PatientSessionRepository patientSessionRepository;

    @GetMapping("/triage-queue")
    public ResponseEntity<List<PatientSessionEntity>> getTriageQueue() {
        return ResponseEntity.ok(patientSessionRepository.findAll());
    }

    @PostMapping("/record-vitals/{token}")
    public ResponseEntity<?> recordVitals(@PathVariable String token, @RequestBody Map<String, String> vitals) {
        Optional<PatientSessionEntity> optSession = patientSessionRepository.findByToken(token);
        if (optSession.isPresent()) {
            PatientSessionEntity session = optSession.get();
            String sysBp = vitals.getOrDefault("sysBp", "120");
            String diaBp = vitals.getOrDefault("diaBp", "80");
            String heartRate = vitals.getOrDefault("heartRate", "72");
            String spo2 = vitals.getOrDefault("spo2", "98");
            String temp = vitals.getOrDefault("temp", "98.6");

            String updatedSummary = session.getSummaryText() +
                    "\n\n[NURSE TRIAGE VITALS]: BP: " + sysBp + "/" + diaBp +
                    " mmHg, HR: " + heartRate + " bpm, SpO2: " + spo2 + "%, Temp: " + temp + "°F.";

            session.setSummaryText(updatedSummary);
            session.setSummaryStatus("nurse-triaged");
            patientSessionRepository.save(session);

            Map<String, Object> response = new HashMap<>();
            response.put("status", "SUCCESS");
            response.put("token", token);
            response.put("session", session);
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.notFound().build();
    }

    @PostMapping("/register-op")
    public ResponseEntity<?> registerNurseOp(@RequestBody Map<String, String> request) {
        String token = "OPD-" + (100 + new Random().nextInt(900));
        String name = request.getOrDefault("name", "Nurse Registered Patient");
        String age = request.getOrDefault("age", "30");
        String gender = request.getOrDefault("gender", "Female");
        String department = request.getOrDefault("department", "General Nursing & Triage");
        String hospital = request.getOrDefault("hospital", "Rajiv Gandhi Government General Hospital, Chennai");

        PatientSessionEntity session = new PatientSessionEntity();
        session.setToken(token);
        session.setName(name);
        session.setAge(age);
        session.setGender(gender);
        session.setLanguage("en-IN");
        session.setChiefComplaint("Nurse Triage Station Direct Registration");
        session.setSummaryText("Registered directly by Nurse at Triage Station (" + hospital + "). Pending vitals & doctor queue.");
        session.setSummaryStatus("nurse-triaged");

        PatientSessionEntity saved = patientSessionRepository.save(session);
        AdminController.incrementRegistrationCounter();

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("token", token);
        response.put("record", saved);
        return ResponseEntity.ok(response);
    }
}
