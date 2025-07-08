package com.example.bffinder.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserUpdateRequestDto {
    private String nickname;
    private String password;
}
