package com.medikiosk.api.service;

import com.medikiosk.api.model.PatientSessionEntity;
import org.springframework.stereotype.Service;

@Service
public class FhirSerializationService {

    public String generateFhirBundleJson(PatientSessionEntity session) {
        String name = session.getName() != null ? session.getName() : "Unknown Patient";
        String gender = session.getGender() != null ? session.getGender().toLowerCase() : "unknown";
        String age = session.getAge() != null ? session.getAge() : "0";
        String token = session.getToken() != null ? session.getToken() : "OPD-000";
        String chiefComplaint = session.getChiefComplaint() != null ? session.getChiefComplaint() : "Intake consultation";

        return """
        {
          "resourceType": "Bundle",
          "id": "bundle-%s",
          "type": "collection",
          "entry": [
            {
              "fullUrl": "Patient/%s",
              "resource": {
                "resourceType": "Patient",
                "id": "%s",
                "identifier": [{ "system": "http://abdm.gov.in/abha", "value": "91-MOCK-SANDBOX" }],
                "name": [{ "text": "%s" }],
                "gender": "%s"
              }
            },
            {
              "fullUrl": "Condition/cond-%s",
              "resource": {
                "resourceType": "Condition",
                "id": "cond-%s",
                "clinicalStatus": { "coding": [{ "code": "active" }] },
                "verificationStatus": { "coding": [{ "code": "provisional" }] },
                "category": [{ "coding": [{ "code": "encounter-diagnosis" }] }],
                "code": { "text": "%s" },
                "subject": { "reference": "Patient/%s" }
              }
            }
          ]
        }
        """.formatted(token, token, token, name, gender, token, token, chiefComplaint, token);
    }
}
