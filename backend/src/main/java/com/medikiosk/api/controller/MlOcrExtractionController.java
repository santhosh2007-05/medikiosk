package com.medikiosk.api.controller;

import com.medikiosk.api.model.MlOcrRecordEntity;
import com.medikiosk.api.service.MlOcrExtractionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/ml/ocr")
@CrossOrigin(origins = "*")
public class MlOcrExtractionController {

    @Autowired
    private MlOcrExtractionService ocrService;

    @PostMapping("/process")
    public ResponseEntity<?> processOcrDocument(@RequestBody Map<String, Object> ocrData) {
        MlOcrRecordEntity record = ocrService.processAndSaveOcrRecord(ocrData);
        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("service", "MediKiosk ML OCR Extraction Microservice (MySQL)");
        response.put("record", record);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/documents/{patientToken}")
    public ResponseEntity<?> getPatientDocuments(@PathVariable String patientToken) {
        List<MlOcrRecordEntity> docs = ocrService.getPatientDocuments(patientToken);
        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("patientToken", patientToken);
        response.put("documents", docs);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getOcrAnalytics() {
        return ResponseEntity.ok(ocrService.getOcrAnalytics());
    }
}
