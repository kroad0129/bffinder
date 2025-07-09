package com.example.bffinder.user;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    @Value("${app.domain}") // application.properties에 추가 필요!
    private String appDomain;

    // 메일 인증 링크 발송
    public void sendVerificationEmail(String to, String token) {
        try {
            String verificationUrl = appDomain + "/api/user/verify-email?token=" + token;

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("[BFFinder] 이메일 인증을 완료해주세요!");
            helper.setText(
                    "<h2>BFFinder 이메일 인증</h2>" +
                            "<p>아래 버튼을 클릭해 이메일 인증을 완료하세요.</p>" +
                            "<a href='" + verificationUrl + "' " +
                            "style='padding:10px 30px; background:#1f61e6; color:white; text-decoration:none; border-radius:10px;'>인증하기</a>" +
                            "<p style='margin-top:16px;color:gray;'>이 링크는 30분간만 유효합니다.</p>",
                    true
            );
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("이메일 발송에 실패했습니다: " + e.getMessage());
        }
    }
}
