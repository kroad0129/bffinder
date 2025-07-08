package com.example.bffinder.boyfriends.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class BoyfriendSaveRequestDto {
    private String puuid;
    private String alias;     // 저장할 별명
}
