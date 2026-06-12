package com.bookexchange.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Sends OTP emails through Gmail SMTP.
 *
 * Designed to FAIL SAFE: if Gmail is not configured (no MAIL_USERNAME) or the
 * send fails for any reason, it returns {@code false} instead of throwing, so
 * the login flow can fall back to dev mode and never crash.
 */
@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String from;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /** @return true if the email was actually sent, false otherwise. */
    public boolean sendOtp(String to, String code) {
        // No Gmail account configured yet -> let the caller fall back to dev mode.
        if (from == null || from.isBlank()) {
            System.out.println("[EMAIL] >>> Skipped: spring.mail.username is EMPTY. Gmail not configured -> using dev code.");
            return false;
        }
        System.out.println("[EMAIL] >>> Attempting to send OTP to " + to + " using account: " + from);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(from);
            message.setTo(to);
            message.setSubject("Your BookSwap verification code");
            message.setText(
                    "Welcome to BookSwap!\n\n" +
                    "Your one-time verification code is: " + code + "\n\n" +
                    "This code expires in 5 minutes. If you did not request it, " +
                    "you can safely ignore this email."
            );
            mailSender.send(message);
            System.out.println("[EMAIL] >>> SUCCESS: OTP email sent to " + to);
            return true;
        } catch (Exception e) {
            // Swallow the error so login never crashes; caller will use dev fallback.
            // Print the FULL reason so we can diagnose Gmail/SMTP problems.
            System.out.println("[EMAIL] >>> FAILED to send to " + to
                    + " | " + e.getClass().getName() + ": " + e.getMessage());
            Throwable cause = e.getCause();
            while (cause != null) {
                System.out.println("[EMAIL] >>>   caused by " + cause.getClass().getName() + ": " + cause.getMessage());
                cause = cause.getCause();
            }
            return false;
        }
    }
}
