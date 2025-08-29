package com.marketdigestai.dto;

public class NewsArticleDto {
    private String title;
    private String description;
    private String url;
    private String publishedAt;
    private String sourceName;

    // No-argument constructor
    public NewsArticleDto() {
    }

    // All-arguments constructor
    public NewsArticleDto(String title, String description, String url, String publishedAt, String sourceName) {
        this.title = title;
        this.description = description;
        this.url = url;
        this.publishedAt = publishedAt;
        this.sourceName = sourceName;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(String publishedAt) {
        this.publishedAt = publishedAt;
    }

    public String getSourceName() {
        return sourceName;
    }

    public void setSourceName(String sourceName) {
        this.sourceName = sourceName;
    }
}
