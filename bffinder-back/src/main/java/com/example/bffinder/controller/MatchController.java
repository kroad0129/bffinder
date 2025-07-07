package com.example.bffinder.controller;

import com.example.bffinder.dto.InGameResponseDto;
import com.example.bffinder.dto.MatchGameListDto;
import com.example.bffinder.service.MatchService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/match")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping("/list")
    public MatchGameListDto getRecentMatchList(
            @RequestParam String puuid,
            @RequestParam(defaultValue = "10") int count
    ) {
        return matchService.getRecentMatchList(puuid, count); // 새 방식
    }

    @GetMapping("/in-game")
    public InGameResponseDto getInGameInfo(@RequestParam String puuid) {
        try {
            Map response = matchService.getCurrentGameInfo(puuid);
            long gameStartTime = ((Number) response.get("gameStartTime")).longValue();
            long gameLength = ((Number) response.get("gameLength")).longValue();
            return new InGameResponseDto(true, gameStartTime, gameLength);
        } catch (Exception e) {
            return new InGameResponseDto(false, null, null);
        }
    }
}
