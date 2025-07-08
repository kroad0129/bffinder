package com.example.bffinder.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter @AllArgsConstructor
public class UserResponseDto {
    private Long id;
    private String username;
    private String email;
    private String nickname;
}
