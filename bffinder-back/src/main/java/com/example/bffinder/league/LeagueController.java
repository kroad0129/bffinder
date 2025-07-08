package com.example.bffinder.league;

import com.example.bffinder.league.dto.LeagueResponseDto;
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
