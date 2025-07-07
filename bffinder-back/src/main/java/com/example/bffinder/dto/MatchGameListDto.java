package com.example.bffinder.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class MatchGameListDto {
    private List<MatchGameResponseDto> matches;
}
