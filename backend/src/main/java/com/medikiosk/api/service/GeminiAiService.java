package com.medikiosk.api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class GeminiAiService {

    @Value("${gemini.api.key:DEMO_KEY_CONFIGURABLE}")
    private String apiKey;

    public Map<String, Object> generateSymptomQuestions(String chiefComplaint, String language) {
        Map<String, Object> result = new HashMap<>();
        result.put("complaint", chiefComplaint);
        result.put("language", language);

        // Real-Time Gemini Prompt Structure for dynamic symptom clinical engine
        String prompt = """
        You are an AI Clinical History Intake Assistant for an Indian OPD kiosk (Ministry of Ayush / AIIA).
        Patient Chief Complaint: "%s"
        Language Required: "%s"
        
        Generate 4-5 SOCRATES clinical questions specifically tailored ONLY to "%s".
        Do not ask about unrelated symptoms. Format output in JSON containing title, subtext, and 4 option choices in native script.
        """.formatted(chiefComplaint, language, chiefComplaint);

        result.put("prompt", prompt);
        result.put("status", "READY_FOR_GEMINI_API");
        return result;
    }
}
