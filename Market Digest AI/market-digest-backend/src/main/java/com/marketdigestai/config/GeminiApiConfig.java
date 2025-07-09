package com.marketdigestai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import lombok.Getter;

@Configuration
@Getter
public class GeminiApiConfig {
    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${llm.gemini.api.url}")
    private String geminiApiUrl;
} 