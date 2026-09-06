package com.medikiosk.api.repository;

import com.medikiosk.api.model.MedicalDocumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalDocumentRepository extends JpaRepository<MedicalDocumentEntity, Long> {
    List<MedicalDocumentEntity> findByToken(String token);
}
