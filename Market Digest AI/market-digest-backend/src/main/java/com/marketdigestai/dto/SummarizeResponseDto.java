package com.marketdigestai.dto;

import java.util.List;

public class SummarizeResponseDto {
    private String summary;
    private List<String> keyPoints;
    private String sentiment;

    // No-argument constructor
    public SummarizeResponseDto() {
    }

    // All-arguments constructor
    public SummarizeResponseDto(String summary, List<String> keyPoints, String sentiment) {
        this.summary = summary;
        this.keyPoints = keyPoints;
        this.sentiment = sentiment;
    }

    // Getters and Setters
    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<String> getKeyPoints() {
        return keyPoints;
    }

    public void setKeyPoints(List<String> keyPoints) {
        this.keyPoints = keyPoints;
    }

    public String getSentiment() {
        return sentiment;
    }

    public void setSentiment(String sentiment) {
        this.sentiment = sentiment;
    }
}
