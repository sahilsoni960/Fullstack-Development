package com.marketdigestai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SummarizeResponseDto {
    private String summary;
    private List<String> keyPoints;
    private String sentiment;
} 