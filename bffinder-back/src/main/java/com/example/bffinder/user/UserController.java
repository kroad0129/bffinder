package com.example.bffinder.user;

import com.example.bffinder.user.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 1. 회원가입 + 이메일 인증메일 발송
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody UserSignupRequestDto dto) {
        userService.signup(dto);
        return ResponseEntity.ok("이메일 인증 메일을 전송했습니다! 메일을 확인해주세요.");
    }

    // 2. 이메일 인증 (이메일의 인증버튼이 이 엔드포인트로 연결됨)
    @GetMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@RequestParam String token) {
        userService.verifyEmail(token);
        // 프론트에서 확인용 URL을 보여주고 싶으면 리디렉션(302)도 가능
        return ResponseEntity.ok("이메일 인증이 완료되었습니다! 이제 로그인 가능합니다.");
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody ResendVerificationRequestDto dto) {
        userService.resendVerification(dto.getEmail());
        return ResponseEntity.ok("인증 메일이 재발송되었습니다!");
    }

    @GetMapping("/email")
    public ResponseEntity<?> getEmailByUsername(@RequestParam String username) {
        try {
            UserEmailResponseDto dto = userService.getEmailByUsername(username);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }


    // 로그인
    @PostMapping("/login")
    public ResponseEntity<UserLoginResponseDto> login(@RequestBody UserLoginRequestDto dto) {
        String token = userService.login(dto);
        System.out.println("로그인 진입!");
        return ResponseEntity.ok(new UserLoginResponseDto(token));
    }

    // 내 정보 조회 (마이페이지)
    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getMyInfo(@AuthenticationPrincipal UserDetails userDetails) {
        UserResponseDto dto = userService.getMyInfo(userDetails.getUsername());
        return ResponseEntity.ok(dto);
    }

    // 내 정보 수정
    @PutMapping("/me")
    public ResponseEntity<UserResponseDto> updateMyInfo(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UserUpdateRequestDto dto
    ) {
        UserResponseDto updated = userService.updateUser(userDetails.getUsername(), dto);
        return ResponseEntity.ok(updated);
    }

    // 회원 탈퇴
    @DeleteMapping("/me")
    public ResponseEntity<CommonResponseDto> deleteMyInfo(@AuthenticationPrincipal UserDetails userDetails) {
        userService.deleteUser(userDetails.getUsername());
        return ResponseEntity.ok(new CommonResponseDto("회원 탈퇴 완료!"));
    }
}
