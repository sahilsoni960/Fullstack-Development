package org.genai.knowledgebase.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * JPA entity representing a personal note in the knowledge base.
 *
 * <p>
 * Each Note contains a title, content, a set of tags, and timestamps for creation and last update.
 * This entity is mapped to a database table by JPA/Hibernate.
 * </p>
 */
@Entity
@Table(name = "notes")
public class Note {
    /**
     * Unique identifier for the note (primary key).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Title of the note. Should be concise and descriptive.
     */
    @Column(nullable = false)
    private String title;

    /**
     * Main content/body of the note.
     */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    /**
     * Set of tags associated with the note for categorization and search.
     */
    @ElementCollection
    @CollectionTable(name = "note_tags", joinColumns = @JoinColumn(name = "note_id"))
    @Column(name = "tag")
    private Set<String> tags;

    /**
     * Timestamp when the note was created.
     */
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when the note was last updated.
     */
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Constructors, getters, setters, and lifecycle callbacks

    public Note() {}

    public Note(String title, String content, Set<String> tags) {
        this.title = title;
        this.content = content;
        this.tags = tags;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and setters omitted for brevity, but should be included in production code

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Set<String> getTags() { return tags; }
    public void setTags(Set<String> tags) { this.tags = tags; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
} 