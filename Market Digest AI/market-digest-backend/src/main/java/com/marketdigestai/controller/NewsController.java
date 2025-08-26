package com.marketdigestai.controller;

import com.marketdigestai.dto.NewsArticleDto;
import com.marketdigestai.dto.NewsRequestDto;
import com.marketdigestai.service.NewsApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "https://market-digest-frontend.onrender.com"})
public class NewsController {
    private final NewsApiService newsApiService;

    @PostMapping
    public ResponseEntity<Map<String, List<NewsArticleDto>>> getNewsForCompanies(@RequestBody NewsRequestDto request) {
        Map<String, List<NewsArticleDto>> result = new HashMap<>();
        for (String company : request.getCompanies()) {
            result.put(company, newsApiService.fetchNewsForCompany(company));
        }
        return ResponseEntity.ok(result);
    }
} 