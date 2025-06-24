package org.genai.knowledgebase.dto;

import java.util.Set;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object (DTO) for transferring Note data between client and server.
 *
 * <p>
 * This class is used in API requests and responses to decouple the internal Note entity
 * from the external API contract. It contains only the fields relevant for the API.
 * </p>
 */
public class NoteDto {
    /**
     * Unique identifier for the note (may be null for new notes).
     */
    private Long id;

    /**
     * Title of the note.
     * Must not be blank and must be between 3 and 100 characters.
     */
    @NotBlank(message = "Title is required.")
    @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters.")
    private String title;

    /**
     * Main content/body of the note.
     * Must not be blank.
     */
    @NotBlank(message = "Content is required.")
    private String content;

    /**
     * Set of tags associated with the note.
     */
    private Set<String> tags;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Set<String> getTags() { return tags; }
    public void setTags(Set<String> tags) { this.tags = tags; }
} 