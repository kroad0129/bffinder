package com.example.bffinder.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MatchGameResponseDto {
    private String matchId;
    private long gameCreation;       // 게임 시작 시간 (유닉스 타임)
    private long gameEndTimestamp;   // 게임 종료 시간 (유닉스 타임)
    private long gameDuration;       // 게임 지속 시간 (초)
    private boolean win;
}
