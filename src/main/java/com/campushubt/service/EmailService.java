package com.campushubt.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendEmail(String to, String subject, String content) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(content);
        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String to, String resetToken) {
        String subject = "Password Reset";
        String content = String.format(
            "To reset your password, please click the following link:\n\n" +
            "http://localhost:3000/reset-password?token=%s\n\n" +
            "This link will expire in 30 minutes.\n" +
            "If you did not request a password reset, please ignore this email.",
            resetToken
        );
        sendEmail(to, subject, content);
    }
}