package org.genai.knowledgebase.controller;

import org.genai.knowledgebase.llm.gemini.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/**
 * REST controller for LLM Q&A and summarization endpoints using Gemini.
 *
 * <p>
 * Exposes endpoints for asking questions and summarizing content using Gemini LLM.
 * </p>
 */
@RestController
@RequestMapping("/api")
public class LLMController {
    private final GeminiService geminiService;

    /**
     * Constructor-based dependency injection of GeminiService.
     * @param geminiService the service for LLM Q&A and summarization
     */
    @Autowired
    public LLMController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    /**
     * Ask a question to the LLM (Gemini).
     * @param body JSON with a 'prompt' field (the question)
     * @return the generated answer from Gemini
     */
    @PostMapping("/ask")
    public ResponseEntity<Map<String, String>> askQuestion(@RequestBody Map<String, String> body) {
        String prompt = body.getOrDefault("prompt", "");
        String answer = geminiService.generateContent(prompt);
        return ResponseEntity.ok(Map.of("answer", answer));
    }

    /**
     * Summarize content using the LLM (Gemini).
     * @param body JSON with a 'prompt' field (the content to summarize)
     * @return the generated summary from Gemini
     */
    @PostMapping("/summarize")
    public ResponseEntity<Map<String, String>> summarize(@RequestBody Map<String, String> body) {
        String prompt = body.getOrDefault("prompt", "");
        String summary = geminiService.generateContent(prompt);
        return ResponseEntity.ok(Map.of("summary", summary));
    }
} 