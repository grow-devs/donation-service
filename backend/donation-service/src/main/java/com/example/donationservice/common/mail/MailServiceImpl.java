package com.example.donationservice.common.mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailServiceImpl implements MailService {

    // JavaMailSender는 첨부파일, HTML, 멀티파트 메일 등 다양한 포맷 지원
    private final JavaMailSender javaMailSender;

    @Override
    public void sendDonationGoalReachedMail(String toEmail, Long postId) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String subject = "[기부 알림] 게시물의 목표 금액이 달성되었습니다!";
            String htmlContent = buildHtmlContent(postId);

            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true = HTML

            javaMailSender.send(message);
            log.info("✅ 목표 도달 HTML 메일 전송 완료: {}", toEmail);

        } catch (MessagingException e) {
            log.error("❌ 메일 전송 실패 (to: {})", toEmail, e);
        }
    }

    private String buildHtmlContent(Long postId) {
        return """
                <html>
                    <body>
                        <h2>🎉 기부 목표 달성 알림 🎉</h2>
                        <p>회원님이 참여하신 게시물(ID: <strong>%d</strong>)이 목표 금액을 달성하였습니다.</p>
                        <p>소중한 기부에 감사드립니다! 🙏</p>
                        <hr />
                        <p><a href="https://your-donation-platform.com/posts/%d">👉 게시물 보러가기</a></p>
                    </body>
                </html>
                """.formatted(postId, postId);
    }

}
