package com.medikiosk.api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class AppointmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String appointmentNumber;

    private String token;
    private String patientName;
    private String patientPhone;
    private String patientAge;
    private String patientGender;
    private String aadhaar;
    private String doctorName;
    private String department;
    private String hospitalName;
    private String appointmentDate;
    private String timeSlot;
    
    @Column(length = 2000)
    private String chiefComplaint;

    private String status = "Confirmed";
    private String appointmentType = "Home Booked OP";
    private LocalDateTime bookedAt = LocalDateTime.now();

    public AppointmentEntity() {}

    public AppointmentEntity(String appointmentNumber, String patientName, String patientPhone, String doctorName, String department, String hospitalName, String appointmentDate, String timeSlot) {
        this.appointmentNumber = appointmentNumber;
        this.patientName = patientName;
        this.patientPhone = patientPhone;
        this.doctorName = doctorName;
        this.department = department;
        this.hospitalName = hospitalName;
        this.appointmentDate = appointmentDate;
        this.timeSlot = timeSlot;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAppointmentNumber() { return appointmentNumber; }
    public void setAppointmentNumber(String appointmentNumber) { this.appointmentNumber = appointmentNumber; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getPatientPhone() { return patientPhone; }
    public void setPatientPhone(String patientPhone) { this.patientPhone = patientPhone; }

    public String getPatientAge() { return patientAge; }
    public void setPatientAge(String patientAge) { this.patientAge = patientAge; }

    public String getPatientGender() { return patientGender; }
    public void setPatientGender(String patientGender) { this.patientGender = patientGender; }

    public String getAadhaar() { return aadhaar; }
    public void setAadhaar(String aadhaar) { this.aadhaar = aadhaar; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }

    public String getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(String appointmentDate) { this.appointmentDate = appointmentDate; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getChiefComplaint() { return chiefComplaint; }
    public void setChiefComplaint(String chiefComplaint) { this.chiefComplaint = chiefComplaint; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getAppointmentType() { return appointmentType; }
    public void setAppointmentType(String appointmentType) { this.appointmentType = appointmentType; }

    public LocalDateTime getBookedAt() { return bookedAt; }
    public void setBookedAt(LocalDateTime bookedAt) { this.bookedAt = bookedAt; }
}
