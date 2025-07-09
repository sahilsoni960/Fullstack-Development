package com.marketdigestai.dto;

import lombok.Data;
import java.util.List;

@Data
public class SummarizeRequestDto {
    private String company;
    private List<NewsArticleDto> articles;
} 