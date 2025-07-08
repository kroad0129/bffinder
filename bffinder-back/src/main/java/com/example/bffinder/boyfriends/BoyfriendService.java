package com.example.bffinder.boyfriends;

import com.example.bffinder.boyfriends.dto.BoyfriendSaveRequestDto;
import com.example.bffinder.boyfriends.dto.BoyfriendResponseDto;
import com.example.bffinder.user.User;
import com.example.bffinder.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BoyfriendService {
    private final BoyfriendRepository boyfriendRepository;
    private final UserRepository userRepository;

    private static final int MAX_BOYFRIENDS = 5;

    @Transactional
    public void saveBoyfriend(User user, BoyfriendSaveRequestDto dto) {
        // 5개 제한 체크
        if (boyfriendRepository.countByUser(user) >= MAX_BOYFRIENDS) {
            throw new RuntimeException("최대 5개까지 저장할 수 있습니다.");
        }
        // 중복 puuid 저장 방지
        if (boyfriendRepository.existsByUserAndPuuid(user, dto.getPuuid())) {
            throw new RuntimeException("이미 저장된 소환사입니다.");
        }
        Boyfriend boyfriend = Boyfriend.builder()
                .puuid(dto.getPuuid())
                .alias(dto.getAlias())
                .savedAt(LocalDateTime.now())
                .user(user)
                .build();
        boyfriendRepository.save(boyfriend);
    }

    public List<BoyfriendResponseDto> getMyBoyfriends(User user) {
        return boyfriendRepository.findAllByUser(user).stream()
                .map(b -> new BoyfriendResponseDto(
                        b.getId(), b.getPuuid(), b.getAlias(), b.getSavedAt()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteBoyfriend(User user, Long boyfriendId) {
        Boyfriend boyfriend = boyfriendRepository.findByIdAndUser(boyfriendId, user)
                .orElseThrow(() -> new RuntimeException("해당 소환사를 찾을 수 없습니다."));
        boyfriendRepository.delete(boyfriend);
    }
}
