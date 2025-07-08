package com.example.bffinder.boyfriends;

import com.example.bffinder.boyfriends.dto.BoyfriendSaveRequestDto;
import com.example.bffinder.boyfriends.dto.BoyfriendResponseDto;
import com.example.bffinder.user.User;
import com.example.bffinder.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/boyfriends")
@RequiredArgsConstructor
public class BoyfriendController {

    private final BoyfriendService boyfriendService;
    private final UserRepository userRepository;

    // 저장
    @PostMapping
    public ResponseEntity<?> save(@AuthenticationPrincipal UserDetails userDetails,
                                  @RequestBody BoyfriendSaveRequestDto dto) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("회원 정보 없음"));
        boyfriendService.saveBoyfriend(user, dto);
        return ResponseEntity.ok("저장 성공!");
    }

    // 내 목록 조회
    @GetMapping("/my")
    public List<BoyfriendResponseDto> getMyBoyfriends(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("회원 정보 없음"));
        return boyfriendService.getMyBoyfriends(user);
    }

    // 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@AuthenticationPrincipal UserDetails userDetails,
                                    @PathVariable Long id) {
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("회원 정보 없음"));
        boyfriendService.deleteBoyfriend(user, id);
        return ResponseEntity.ok("삭제 성공!");
    }
}
