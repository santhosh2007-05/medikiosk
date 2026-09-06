package com.medikiosk.api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "patient_profiles")
public class PatientProfileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String abhaId;

    private String aadhaarNumber;
    private String mobileNumber;
    private String fullName;
    private Integer age;
    private String gender;
    private String state = "Tamil Nadu";
    private String district;
    private String taluk;
    private String hospitalName;
    private LocalDateTime createdAt = LocalDateTime.now();

    public PatientProfileEntity() {}

    public PatientProfileEntity(String abhaId, String aadhaarNumber, String mobileNumber, String fullName, Integer age, String gender, String district, String taluk, String hospitalName) {
        this.abhaId = abhaId;
        this.aadhaarNumber = aadhaarNumber;
        this.mobileNumber = mobileNumber;
        this.fullName = fullName;
        this.age = age;
        this.gender = gender;
        this.district = district;
        this.taluk = taluk;
        this.hospitalName = hospitalName;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAbhaId() { return abhaId; }
    public void setAbhaId(String abhaId) { this.abhaId = abhaId; }

    public String getAadhaarNumber() { return aadhaarNumber; }
    public void setAadhaarNumber(String aadhaarNumber) { this.aadhaarNumber = aadhaarNumber; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }

    public String getTaluk() { return taluk; }
    public void setTaluk(String taluk) { this.taluk = taluk; }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
