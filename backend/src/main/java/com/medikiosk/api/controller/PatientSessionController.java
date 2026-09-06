package com.medikiosk.api.controller;

import com.medikiosk.api.model.PatientSessionEntity;
import com.medikiosk.api.service.PatientSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*")
public class PatientSessionController {

    @Autowired
    private PatientSessionService sessionService;

    @GetMapping("/all")
    public ResponseEntity<List<PatientSessionEntity>> getAllSessions() {
        return ResponseEntity.ok(sessionService.getDoctorQueue());
    }

    @PostMapping
    public ResponseEntity<PatientSessionEntity> createOrSaveSession(@RequestBody PatientSessionEntity session) {
        boolean isNew = (session.getId() == null);
        PatientSessionEntity saved = sessionService.createOrUpdateSession(session);
        if (isNew) {
            AdminController.incrementRegistrationCounter();
        }
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{token}")
    public ResponseEntity<PatientSessionEntity> getSession(@PathVariable String token) {
        Optional<PatientSessionEntity> session = sessionService.getSessionByToken(token);
        return session.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
