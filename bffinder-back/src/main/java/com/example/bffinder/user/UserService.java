package com.example.bffinder.user;

import com.example.bffinder.security.JwtUtil;
import com.example.bffinder.user.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    // 회원가입
    @Transactional
    public void signup(UserSignupRequestDto dto) {
        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("이미 사용중인 아이디입니다.");
        }
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("이미 사용중인 이메일입니다.");
        }
        String encodedPassword = passwordEncoder.encode(dto.getPassword());

        // 이메일 인증 토큰 생성 및 만료일 세팅
        String token = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(30);

        User user = User.builder()
                .username(dto.getUsername())
                .password(encodedPassword)
                .nickname(dto.getNickname())
                .email(dto.getEmail())
                .role("USER")
                .isEmailVerified(false)
                .emailVerificationToken(token)
                .tokenExpiry(expiry)
                .build();

        userRepository.save(user);

        // 인증 메일 전송 (여기서 링크 도메인/포트 맞춰주세요!)
        emailService.sendVerificationEmail(user.getEmail(), token);
    }

    // 이메일 인증 처리
    @Transactional
    public void verifyEmail(String token) {
        User user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("잘못된 인증 토큰입니다."));
        if (user.isEmailVerified()) {
            throw new RuntimeException("이미 인증된 계정입니다.");
        }
        if (user.getTokenExpiry() == null || user.getTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("인증 토큰이 만료되었습니다.");
        }
        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        user.setTokenExpiry(null);
        userRepository.save(user);
    }

    public void resendVerification(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("해당 이메일이 존재하지 않습니다."));
        if (user.isEmailVerified()) {
            throw new RuntimeException("이미 인증이 완료된 계정입니다.");
        }
        // 토큰 재발급
        String token = UUID.randomUUID().toString();
        user.setEmailVerificationToken(token);
        user.setTokenExpiry(LocalDateTime.now().plusMinutes(30));
        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), token);
    }

    public UserEmailResponseDto getEmailByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return new UserEmailResponseDto(user.getEmail(), user.getNickname());
    }

    // 로그인
    public String login(UserLoginRequestDto dto) {
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 아이디입니다."));
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 올바르지 않습니다.");
        }
        if (!user.isEmailVerified()) {
            throw new RuntimeException("이메일 인증이 필요합니다.");
        }
        return jwtUtil.generateToken(user.getUsername());
    }

    // 내 정보 조회
    public UserResponseDto getMyInfo(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        return new UserResponseDto(user.getId(), user.getUsername(), user.getEmail(), user.getNickname());
    }

    // 내 정보 수정
    public UserResponseDto updateUser(String username, UserUpdateRequestDto dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        if (dto.getNickname() != null && !dto.getNickname().isEmpty())
            user.setNickname(dto.getNickname());
        if (dto.getPassword() != null && !dto.getPassword().isEmpty())
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        userRepository.save(user);
        return new UserResponseDto(user.getId(), user.getUsername(), user.getEmail(), user.getNickname());
    }

    // 회원 탈퇴
    public void deleteUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
        userRepository.delete(user);
    }
}
