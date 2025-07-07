package com.example.bffinder.service;

import com.example.bffinder.dto.AccountResponseDto;
import com.example.bffinder.util.RiotApiClient;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class AccountService {

    private final RiotApiClient riotApiClient;

    public AccountService(RiotApiClient riotApiClient) {
        this.riotApiClient = riotApiClient;
    }

    public AccountResponseDto getAccountInfo(String gameName, String tagLine) {
        String url = "https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}";
        Map<String, String> params = Map.of(
                "gameName", gameName,
                "tagLine", tagLine
        );
        return riotApiClient.get(url, AccountResponseDto.class, params);
    }
}
