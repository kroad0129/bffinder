package com.example.bffinder.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InGameResponseDto {
    private boolean inGame;
    private Long gameStartTime; // ms 단위 (없으면 null)
    private Long gameLength;    // 초 단위 (없으면 null)
}
