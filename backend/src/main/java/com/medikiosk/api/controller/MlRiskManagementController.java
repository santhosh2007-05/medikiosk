package com.medikiosk.api.controller;

import com.medikiosk.api.model.MlRiskPredictionEntity;
import com.medikiosk.api.service.MlRiskManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/ml/risk")
@CrossOrigin(origins = "*")
public class MlRiskManagementController {

    @Autowired
    private MlRiskManagementService riskService;

    @PostMapping("/predict")
    public ResponseEntity<?> predictAndPersistRisk(@RequestBody Map<String, Object> patientData) {
        MlRiskPredictionEntity prediction = riskService.predictAndSaveRisk(patientData);
        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("service", "MediKiosk ML Risk Management Microservice (MySQL)");
        response.put("prediction", prediction);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history/{patientToken}")
    public ResponseEntity<?> getRiskHistory(@PathVariable String patientToken) {
        List<MlRiskPredictionEntity> history = riskService.getPatientRiskHistory(patientToken);
        Map<String, Object> response = new HashMap<>();
        response.put("status", "SUCCESS");
        response.put("patientToken", patientToken);
        response.put("history", history);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getRiskAnalytics() {
        return ResponseEntity.ok(riskService.getRiskAnalytics());
    }
}
