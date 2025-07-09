package com.marketdigestai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewsArticleDto {
    private String title;
    private String description;
    private String url;
    private String publishedAt;
    private String sourceName;
} 