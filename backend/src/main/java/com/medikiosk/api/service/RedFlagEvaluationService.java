package com.medikiosk.api.service;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class RedFlagEvaluationService {

    public static class RedFlagResult {
        public boolean isRedFlag;
        public List<String> triggers = new ArrayList<>();
    }

    public RedFlagResult evaluate(String chiefComplaint, String associatedSymptoms, String severity) {
        RedFlagResult result = new RedFlagResult();
        String ccLower = chiefComplaint != null ? chiefComplaint.toLowerCase() : "";
        String assocLower = associatedSymptoms != null ? associatedSymptoms.toLowerCase() : "";
        String sevLower = severity != null ? severity.toLowerCase() : "";

        if (ccLower.contains("chest pain") || ccLower.contains("pressure")) {
            result.triggers.add("Chest Pain");
        }
        if (assocLower.contains("shortness of breath") || assocLower.contains("breathlessness") || assocLower.contains("sweating")) {
            result.triggers.add("Dyspnea / Sweating");
        }
        if (sevLower.contains("severe") || sevLower.contains("excruciating") || sevLower.contains("8") || sevLower.contains("9") || sevLower.contains("10")) {
            result.triggers.add("High Pain Severity");
        }

        result.isRedFlag = (result.triggers.contains("Chest Pain") && result.triggers.contains("Dyspnea / Sweating"))
                || result.triggers.size() >= 2;

        return result;
    }
}
