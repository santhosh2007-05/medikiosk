package com.medikiosk.api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "MediKiosk Spring Boot Clinical Backend");
        status.put("timestamp", System.currentTimeMillis());
        status.put("speechEngine", "Ready (ASR)");
        status.put("ocrEngine", "Ready (Tesseract/Wasm)");
        status.put("fhirSerializer", "Compliant R4");
        return ResponseEntity.ok(status);
    }
}
