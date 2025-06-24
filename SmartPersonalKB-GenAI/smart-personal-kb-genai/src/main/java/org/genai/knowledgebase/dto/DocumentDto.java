package org.genai.knowledgebase.dto;

import java.util.Set;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object (DTO) for transferring Document data between client and server.
 *
 * <p>
 * This class is used in API requests and responses to decouple the internal Document entity
 * from the external API contract. It contains only the fields relevant for the API.
 * </p>
 */
public class DocumentDto {
    /**
     * Unique identifier for the document (may be null for new documents).
     */
    private Long id;

    /**
     * Title of the document. Must not be blank and must be between 3 and 100 characters.
     */
    @NotBlank(message = "Title is required.")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters.")
    private String title;

    /**
     * File path of the document. Must not be blank.
     */
    @NotBlank(message = "File path is required.")
    private String filePath;

    /**
     * Set of tags associated with the document.
     */
    private Set<String> tags;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public Set<String> getTags() { return tags; }
    public void setTags(Set<String> tags) { this.tags = tags; }
} 