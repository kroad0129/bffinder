// src/main/java/com/example/bffinder/user/dto/AuthResponseDto.java
package com.example.bffinder.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class UserLoginResponseDto {
    private String token;
}
