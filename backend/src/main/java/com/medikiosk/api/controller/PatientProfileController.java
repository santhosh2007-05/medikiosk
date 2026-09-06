package com.medikiosk.api.controller;

import com.medikiosk.api.model.PatientProfileEntity;
import com.medikiosk.api.repository.PatientProfileRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "*")
public class PatientProfileController {

    @Autowired
    private PatientProfileRepository patientProfileRepository;



    @GetMapping
    public ResponseEntity<List<PatientProfileEntity>> getAllPatients() {
        return ResponseEntity.ok(patientProfileRepository.findAll());
    }

    @GetMapping("/profile/{abhaId}")
    public ResponseEntity<?> getProfileByAbhaId(@PathVariable String abhaId) {
        Optional<PatientProfileEntity> profile = patientProfileRepository.findByAbhaId(abhaId);
        if (profile.isPresent()) {
            return ResponseEntity.ok(profile.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendSmsOtp(@RequestBody Map<String, String> request) {
        String identifier = request.get("identifier"); // Aadhaar or Mobile
        String demoOtp = "582491";

        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("message", "SMS OTP dispatched to registered mobile number for " + identifier);
        response.put("demoOtp", demoOtp);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifySmsOtp(@RequestBody Map<String, String> request) {
        String identifier = request.get("identifier");
        String otp = request.get("otp");

        // Verify or create demo profile
        String abhaId = "91-" + (1000 + new Random().nextInt(9000)) + "-1092-4412";
        PatientProfileEntity profile = patientProfileRepository.findByAadhaarNumber(identifier)
                .orElseGet(() -> patientProfileRepository.findByMobileNumber(identifier)
                .orElseGet(() -> {
                    PatientProfileEntity newP = new PatientProfileEntity(
                            abhaId, identifier, identifier, "JOSEPH VIJAY", 28, "Male", "Chennai", "Egmore", "Rajiv Gandhi Government General Hospital, Chennai"
                    );
                    return patientProfileRepository.save(newP);
                }));

        Map<String, Object> response = new HashMap<>();
        response.put("status", "AUTHENTICATED");
        response.put("profile", profile);
        response.put("jwtToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.medikiosk.session");

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerPatient(@RequestBody PatientProfileEntity patientProfile) {
        if (patientProfile.getAbhaId() == null || patientProfile.getAbhaId().isEmpty()) {
            String generatedAbha = "91-" + (1000 + new Random().nextInt(9000)) + "-" + (1000 + new Random().nextInt(9000)) + "-4412";
            patientProfile.setAbhaId(generatedAbha);
        }
        PatientProfileEntity saved = patientProfileRepository.save(patientProfile);
        return ResponseEntity.ok(saved);
    }
}
