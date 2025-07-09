package com.marketdigestai.dto;

import lombok.Data;
import java.util.List;

@Data
public class NewsRequestDto {
    private List<String> companies;
} 