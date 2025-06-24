package org.genai.knowledgebase.llm;

/**
 * Data Transfer Object (DTO) for sending Q&A requests to the Ollama API.
 *
 * <p>
 * Contains the user's question and the context (e.g., concatenated notes/snippets)
 * to provide relevant information for the LLM to answer.
 * </p>
 */
public class OllamaRequest {
    /**
     * The user's question to be answered by the LLM.
     */
    private String question;

    /**
     * The context (e.g., concatenated notes/snippets) to help the LLM generate a relevant answer.
     */
    private String context;

    // Constructors
    public OllamaRequest() {}
    public OllamaRequest(String question, String context) {
        this.question = question;
        this.context = context;
    }

    // Getters and setters
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }
} 