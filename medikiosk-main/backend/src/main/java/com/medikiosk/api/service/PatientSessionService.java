package com.medikiosk.api.service;

import com.medikiosk.api.model.PatientSessionEntity;
import com.medikiosk.api.repository.PatientSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PatientSessionService {

    @Autowired
    private PatientSessionRepository repository;

    @Autowired
    private RedFlagEvaluationService redFlagService;

    @Autowired
    private ClinicalSummaryService summaryService;

    @Autowired
    private FhirSerializationService fhirService;

    public PatientSessionEntity createOrUpdateSession(PatientSessionEntity session) {
        if (session.getToken() == null || session.getToken().isEmpty()) {
            session.setToken("OPD-" + (int)(100 + Math.random() * 900));
        }

        // Evaluate Red Flag
        RedFlagEvaluationService.RedFlagResult redFlagRes = redFlagService.evaluate(
                session.getChiefComplaint(),
                session.getAssociated(),
                session.getSeverity()
        );
        session.setRedFlag(redFlagRes.isRedFlag);
        session.setRedFlagTriggers(String.join(", ", redFlagRes.triggers));

        // Generate Clinical Summary if not edited by doctor
        if (!"doctor-edited".equals(session.getSummaryStatus())) {
            String summary = summaryService.generateSummaryText(session);
            session.setSummaryText(summary);
        }

        // Generate FHIR Bundle
        String fhirJson = fhirService.generateFhirBundleJson(session);
        session.setFhirBundleJson(fhirJson);

        session.setUpdatedAt(LocalDateTime.now());
        return repository.save(session);
    }

    public Optional<PatientSessionEntity> getSessionByToken(String token) {
        return repository.findByToken(token);
    }

    public List<PatientSessionEntity> getDoctorQueue() {
        return repository.findAllByOrderByRedFlagDescCreatedAtDesc();
    }

    public Optional<PatientSessionEntity> updateSummaryStatus(String token, String status, String editedSummaryText) {
        Optional<PatientSessionEntity> opt = repository.findByToken(token);
        if (opt.isPresent()) {
            PatientSessionEntity session = opt.get();
            session.setSummaryStatus(status);
            if (editedSummaryText != null && !editedSummaryText.isEmpty()) {
                session.setSummaryText(editedSummaryText);
            }
            session.setUpdatedAt(LocalDateTime.now());
            return Optional.of(repository.save(session));
        }
        return Optional.empty();
    }
}
