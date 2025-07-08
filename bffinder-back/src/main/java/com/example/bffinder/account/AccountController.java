package com.example.bffinder.account;

import com.example.bffinder.account.dto.AccountResponseDto;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    // 닉네임, 태그로 계정 정보 조회
    @GetMapping("/nametag")
    public AccountResponseDto getAccountInfoByName(
            @RequestParam String gameName,
            @RequestParam String tagLine
    ) {
        return accountService.getAccountInfoByName(gameName, tagLine);
    }

    // puuid로 계정 정보 조회
    @GetMapping("/puuid")
    public AccountResponseDto getAccountInfoByPuuid(
            @RequestParam String puuid
    ) {
        return accountService.getAccountInfoByPuuid(puuid);
    }
}
