package com.medikiosk.api.service;

import com.medikiosk.api.model.PatientSessionEntity;
import org.springframework.stereotype.Service;

@Service
public class ClinicalSummaryService {

    public String generateSummaryText(PatientSessionEntity session) {
        StringBuilder sb = new StringBuilder();

        sb.append("1. CHIEF COMPLAINT:\n");
        sb.append(session.getChiefComplaint() != null ? session.getChiefComplaint() : "Not reported").append("\n\n");

        sb.append("2. HISTORY OF PRESENT ILLNESS (HPI - SOCRATES):\n");
        sb.append("Site: ").append(session.getSite() != null ? session.getSite() : "Not reported").append("\n");
        sb.append("Onset: ").append(session.getOnset() != null ? session.getOnset() : "Not reported").append("\n");
        sb.append("Character: ").append(session.getCharacter() != null ? session.getCharacter() : "Not reported").append("\n");
        sb.append("Radiation: ").append(session.getRadiation() != null ? session.getRadiation() : "Not reported").append("\n");
        sb.append("Associated Symptoms: ").append(session.getAssociated() != null ? session.getAssociated() : "Not reported").append("\n");
        sb.append("Severity: ").append(session.getSeverity() != null ? session.getSeverity() : "Not reported").append("\n\n");

        if (Boolean.TRUE.equals(session.getAyushMode())) {
            sb.append("🌿 DASHAVIDHA PARIKSHA (AYUSH ASSESSMENT):\n");
            sb.append("Prakriti: ").append(session.getPrakriti() != null ? session.getPrakriti() : "Not reported").append("\n");
            sb.append("Agni: ").append(session.getAgni() != null ? session.getAgni() : "Not reported").append("\n");
            sb.append("Koshtha: ").append(session.getKoshtha() != null ? session.getKoshtha() : "Not reported").append("\n");
            sb.append("Sleep: ").append(session.getSleep() != null ? session.getSleep() : "Not reported").append("\n\n");
        }

        sb.append("3. PAST MEDICAL HISTORY:\nNot reported\n\n");
        sb.append("4. DRUG & ALLERGY HISTORY:\nNot reported\n\n");
        sb.append("5. FAMILY HISTORY:\nNot reported\n\n");
        sb.append("6. PERSONAL HISTORY:\nNot reported\n\n");
        sb.append("7. PRIOR INVESTIGATIONS SUMMARY:\nSee attached document timeline.");

        return sb.toString();
    }
}
