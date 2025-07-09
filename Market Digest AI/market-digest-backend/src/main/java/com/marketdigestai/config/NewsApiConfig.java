package com.marketdigestai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import lombok.Getter;

@Configuration
@Getter
public class NewsApiConfig {
    @Value("${news.api.key}")
    private String newsApiKey;
} 