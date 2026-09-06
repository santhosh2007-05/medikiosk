package com.medikiosk.api.controller;

import com.medikiosk.api.service.SmsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/sms")
@CrossOrigin(origins = "*")
public class SmsController {

    @Autowired
    private SmsService smsService;

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendFast2SmsOtp(@RequestBody Map<String, String> request) {
        String mobile = request.getOrDefault("mobile", "");
        String apiKey = request.getOrDefault("apiKey", null);

        if (mobile.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Mobile number is required."));
        }

        Map<String, Object> result = smsService.sendSmsOtp(mobile, apiKey);
        return ResponseEntity.ok(result);
    }
}
