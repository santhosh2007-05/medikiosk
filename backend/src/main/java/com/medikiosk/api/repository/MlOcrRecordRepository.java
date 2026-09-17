package com.medikiosk.api.repository;

import com.medikiosk.api.model.MlOcrRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MlOcrRecordRepository extends JpaRepository<MlOcrRecordEntity, Long> {
    List<MlOcrRecordEntity> findByPatientTokenOrderByCreatedAtDesc(String patientToken);
    List<MlOcrRecordEntity> findByDocumentType(String documentType);
    long countByIsMedicalDocument(Boolean isMedicalDocument);
}
