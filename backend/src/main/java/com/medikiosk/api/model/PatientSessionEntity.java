package com.medikiosk.api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "patient_sessions")
public class PatientSessionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String token;

    private String name;
    private String age;
    private String gender;
    private String phone;
    private String aadhaar;
    private String hospital;
    private String department;
    private String time;
    private String diagnosis;
    private String status = "In Queue";
    private String language = "en-IN";
    private Boolean ayushMode = false;
    private Boolean consentGiven = false;

    @Column(length = 2000)
    private String chiefComplaint;

    // Vitals
    private String sysBp = "120";
    private String diaBp = "80";
    private String heartRate = "72";
    private String spo2 = "98%";
    private String temp = "98.6°F";

    // SOCRATES Parameters
    private String site;
    private String onset;
    private String character;
    private String radiation;
    private String associated;
    private String timing;
    private String exacerbating;
    private String severity;

    // AYUSH Parameters
    private String prakriti = "Pitta-Kapha";
    private String agni = "Sama Agni";
    private String koshtha = "Madhyama";
    private String sleep;
    private String exercise;

    private Boolean redFlag = false;
    private String redFlagTriggers; // comma-separated

    @Column(columnDefinition = "TEXT")
    private String summaryText;

    private String summaryStatus = "draft"; // draft | doctor-edited | confirmed | rejected

    @Column(columnDefinition = "TEXT")
    private String fhirBundleJson;

    @Column(columnDefinition = "TEXT")
    private String rawTranscriptJson;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    public PatientSessionEntity() {}

    // Convenience Getters for Frontend JSON mapping
    public Map<String, String> getVitals() {
        Map<String, String> v = new HashMap<>();
        v.put("sysBp", sysBp != null ? sysBp : "120");
        v.put("diaBp", diaBp != null ? diaBp : "80");
        v.put("heartRate", heartRate != null ? heartRate : "72");
        v.put("spo2", spo2 != null ? spo2 : "98%");
        v.put("temp", temp != null ? temp : "98.6°F");
        return v;
    }

    public Map<String, String> getAyushParameters() {
        Map<String, String> a = new HashMap<>();
        a.put("prakriti", prakriti != null ? prakriti : "Pitta-Kapha");
        a.put("agni", agni != null ? agni : "Sama Agni");
        a.put("koshtha", koshtha != null ? koshtha : "Madhyama");
        return a;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAge() { return age; }
    public void setAge(String age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAadhaar() { return aadhaar; }
    public void setAadhaar(String aadhaar) { this.aadhaar = aadhaar; }

    public String getHospital() { return hospital; }
    public void setHospital(String hospital) { this.hospital = hospital; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public Boolean getAyushMode() { return ayushMode; }
    public void setAyushMode(Boolean ayushMode) { this.ayushMode = ayushMode; }

    public Boolean getConsentGiven() { return consentGiven; }
    public void setConsentGiven(Boolean consentGiven) { this.consentGiven = consentGiven; }

    public String getChiefComplaint() { return chiefComplaint; }
    public void setChiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; }

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

    public String getSite() { return site; }
    public void setSite(String site) { this.site = site; }

    public String getOnset() { return onset; }
    public void setOnset(String onset) { this.onset = onset; }

    public String getCharacter() { return character; }
    public void setCharacter(String character) { this.character = character; }

    public String getRadiation() { return radiation; }
    public void setRadiation(String radiation) { this.radiation = radiation; }

    public String getAssociated() { return associated; }
    public void setAssociated(String associated) { this.associated = associated; }

    public String getTiming() { return timing; }
    public void setTiming(String timing) { this.timing = timing; }

    public String getExacerbating() { return exacerbating; }
    public void setExacerbating(String exacerbating) { this.exacerbating = exacerbating; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getPrakriti() { return prakriti; }
    public void setPrakriti(String prakriti) { this.prakriti = prakriti; }

    public String getAgni() { return agni; }
    public void setAgni(String agni) { this.agni = agni; }

    public String getKoshtha() { return koshtha; }
    public void setKoshtha(String koshtha) { this.koshtha = koshtha; }

    public String getSleep() { return sleep; }
    public void setSleep(String sleep) { this.sleep = sleep; }

    public String getExercise() { return exercise; }
    public void setExercise(String exercise) { this.exercise = exercise; }

    public Boolean getRedFlag() { return redFlag; }
    public void setRedFlag(Boolean redFlag) { this.redFlag = redFlag; }

    public String getRedFlagTriggers() { return redFlagTriggers; }
    public void setRedFlagTriggers(String redFlagTriggers) { this.redFlagTriggers = redFlagTriggers; }

    public String getSummaryText() { return summaryText; }
    public void setSummaryText(String summaryText) { this.summaryText = summaryText; }

    public String getSummaryStatus() { return summaryStatus; }
    public void setSummaryStatus(String summaryStatus) { this.summaryStatus = summaryStatus; }

    public String getFhirBundleJson() { return fhirBundleJson; }
    public void setFhirBundleJson(String fhirBundleJson) { this.fhirBundleJson = fhirBundleJson; }

    public String getRawTranscriptJson() { return rawTranscriptJson; }
    public void setRawTranscriptJson(String rawTranscriptJson) { this.rawTranscriptJson = rawTranscriptJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
