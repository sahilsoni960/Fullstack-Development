package org.genai.knowledgebase.dto;

import java.util.Set;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object (DTO) for transferring Snippet data between client and server.
 *
 * <p>
 * This class is used in API requests and responses to decouple the internal Snippet entity
 * from the external API contract. It contains only the fields relevant for the API.
 * </p>
 */
public class SnippetDto {
    /**
     * Unique identifier for the snippet (may be null for new snippets).
     */
    private Long id;

    /**
     * Title of the snippet. Must not be blank and must be between 3 and 100 characters.
     */
    @NotBlank(message = "Title is required.")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters.")
    private String title;

    /**
     * The actual code of the snippet. Must not be blank.
     */
    @NotBlank(message = "Code is required.")
    private String code;

    /**
     * Programming language of the snippet. Must not be blank.
     */
    @NotBlank(message = "Language is required.")
    private String language;

    /**
     * Set of tags associated with the snippet.
     */
    private Set<String> tags;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
    public Set<String> getTags() { return tags; }
    public void setTags(Set<String> tags) { this.tags = tags; }
} 