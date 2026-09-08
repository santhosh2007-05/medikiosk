package com.medikiosk.api.controller;

import com.medikiosk.api.service.GeminiAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiQuestionEngineController {

    @Autowired
    private GeminiAiService geminiAiService;

    @PostMapping("/next-question")
    public ResponseEntity<Map<String, Object>> generateSymptomQuestions(@RequestBody Map<String, String> payload) {
        String complaint = payload.getOrDefault("chiefComplaint", "General Consultation");
        String language = payload.getOrDefault("language", "en-IN");

        Map<String, Object> response = geminiAiService.generateSymptomQuestions(complaint, language);
        return ResponseEntity.ok(response);
    }
}
