package com.marketdigestai.dto;

import java.util.List;

public class NewsRequestDto {
    private List<String> companies;

    // Getters and Setters
    public List<String> getCompanies() {
        return companies;
    }

    public void setCompanies(List<String> companies) {
        this.companies = companies;
    }
}
