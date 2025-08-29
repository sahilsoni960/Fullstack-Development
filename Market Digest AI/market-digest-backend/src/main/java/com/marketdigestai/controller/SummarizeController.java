package com.marketdigestai.controller;

import com.marketdigestai.dto.SummarizeRequestDto;
import com.marketdigestai.dto.SummarizeResponseDto;
import com.marketdigestai.service.GeminiApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/summarize")
public class SummarizeController {
    private final GeminiApiService geminiApiService;

    @Autowired
    public SummarizeController(GeminiApiService geminiApiService) {
        this.geminiApiService = geminiApiService;
    }

    @PostMapping
    public ResponseEntity<SummarizeResponseDto> summarize(@RequestBody SummarizeRequestDto request) {
        SummarizeResponseDto response = geminiApiService.summarize(request.getCompany(), request.getArticles());
        return ResponseEntity.ok(response);
    }
}
