package com.bookexchange.backend.controller;

import com.bookexchange.backend.service.OtpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * OTP endpoints used by the login page.
 *
 *   POST /api/auth/send-otp    { "email": "..." }
 *   POST /api/auth/verify-otp  { "email": "...", "code": "123456" }
 *
 * In dev mode the send-otp response includes a "devCode" field so the frontend
 * can show / auto-fill the code while Gmail is not yet set up.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final OtpService otpService;

    public AuthController(OtpService otpService) {
        this.otpService = otpService;
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }

        String devCode = otpService.generateAndSend(email);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "OTP sent");
        if (devCode != null) {
            response.put("devCode", devCode); // present only in dev mode / email-not-configured
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> body) {
        boolean verified = otpService.verify(body.get("email"), body.get("code"));
        if (verified) {
            return ResponseEntity.ok(Map.of("verified", true));
        }
        return ResponseEntity.status(400)
                .body(Map.of("verified", false, "message", "Invalid or expired code"));
    }
}
