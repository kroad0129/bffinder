package com.example.bffinder.controller;

import com.example.bffinder.dto.LeagueResponseDto;
import com.example.bffinder.service.LeagueService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/league")
public class LeagueController {

    private final LeagueService leagueService;

    public LeagueController(LeagueService leagueService) {
        this.leagueService = leagueService;
    }

    // GET /api/league/entries?puuid=xxx
    @GetMapping("/entries")
    public List<LeagueResponseDto> getLeagueEntries(@RequestParam String puuid) {
        return leagueService.getLeagueEntries(puuid);
    }
}
