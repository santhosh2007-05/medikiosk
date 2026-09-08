package com.medikiosk.api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "medical_documents")
public class MedicalDocumentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;
    private String documentType; // Prescription | Lab Report | Discharge Summary
    private String documentDate;

    @Column(columnDefinition = "TEXT")
    private String rawOcrText;

    @Column(columnDefinition = "TEXT")
    private String extractedDataJson;

    private LocalDateTime uploadedAt = LocalDateTime.now();

    public MedicalDocumentEntity() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }

    public String getDocumentDate() { return documentDate; }
    public void setDocumentDate(String documentDate) { this.documentDate = documentDate; }

    public String getRawOcrText() { return rawOcrText; }
    public void setRawOcrText(String rawOcrText) { this.rawOcrText = rawOcrText; }

    public String getExtractedDataJson() { return extractedDataJson; }
    public void setExtractedDataJson(String extractedDataJson) { this.extractedDataJson = extractedDataJson; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
