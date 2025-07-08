package com.example.bffinder.league.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LeagueResponseDto {
    private String queueType;
    private String tier;
    private String rank;
    private int wins;
    private int losses;
}
