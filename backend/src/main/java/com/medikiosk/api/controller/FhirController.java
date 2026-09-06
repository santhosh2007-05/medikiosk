package com.medikiosk.api.controller;

import com.medikiosk.api.model.PatientSessionEntity;
import com.medikiosk.api.service.PatientSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/fhir")
public class FhirController {

    @Autowired
    private PatientSessionService sessionService;

    @GetMapping("/{token}")
    public ResponseEntity<String> getFhirBundle(@PathVariable String token) {
        Optional<PatientSessionEntity> opt = sessionService.getSessionByToken(token);
        if (opt.isPresent() && opt.get().getFhirBundleJson() != null) {
            return ResponseEntity.ok()
                    .header("Content-Type", "application/json")
                    .body(opt.get().getFhirBundleJson());
        }
        return ResponseEntity.notFound().build();
    }
}
