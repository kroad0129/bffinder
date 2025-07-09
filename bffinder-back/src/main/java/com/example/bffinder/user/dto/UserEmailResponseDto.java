package com.example.bffinder.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserEmailResponseDto {
    private String email;
    private String nickname; // 필요 없다면 삭제해도 됨
}
