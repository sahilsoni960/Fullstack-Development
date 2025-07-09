package com.marketdigestai.service;

import com.marketdigestai.config.NewsApiConfig;
import com.marketdigestai.dto.NewsArticleDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NewsApiService {
    private final NewsApiConfig newsApiConfig;
    private final RestTemplate restTemplate = new RestTemplate();

    public List<NewsArticleDto> fetchNewsForCompany(String company) {
        String url = UriComponentsBuilder.fromHttpUrl("https://newsapi.org/v2/everything")
                .queryParam("q", company)
                .queryParam("sortBy", "publishedAt")
                .queryParam("pageSize", 10)
                .queryParam("language", "en")
                .queryParam("apiKey", newsApiConfig.getNewsApiKey())
                .toUriString();

        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
        List<NewsArticleDto> articles = new ArrayList<>();
        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            List<Map<String, Object>> newsList = (List<Map<String, Object>>) response.getBody().get("articles");
            if (newsList != null) {
                for (Map<String, Object> item : newsList) {
                    Map<String, Object> source = (Map<String, Object>) item.get("source");
                    articles.add(new NewsArticleDto(
                            (String) item.get("title"),
                            (String) item.get("description"),
                            (String) item.get("url"),
                            (String) item.get("publishedAt"),
                            source != null ? (String) source.get("name") : null
                    ));
                }
            }
        }
        return articles;
    }
} 