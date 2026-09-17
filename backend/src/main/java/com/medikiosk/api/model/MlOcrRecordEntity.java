package com.medikiosk.api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ml_ocr_records")
public class MlOcrRecordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_token", nullable = false, length = 64)
    private String patientToken;

    @Column(name = "file_name", length = 256)
    private String fileName;

    @Column(name = "document_type", length = 64)
    private String documentType; // Prescription, Lab Report, AYUSH Report

    @Column(name = "raw_ocr_text", columnDefinition = "LONGTEXT")
    private String rawOcrText;

    @Column(name = "extracted_summary", columnDefinition = "LONGTEXT")
    private String extractedSummary;

    @Column(name = "is_medical_document")
    private Boolean isMedicalDocument;

    @Column(name = "confidence_score")
    private Integer confidenceScore;

    @Column(name = "flagged_abnormalities", columnDefinition = "TEXT")
    private String flaggedAbnormalities;

    @Column(name = "prescribed_medications", columnDefinition = "TEXT")
    private String prescribedMedications;

    @Column(name = "api_engine", length = 128)
    private String apiEngine; // Tesseract.js + Groq LLaMA-3.3 70B

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    public MlOcrRecordEntity() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPatientToken() { return patientToken; }
    public void setPatientToken(String patientToken) { this.patientToken = patientToken; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }

    public String getRawOcrText() { return rawOcrText; }
    public void setRawOcrText(String rawOcrText) { this.rawOcrText = rawOcrText; }

    public String getExtractedSummary() { return extractedSummary; }
    public void setExtractedSummary(String extractedSummary) { this.extractedSummary = extractedSummary; }

    public Boolean getIsMedicalDocument() { return isMedicalDocument; }
    public void setIsMedicalDocument(Boolean isMedicalDocument) { this.isMedicalDocument = isMedicalDocument; }

    public Integer getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(Integer confidenceScore) { this.confidenceScore = confidenceScore; }

    public String getFlaggedAbnormalities() { return flaggedAbnormalities; }
    public void setFlaggedAbnormalities(String flaggedAbnormalities) { this.flaggedAbnormalities = flaggedAbnormalities; }

    public String getPrescribedMedications() { return prescribedMedications; }
    public void setPrescribedMedications(String prescribedMedications) { this.prescribedMedications = prescribedMedications; }

    public String getApiEngine() { return apiEngine; }
    public void setApiEngine(String apiEngine) { this.apiEngine = apiEngine; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
