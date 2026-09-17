package com.medikiosk.api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ml_risk_predictions")
public class MlRiskPredictionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_token", nullable = false, length = 64)
    private String patientToken;

    @Column(name = "patient_name", length = 128)
    private String patientName;

    @Column(name = "chief_complaint", length = 1024)
    private String chiefComplaint;

    @Column(name = "hpi_details", columnDefinition = "TEXT")
    private String hpiDetails;

    @Column(name = "sys_bp", length = 16)
    private String sysBp;

    @Column(name = "dia_bp", length = 16)
    private String diaBp;

    @Column(name = "heart_rate", length = 16)
    private String heartRate;

    @Column(name = "spo2", length = 16)
    private String spo2;

    @Column(name = "temp", length = 16)
    private String temp;

    @Column(name = "risk_level", nullable = false, length = 32)
    private String riskLevel; // HIGH, MODERATE, LOW

    @Column(name = "risk_score")
    private Integer riskScore; // 0 - 100

    @Column(name = "risk_title", length = 256)
    private String riskTitle;

    @Column(name = "risk_reason", columnDefinition = "TEXT")
    private String riskReason;

    @Column(name = "triage_priority", length = 64)
    private String triagePriority; // Immediate (P1), Urgent (P2), Standard (P3)

    @Column(name = "recommendations", columnDefinition = "TEXT")
    private String recommendations;

    @Column(name = "ml_engine", length = 128)
    private String mlEngine; // Groq LLaMA-3.3 70B / NEWS-2 Hybrid

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    public MlRiskPredictionEntity() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPatientToken() { return patientToken; }
    public void setPatientToken(String patientToken) { this.patientToken = patientToken; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getChiefComplaint() { return chiefComplaint; }
    public void setChiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; }

    public String getHpiDetails() { return hpiDetails; }
    public void setHpiDetails(String hpiDetails) { this.hpiDetails = hpiDetails; }

    public String getSysBp() { return sysBp; }
    public void setSysBp(String sysBp) { this.sysBp = sysBp; }

    public String getDiaBp() { return diaBp; }
    public void setDiaBp(String diaBp) { this.diaBp = diaBp; }

    public String getHeartRate() { return heartRate; }
    public void setHeartRate(String heartRate) { this.heartRate = heartRate; }

    public String getSpo2() { return spo2; }
    public void setSpo2(String spo2) { this.spo2 = spo2; }

    public String getTemp() { return temp; }
    public void setTemp(String temp) { this.temp = temp; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }

    public String getRiskTitle() { return riskTitle; }
    public void setRiskTitle(String riskTitle) { this.riskTitle = riskTitle; }

    public String getRiskReason() { return riskReason; }
    public void setRiskReason(String riskReason) { this.riskReason = riskReason; }

    public String getTriagePriority() { return triagePriority; }
    public void setTriagePriority(String triagePriority) { this.triagePriority = triagePriority; }

    public String getRecommendations() { return recommendations; }
    public void setRecommendations(String recommendations) { this.recommendations = recommendations; }

    public String getMlEngine() { return mlEngine; }
    public void setMlEngine(String mlEngine) { this.mlEngine = mlEngine; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
