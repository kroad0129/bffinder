package com.example.bffinder.match;

import com.example.bffinder.match.dto.InGameResponseDto;
import com.example.bffinder.match.dto.MatchGameListDto;
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
