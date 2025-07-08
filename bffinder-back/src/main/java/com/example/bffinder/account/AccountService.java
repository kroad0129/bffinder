package com.example.bffinder.account;

import com.example.bffinder.account.dto.AccountResponseDto;
import com.example.bffinder.util.RiotApiClient;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class AccountService {

    private final RiotApiClient riotApiClient;

    public AccountService(RiotApiClient riotApiClient) {
        this.riotApiClient = riotApiClient;
    }

    // 닉네임, 태그로 계정 정보 조회
    public AccountResponseDto getAccountInfoByName(String gameName, String tagLine) {
        String url = "https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}";
        Map<String, String> params = Map.of(
                "gameName", gameName,
                "tagLine", tagLine
        );
        return riotApiClient.get(url, AccountResponseDto.class, params);
    }

    // puuid로 계정 정보 조회
    public AccountResponseDto getAccountInfoByPuuid(String puuid) {
        String url = "https://asia.api.riotgames.com/riot/account/v1/accounts/by-puuid/{puuid}";
        Map<String, String> params = Map.of("puuid", puuid);
        return riotApiClient.get(url, AccountResponseDto.class, params);
    }
}
