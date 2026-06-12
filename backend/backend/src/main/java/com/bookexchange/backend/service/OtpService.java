package com.bookexchange.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Generates, stores and verifies one-time passwords (OTPs).
 *
 * Codes are kept IN MEMORY (no database changes required) keyed by email, with
 * a short expiry. This keeps the feature self-contained and easy to run.
 */
@Service
public class OtpService {

    private final EmailService emailService;

    /** When true, the generated code is returned to the client + logged so the
     *  flow works without Gmail configured. Controlled by app.otp.dev-mode. */
    @Value("${app.otp.dev-mode:true}")
    private boolean devMode;

    @Value("${app.otp.expiry-minutes:5}")
    private long expiryMinutes;

    private final SecureRandom random = new SecureRandom();
    private final ConcurrentHashMap<String, Otp> store = new ConcurrentHashMap<>();

    public OtpService(EmailService emailService) {
        this.emailService = emailService;
    }

    /** A stored code together with the moment it stops being valid. */
    private record Otp(String code, Instant expiresAt) {}

    /**
     * Creates a 6-digit code, stores it and emails it.
     *
     * @return the code if we are in dev mode OR the email failed to send
     *         (so the user can still log in); otherwise {@code null}.
     */
    public String generateAndSend(String email) {
        String key = email.toLowerCase();
        String code = String.format("%06d", random.nextInt(1_000_000));

        store.put(key, new Otp(code, Instant.now().plusSeconds(expiryMinutes * 60)));

        boolean sent = emailService.sendOtp(email, code);

        if (devMode || !sent) {
            System.out.println("[OTP] Verification code for " + email + " = " + code);
            return code;
        }
        return null;
    }

    /** @return true if the code matches and has not expired (one-time use). */
    public boolean verify(String email, String code) {
        if (email == null || code == null) {
            return false;
        }
        String key = email.toLowerCase();
        Otp otp = store.get(key);

        if (otp == null) {
            return false;
        }
        if (Instant.now().isAfter(otp.expiresAt())) {
            store.remove(key);
            return false;
        }
        boolean matches = otp.code().equals(code.trim());
        if (matches) {
            store.remove(key); // codes are single-use
        }
        return matches;
    }
}
