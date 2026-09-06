package com.medikiosk.api.controller;

import com.medikiosk.api.model.MedicalDocumentEntity;
import com.medikiosk.api.repository.MedicalDocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private MedicalDocumentRepository documentRepository;

    @PostMapping("/upload")
    public ResponseEntity<MedicalDocumentEntity> uploadDocument(
            @RequestParam("token") String token,
            @RequestParam("documentType") String documentType,
            @RequestParam(value = "file", required = false) MultipartFile file
    ) {
        MedicalDocumentEntity doc = new MedicalDocumentEntity();
        doc.setToken(token);
        doc.setDocumentType(documentType);
        doc.setDocumentDate(java.time.LocalDate.now().toString());

        // Simulated OCR extraction based on document type
        if ("Lab Report".equalsIgnoreCase(documentType)) {
            doc.setRawOcrText("LAB REPORT - CENTRAL DIAGNOSTICS\nPatient: Ramesh Chandra\nHemoglobin: 11.2 g/dL (Low)\nFBS: 126 mg/dL (Elevated)\nWBC: 7800 /uL");
            doc.setExtractedDataJson("{\"diagnosis\":\"Anemia suspect / Impaired FBS\",\"medicines\":[],\"labValues\":[{\"name\":\"Hemoglobin\",\"value\":\"11.2\",\"unit\":\"g/dL\",\"isAbnormal\":true},{\"name\":\"Fasting Blood Sugar\",\"value\":\"126\",\"unit\":\"mg/dL\",\"isAbnormal\":true}]}");
        } else if ("Prescription".equalsIgnoreCase(documentType)) {
            doc.setRawOcrText("PRESCRIPTION - OPD CLINIC\nRx:\n1. Amlodipine 5mg OD x 30 days\n2. Metformin 500mg BD post meals");
            doc.setExtractedDataJson("{\"diagnosis\":\"Hypertension / T2DM\",\"medicines\":[{\"name\":\"Amlodipine\",\"dose\":\"5mg\",\"freq\":\"Once daily\"},{\"name\":\"Metformin\",\"dose\":\"500mg\",\"freq\":\"Twice daily\"}],\"labValues\":[]}");
        } else {
            doc.setRawOcrText("DISCHARGE SUMMARY\nDiagnosis: Acute Gastritis\nAdvise: Light diet, Tab Pantoprazole 40mg.");
            doc.setExtractedDataJson("{\"diagnosis\":\"Acute Gastritis\",\"medicines\":[{\"name\":\"Pantoprazole\",\"dose\":\"40mg\",\"freq\":\"Once daily\"}],\"labValues\":[]}");
        }

        MedicalDocumentEntity saved = documentRepository.save(doc);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{token}")
    public ResponseEntity<List<MedicalDocumentEntity>> getDocuments(@PathVariable String token) {
        return ResponseEntity.ok(documentRepository.findByToken(token));
    }
}
