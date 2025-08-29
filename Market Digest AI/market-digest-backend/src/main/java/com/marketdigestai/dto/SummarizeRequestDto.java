package com.marketdigestai.dto;

import java.util.List;

public class SummarizeRequestDto {
    private String company;
    private List<NewsArticleDto> articles;

    // Getters and Setters
    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public List<NewsArticleDto> getArticles() {
        return articles;
    }

    public void setArticles(List<NewsArticleDto> articles) {
        this.articles = articles;
    }
}
