package com.example.bffinder.user;

import com.example.bffinder.security.JwtUtil;
import com.example.bffinder.user.dto.UserResponseDto;
import com.example.bffinder.user.dto.UserSignupRequestDto;
import com.example.bffinder.user.dto.UserLoginRequestDto;
import com.example.bffinder.user.dto.UserUpdateRequestDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // 회원가입
    public void signup(UserSignupRequestDto dto)
    {
        // username, email 중복 검사
        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("이미 사용중인 아이디입니다.");
        }
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("이미 사용중인 이메일입니다.");
        }
        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(dto.getPassword());
        // 저장
        User user = User.builder()
                .username(dto.getUsername())
                .password(encodedPassword)
                .nickname(dto.getNickname())
                .email(dto.getEmail())
                .role("USER")
                .isEmailVerified(false)
                .build();
        userRepository.save(user);
    }

    // 로그인
    public String login(UserLoginRequestDto dto) {
        User user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 아이디입니다."));
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 올바르지 않습니다.");
        }
        // JWT 토큰 생성 후 반환
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
