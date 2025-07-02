package org.genai.knowledgebase.controller;

import org.genai.knowledgebase.llm.gemini.GeminiService;
import org.genai.knowledgebase.service.ContextRetrievalService;
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
    private final ContextRetrievalService contextRetrievalService;

    /**
     * Constructor-based dependency injection of GeminiService and ContextRetrievalService.
     * @param geminiService the service for LLM Q&A and summarization
     * @param contextRetrievalService the service for retrieving relevant context
     */
    @Autowired
    public LLMController(GeminiService geminiService, ContextRetrievalService contextRetrievalService) {
        this.geminiService = geminiService;
        this.contextRetrievalService = contextRetrievalService;
    }

    /**
     * Ask a question to the LLM (Gemini).
     * @param body JSON with a 'prompt' field (the question)
     * @return the generated answer from Gemini
     */
    @PostMapping("/ask")
    public ResponseEntity<Map<String, String>> askQuestion(@RequestBody Map<String, String> body) {
        System.out.println("LLMController /ask endpoint called");
        String prompt = body.getOrDefault("prompt", "");
        String context = contextRetrievalService.getRelevantContext(prompt);
        // Improved prompt formatting for RAG
        StringBuilder fullPrompt = new StringBuilder();
        fullPrompt.append("You are a personal knowledge assistant. Use the following user notes, code snippets, and documents as context to answer the user's question.\n");
        fullPrompt.append("Always answer using the provided context if possible. If the answer is not in the context, say 'I don't know based on your notes.'\n\n");
        fullPrompt.append("[CONTEXT START]\n");
        fullPrompt.append(context);
        fullPrompt.append("[CONTEXT END]\n\n");
        fullPrompt.append("User question: ").append(prompt).append("\nAnswer:");
        // Log the prompt for debugging
        System.out.println("[RAG Prompt for LLM]:\n" + fullPrompt);
        String answer = geminiService.generateContent(fullPrompt.toString());
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