package com.medikiosk.api.repository;

import com.medikiosk.api.model.PatientSessionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientSessionRepository extends JpaRepository<PatientSessionEntity, Long> {
    Optional<PatientSessionEntity> findByToken(String token);
    List<PatientSessionEntity> findAllByOrderByRedFlagDescCreatedAtDesc();
}
