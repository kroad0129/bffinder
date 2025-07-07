package com.example.bffinder.controller;

import com.example.bffinder.dto.AccountResponseDto;
import com.example.bffinder.service.AccountService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @GetMapping("/info")
    public AccountResponseDto getAccountInfo(
            @RequestParam String gameName,
            @RequestParam String tagLine
    ) {
        return accountService.getAccountInfo(gameName, tagLine);
    }
}
