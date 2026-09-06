package com.medikiosk.api.repository;

import com.medikiosk.api.model.PatientProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientProfileRepository extends JpaRepository<PatientProfileEntity, Long> {
    Optional<PatientProfileEntity> findByAbhaId(String abhaId);
    Optional<PatientProfileEntity> findByAadhaarNumber(String aadhaarNumber);
    Optional<PatientProfileEntity> findByMobileNumber(String mobileNumber);
}
