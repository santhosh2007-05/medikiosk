package com.medikiosk.api.repository;

import com.medikiosk.api.model.ConsentOtpSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConsentOtpSessionRepository extends JpaRepository<ConsentOtpSessionEntity, Long> {
    Optional<ConsentOtpSessionEntity> findTopByPatientTokenOrderByCreatedAtDesc(String patientToken);
    Optional<ConsentOtpSessionEntity> findTopByPatientPhoneOrderByCreatedAtDesc(String patientPhone);
    List<ConsentOtpSessionEntity> findByPatientToken(String patientToken);
}
