package com.medikiosk.api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "consent_otp_sessions")
public class ConsentOtpSessionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String patientToken;

    private String patientPhone;
    private String doctorName;

    @Column(nullable = false, length = 100)
    private String otpHash; // BCrypt hash

    private String plainOtp; // Preserved for Patient Portal Live SMS/ABHA popup simulation

    private String status = "PENDING"; // PENDING, VERIFIED, EXPIRED

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime verifiedAt;
    private LocalDateTime accessExpiresAt;

    public ConsentOtpSessionEntity() {}

    public ConsentOtpSessionEntity(String patientToken, String patientPhone, String doctorName, String otpHash, String plainOtp) {
        this.patientToken = patientToken;
        this.patientPhone = patientPhone;
        this.doctorName = doctorName;
        this.otpHash = otpHash;
        this.plainOtp = plainOtp;
        this.status = "PENDING";
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPatientToken() { return patientToken; }
    public void setPatientToken(String patientToken) { this.patientToken = patientToken; }

    public String getPatientPhone() { return patientPhone; }
    public void setPatientPhone(String patientPhone) { this.patientPhone = patientPhone; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getOtpHash() { return otpHash; }
    public void setOtpHash(String otpHash) { this.otpHash = otpHash; }

    public String getPlainOtp() { return plainOtp; }
    public void setPlainOtp(String plainOtp) { this.plainOtp = plainOtp; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(LocalDateTime verifiedAt) { this.verifiedAt = verifiedAt; }

    public LocalDateTime getAccessExpiresAt() { return accessExpiresAt; }
    public void setAccessExpiresAt(LocalDateTime accessExpiresAt) { this.accessExpiresAt = accessExpiresAt; }
}
