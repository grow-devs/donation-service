package com.example.donationservice.common.mail;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailServiceImpl implements MailService {

    // JavaMailSender는 첨부파일, HTML, 멀티파트 메일 등 다양한 포맷 지원
    private final JavaMailSender javaMailSender;
    private final RedisTemplate<String, String> redisTemplate;

    // UUID를 통한 인증 코드 생성
    private String createVerificationCode() {
        // UUID 생성 후, 하이픈 제거
        String uuid = UUID.randomUUID().toString().replace("-", "");
        // 예를 들어, 8자리 또는 6자리로 자르고 싶다면
        return uuid.substring(0, 8); // 예시: 앞 8자리만 사용
    }

    @Override
    @Async("mailTaskExecutor")
    public void sendDonationGoalReachedMail(List<String> toEmails, String postTitle, Long currentAmount) {
        for (String toEmail : toEmails) {
            try {
                MimeMessage message = javaMailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                String subject = "[기부 알림] 게시물의 목표 금액이 달성되었습니다!";
                String htmlContent = buildHtmlContent(postTitle, currentAmount);

                helper.setTo(toEmail);
                helper.setSubject(subject);
                helper.setText(htmlContent, true); // true = HTML

                javaMailSender.send(message);
                log.info("✅ 목표 도달 HTML 메일 전송 완료: {}", toEmail);

            } catch (MessagingException e) {
                log.error("❌ 메일 전송 실패 (to: {})", toEmail, e);
            }
        }
    }

    // 로그인 이메일 인증 코드 발송 메서드
    public void sendVerificationEmail(String to) {
        try {
            String verificationCode = createVerificationCode();
            String key = "emailVerify:" + to;
            // 3분동안 인증을 하지 않으면 인증코드가 삭제되게 TTL 3분 설정
            redisTemplate.opsForValue().set(key, verificationCode, 3, TimeUnit.MINUTES);

            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("이메일 인증");

            // HTML 이메일 본문
            String htmlContent = getVerificationEmailHtml(verificationCode, to);

            helper.setText(htmlContent, true); // 두 번째 인자를 true로 설정하여 HTML 형식임을 알림

            javaMailSender.send(message);
            log.info("✅ 인증 메일 전송 완료: {}", to);
        } catch (MessagingException e) {
            log.error("❌ 메일 전송 실패 (to: {})", to, e);
        }
    }

    //이메일 인증 코드 확인 메서드
    public boolean verifyCode(String email, String code) {
        String key = "emailVerify:" + email;
        String storedCode = redisTemplate.opsForValue().get(key);
        System.out.println("실제 코드 storedCode" + storedCode + " " + "입력한 code : " + code);
        // 인증번호가 일치하면 true 반환 후, 인증번호 삭제
        if (storedCode != null && storedCode.equals(code)) {
            redisTemplate.delete(key);
            return true;
        }
        return false;
    }

    private String buildHtmlContent(String postTitle, Long currentAmount) {
        return """
                <html>
                    <body>
                        <h2>🎉 기부 목표 달성 알림 🎉</h2>
                        <p><strong>게시물 제목:</strong> %s</p>
                        <p><strong>달성된 금액:</strong> %d 포인트</p>
                        <p>회원님이 참여하신 게시물이 목표 금액을 달성하였습니다.</p>
                        <p>소중한 기부에 감사드립니다! 🙏</p>
                        <hr />
                    </body>
                </html>
                """.formatted(postTitle, currentAmount);
    }

    //이메일 인증 발송 컨텐츠 html
    private String getVerificationEmailHtml(String verificationCode, String email) {
        return "<div style='font-family: Arial, sans-serif; border-collapse: collapse; width: 100%;'>"
                + "<h2 style='color: #333333;'>이메일 인증 안내</h2>"
                + "<p style='color: #666666;'>안녕하세요. <span style='font-weight: bold;'>" + email + "</span>님,</p>"
                + "<p style='color: #666666;'>아래 인증번호를 복사하여 인증을 완료해주세요.</p>"
                + "<div style='background-color: #f5f5f5; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;'>"
                + "<p style='font-size: 24px; color: #1e88e5; font-weight: bold; margin: 0;'>" + verificationCode + "</p>"
                + "</div>"
                + "<p style='color: #999999; font-size: 12px;'>본 메일은 발신 전용입니다. 문의사항은 고객센터를 이용해 주시기 바랍니다.</p>"
                + "</div>";
    }

    //test용 메서드
    //test 통과✔️
//    @Async("mailTaskExecutor")
//    @Override
//    public void sendMail(List<String>emails) {
//
//        for (String email : emails) {
//            try {
//                Thread.sleep(3000);
//                log.info(email + "님에게 메일 전송 성공");
//            } catch (Exception e) {
//                log.error("메일 전송 실패 - postId: {}, email: {}, error: {}");
//            }
//        }
//    }

}
