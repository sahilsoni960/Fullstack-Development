package org.genai.knowledgebase.repository;

import org.genai.knowledgebase.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for managing Document entities in the database.
 *
 * <p>
 * Extends JpaRepository to provide CRUD operations and query methods for the Document entity.
 * Spring Data JPA will automatically generate the implementation at runtime.
 * </p>
 *
 * <p>
 * You can define custom query methods here by following Spring Data naming conventions.
 * </p>
 */
@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    /**
     * Find documents containing the keyword in title or filePath (case-insensitive).
     * @param keyword the keyword to search for
     * @return list of matching documents
     */
    List<Document> findByTitleContainingIgnoreCaseOrFilePathContainingIgnoreCase(String keyword1, String keyword2);

    /**
     * Find documents by tag.
     * @param tag the tag to filter by
     * @return list of documents with the given tag
     */
    List<Document> findByTagsContaining(String tag);

    // Additional custom query methods can be defined here if needed
} 