package com.medikiosk.api.repository;

import com.medikiosk.api.model.MlRiskPredictionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MlRiskPredictionRepository extends JpaRepository<MlRiskPredictionEntity, Long> {
    List<MlRiskPredictionEntity> findByPatientTokenOrderByCreatedAtDesc(String patientToken);
    List<MlRiskPredictionEntity> findByRiskLevel(String riskLevel);
    Optional<MlRiskPredictionEntity> findFirstByPatientTokenOrderByCreatedAtDesc(String patientToken);
    long countByRiskLevel(String riskLevel);
}
