package com.marketdigestai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.marketdigestai.config.GeminiApiConfig;
import com.marketdigestai.dto.NewsArticleDto;
import com.marketdigestai.dto.SummarizeResponseDto;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GeminiApiService {
    private static final Logger logger = LoggerFactory.getLogger(GeminiApiService.class);
    private final GeminiApiConfig geminiApiConfig;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SummarizeResponseDto summarize(String company, List<NewsArticleDto> articles) {
        // Build prompt for Gemini
        StringBuilder prompt = new StringBuilder();
        prompt.append("Summarize the following news articles about ").append(company).append(":\n");
        for (NewsArticleDto article : articles) {
            prompt.append("Title: ").append(article.getTitle()).append("\n");
            prompt.append("Description: ").append(article.getDescription()).append("\n");
        }
        prompt.append("\nProvide a comprehensive, multi-paragraph summary suitable for a business/finance audience. The summary should be detailed, clear, and complete, and must not be cut off or truncated. After the summary, list the key points as bullet points. Do not truncate the response. Respond in JSON with fields: summary, keyPoints, sentiment.");

        // Prepare Gemini API request
        String apiUrl = geminiApiConfig.getGeminiApiUrl();
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt.toString())))
                )
        );
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);
            logger.info("Gemini API HTTP status: {}", response.getStatusCode());
            logger.info("Gemini API raw response body: {}", response.getBody());
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                // Parse Gemini response
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode candidates = root.path("candidates");
                if (candidates.isArray() && candidates.size() > 0) {
                    String content = candidates.get(0).path("content").path("parts").get(0).path("text").asText();
                    logger.info("Gemini API parsed content: {}", content);
                    // Try to parse the JSON from the LLM response
                    try {
                        JsonNode json = objectMapper.readTree(content);
                        String summary = json.path("summary").asText("");
                        List<String> keyPoints = new ArrayList<>();
                        if (json.has("keyPoints") && json.get("keyPoints").isArray()) {
                            for (JsonNode kp : json.get("keyPoints")) {
                                keyPoints.add(kp.asText());
                            }
                        }
                        String sentiment = json.path("sentiment").asText("");
                        return new SummarizeResponseDto(summary, keyPoints, sentiment);
                    } catch (Exception e) {
                        logger.error("Failed to parse Gemini content as JSON. Content: {}", content, e);
                        // If not valid JSON, return the raw content as summary
                        return new SummarizeResponseDto(content, List.of(), "");
                    }
                } else {
                    logger.warn("No candidates found in Gemini API response.");
                }
            } else {
                logger.error("Gemini API call failed. Status: {}, Body: {}", response.getStatusCode(), response.getBody());
            }
        } catch (Exception e) {
            logger.error("Exception during Gemini API call or parsing", e);
        }
        // Fallback stub
        String combinedText = articles.stream()
                .map(a -> a.getTitle() + ": " + a.getDescription())
                .collect(Collectors.joining("\n"));
        String summary = "Summary for " + company + ": " + (combinedText.length() > 100 ? combinedText.substring(0, 100) + "..." : combinedText);
        List<String> keyPoints = articles.stream().limit(3).map(NewsArticleDto::getTitle).collect(Collectors.toList());
        String sentiment = "Neutral";
        return new SummarizeResponseDto(summary, keyPoints, sentiment);
    }
} 