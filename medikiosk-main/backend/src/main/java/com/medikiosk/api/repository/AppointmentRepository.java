package com.medikiosk.api.repository;

import com.medikiosk.api.model.AppointmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentEntity, Long> {
    List<AppointmentEntity> findByPatientPhone(String patientPhone);
    List<AppointmentEntity> findByDoctorName(String doctorName);
}
