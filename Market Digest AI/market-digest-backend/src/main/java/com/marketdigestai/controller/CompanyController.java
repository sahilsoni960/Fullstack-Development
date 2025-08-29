package com.marketdigestai.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@RestController
public class CompanyController {
    private static final List<String> COMPANIES = Arrays.asList(
            "Apple", "Microsoft", "Google", "Amazon", "Meta", "Tesla", "Nvidia", "Samsung", "IBM", "Intel",
            "Oracle", "Netflix", "Adobe", "Intact", "Salesforce", "Informatica","Uber", "Airbnb", "Spotify", "PayPal", "Shopify", "Zoom"
    );

    @GetMapping("/api/companies")
    public List<String> getCompanies(@RequestParam(value = "search", required = false) String search) {
        if (search == null || search.isBlank()) {
            return COMPANIES;
        }
        String searchLower = search.toLowerCase(Locale.ROOT);
        return COMPANIES.stream()
                .filter(name -> name.toLowerCase(Locale.ROOT).contains(searchLower))
                .collect(Collectors.toList());
    }
}
