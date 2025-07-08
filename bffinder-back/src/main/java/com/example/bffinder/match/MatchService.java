package com.example.bffinder.match;

import com.example.bffinder.match.dto.MatchGameResponseDto;
import com.example.bffinder.match.dto.MatchGameListDto;
import com.example.bffinder.util.RiotApiClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class MatchService {

    private final RiotApiClient riotApiClient;

    public MatchService(RiotApiClient riotApiClient) {
        this.riotApiClient = riotApiClient;
    }

    public MatchGameListDto getRecentMatchList(String puuid, int count) {
        // 1. matchId 리스트 가져오기
        String matchListUrl = "https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?start=0&count={count}";
        Map<String, Object> params = Map.of(
                "puuid", puuid,
                "count", count
        );
        List<String> matchIds = riotApiClient.get(matchListUrl, List.class, params);

        List<MatchGameResponseDto> matchInfoList = new ArrayList<>();
        // 2. matchId마다 상세 정보 요청
        for (String matchId : matchIds) {
            String matchDetailUrl = "https://asia.api.riotgames.com/lol/match/v5/matches/{matchId}";
            Map<String, String> detailParams = Map.of("matchId", matchId);
            Map matchDetail = riotApiClient.get(matchDetailUrl, Map.class, detailParams);

            // 3. JSON에서 필요한 필드만 추출
            Map info = (Map) matchDetail.get("info");
            long gameCreation = ((Number) info.get("gameCreation")).longValue();
            long gameEndTimestamp = ((Number) info.get("gameEndTimestamp")).longValue();
            long gameDuration = ((Number) info.get("gameDuration")).longValue();

            List participants = (List) info.get("participants");
            boolean win = false;
            for (Object obj : participants) {
                Map p = (Map) obj;
                if (puuid.equals(p.get("puuid"))) {
                    win = Boolean.TRUE.equals(p.get("win"));
                    break;
                }
            }

            matchInfoList.add(
                    new MatchGameResponseDto(matchId, gameCreation, gameEndTimestamp, gameDuration, win)
            );
        }
        // 4. 감싸기 DTO로 반환
        return new MatchGameListDto(matchInfoList);
    }

    public Map getCurrentGameInfo(String puuid) {
        String url = "https://kr.api.riotgames.com/lol/spectator/v5/active-games/by-summoner/{encryptedPUUID}";
        Map<String, String> params = Map.of("encryptedPUUID", puuid);
        return riotApiClient.get(url, Map.class, params);
    }
}
