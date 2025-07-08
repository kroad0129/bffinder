package com.example.bffinder.user.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UserSignupRequestDto {
    private String username;
    private String password;
    private String nickname;
    private String email;
}
