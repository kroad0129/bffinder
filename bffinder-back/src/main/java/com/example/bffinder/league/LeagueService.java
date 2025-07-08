package com.example.bffinder.league;

import com.example.bffinder.league.dto.LeagueResponseDto;
import com.example.bffinder.util.RiotApiClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class LeagueService {

    private final RiotApiClient riotApiClient;

    public LeagueService(RiotApiClient riotApiClient) {
        this.riotApiClient = riotApiClient;
    }

    public List<LeagueResponseDto> getLeagueEntries(String puuid) {
        String url = "https://kr.api.riotgames.com/lol/league/v4/entries/by-puuid/{encryptedPUUID}";
        Map<String, String> params = Map.of("encryptedPUUID", puuid);

        List<Map<String, Object>> response = riotApiClient.get(url, List.class, params);

        List<LeagueResponseDto> result = new ArrayList<>();
        for (Map<String, Object> entry : response) {
            String queueType = (String) entry.get("queueType");
            String tier = (String) entry.get("tier");
            String rank = (String) entry.get("rank");
            int wins = ((Number) entry.get("wins")).intValue();
            int losses = ((Number) entry.get("losses")).intValue();

            result.add(new LeagueResponseDto(queueType, tier, rank, wins, losses));
        }
        return result;
    }
}
