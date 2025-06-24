package org.genai.knowledgebase.llm;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.cache.annotation.Cacheable;

/**
 * Service for interacting with the Ollama LLM REST API for Q&A.
 *
 * <p>
 * Sends user questions and context to the Ollama API and returns the generated answer.
 * </p>
 */
@Service
public class OllamaService {
    // The base URL for the Ollama API (configurable via application.properties)
    @Value("${ollama.api.url:http://localhost:11434/api/ask}")
    private String ollamaApiUrl;

    @Value("${ollama.api.summarize.url:http://localhost:11434/api/summarize}")
    private String ollamaSummarizeUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Sends a Q&A request to the Ollama API and returns the generated answer.
     * Results are cached to avoid redundant LLM calls for the same question/context.
     * @param request the user's question and context
     * @return the generated answer from the LLM
     */
    @Cacheable(value = "llmQaCache", key = "#request.question + '|' + #request.context")
    public OllamaResponse askQuestion(OllamaRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<OllamaRequest> entity = new HttpEntity<>(request, headers);
        // For now, assume Ollama returns { "answer": "..." }
        return restTemplate.postForObject(ollamaApiUrl, entity, OllamaResponse.class);
    }

    /**
     * Sends a summarization request to the Ollama API and returns the generated summary.
     * Results are cached to avoid redundant LLM calls for the same context.
     * @param request the context to summarize
     * @return the generated summary from the LLM
     */
    @Cacheable(value = "llmSummaryCache", key = "#request.context")
    public OllamaResponse summarize(OllamaRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<OllamaRequest> entity = new HttpEntity<>(request, headers);
        // For now, assume Ollama returns { "answer": "..." } as the summary
        return restTemplate.postForObject(ollamaSummarizeUrl, entity, OllamaResponse.class);
    }
} 