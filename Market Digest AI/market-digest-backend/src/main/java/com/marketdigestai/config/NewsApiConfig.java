package com.marketdigestai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class NewsApiConfig {
    @Value("${news.api.key}")
    private String newsApiKey;

    public String getNewsApiKey() {
        return newsApiKey;
    }
}
