package org.genai.knowledgebase.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * JPA entity representing a code snippet in the knowledge base.
 *
 * <p>
 * Each Snippet contains a title, code, programming language, a set of tags, and timestamps for creation and last update.
 * This entity is mapped to a database table by JPA/Hibernate.
 * </p>
 */
@Entity
@Table(name = "snippets")
public class Snippet {
    /**
     * Unique identifier for the snippet (primary key).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Title of the snippet. Should be concise and descriptive.
     */
    @Column(nullable = false)
    private String title;

    /**
     * The actual code of the snippet.
     */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String code;

    /**
     * Programming language of the snippet (e.g., Java, Python).
     */
    @Column(nullable = false)
    private String language;

    /**
     * Set of tags associated with the snippet for categorization and search.
     */
    @ElementCollection
    @CollectionTable(name = "snippet_tags", joinColumns = @JoinColumn(name = "snippet_id"))
    @Column(name = "tag")
    private Set<String> tags;

    /**
     * Timestamp when the snippet was created.
     */
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when the snippet was last updated.
     */
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Constructors, getters, setters, and lifecycle callbacks

    public Snippet() {}

    public Snippet(String title, String code, String language, Set<String> tags) {
        this.title = title;
        this.code = code;
        this.language = language;
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
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
} 