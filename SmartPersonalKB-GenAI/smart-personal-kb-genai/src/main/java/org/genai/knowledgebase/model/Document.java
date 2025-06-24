package org.genai.knowledgebase.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * JPA entity representing a document reference in the knowledge base.
 *
 * <p>
 * Each Document contains a title, a file path, a set of tags, and timestamps for creation and last update.
 * This entity is mapped to a database table by JPA/Hibernate.
 * </p>
 */
@Entity
@Table(name = "documents")
public class Document {
    /**
     * Unique identifier for the document (primary key).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Title of the document. Should be concise and descriptive.
     */
    @Column(nullable = false)
    private String title;

    /**
     * File path of the document on the local system.
     */
    @Column(nullable = false)
    private String filePath;

    /**
     * Set of tags associated with the document for categorization and search.
     */
    @ElementCollection
    @CollectionTable(name = "document_tags", joinColumns = @JoinColumn(name = "document_id"))
    @Column(name = "tag")
    private Set<String> tags;

    /**
     * Timestamp when the document was created.
     */
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Timestamp when the document was last updated.
     */
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    // Constructors, getters, setters, and lifecycle callbacks

    public Document() {}

    public Document(String title, String filePath, Set<String> tags) {
        this.title = title;
        this.filePath = filePath;
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
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public Set<String> getTags() { return tags; }
    public void setTags(Set<String> tags) { this.tags = tags; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
} 