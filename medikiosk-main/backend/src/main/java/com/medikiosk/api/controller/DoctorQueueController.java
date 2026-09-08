package com.medikiosk.api.controller;

import com.medikiosk.api.model.PatientSessionEntity;
import com.medikiosk.api.service.PatientSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctor")
@CrossOrigin(origins = "*")
public class DoctorQueueController {

    @Autowired
    private PatientSessionService sessionService;

    @GetMapping("/queue")
    public ResponseEntity<List<PatientSessionEntity>> getQueue() {
        return ResponseEntity.ok(sessionService.getDoctorQueue());
    }

    @PostMapping("/patient/{token}/accept")
    public ResponseEntity<PatientSessionEntity> acceptSummary(@PathVariable String token) {
        Optional<PatientSessionEntity> res = sessionService.updateSummaryStatus(token, "confirmed", null);
        return res.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/patient/{token}/edit")
    public ResponseEntity<PatientSessionEntity> editSummary(@PathVariable String token, @RequestBody Map<String, String> body) {
        String editedText = body.get("summaryText");
        Optional<PatientSessionEntity> res = sessionService.updateSummaryStatus(token, "doctor-edited", editedText);
        return res.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/patient/{token}/reject")
    public ResponseEntity<PatientSessionEntity> rejectSummary(@PathVariable String token) {
        Optional<PatientSessionEntity> res = sessionService.updateSummaryStatus(token, "rejected", null);
        return res.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/register-op")
    public ResponseEntity<?> registerDoctorOp(@RequestBody Map<String, String> request) {
        String token = "OPD-" + (100 + new java.util.Random().nextInt(900));
        String name = request.getOrDefault("name", "Doctor Registered Patient");
        String age = request.getOrDefault("age", "35");
        String gender = request.getOrDefault("gender", "Male");
        String department = request.getOrDefault("department", "General Medicine OPD");
        String hospital = request.getOrDefault("hospital", "Rajiv Gandhi Government General Hospital, Chennai");

        PatientSessionEntity session = new PatientSessionEntity();
        session.setToken(token);
        session.setName(name);
        session.setAge(age);
        session.setGender(gender);
        session.setLanguage("en-IN");
        session.setChiefComplaint("Doctor Station OPD Direct Registration");
        session.setSummaryText("Registered directly by Doctor at OPD Workstation (" + hospital + "). Pending consultation.");
        session.setSummaryStatus("doctor-registered");

        PatientSessionEntity saved = sessionService.createOrUpdateSession(session);
        AdminController.incrementRegistrationCounter();

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("status", "SUCCESS");
        response.put("token", token);
        response.put("record", saved);
        return ResponseEntity.ok(response);
    }
}
