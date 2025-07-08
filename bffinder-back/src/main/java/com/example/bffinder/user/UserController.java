package com.example.bffinder.user;

import com.example.bffinder.user.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody UserSignupRequestDto dto) {
        userService.signup(dto);
        return ResponseEntity.ok("회원가입 성공!");
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
