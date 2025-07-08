package com.example.bffinder.boyfriends.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class BoyfriendResponseDto {
    private Long id;
    private String puuid;
    private String alias;
    private LocalDateTime savedAt;
}
