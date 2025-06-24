package org.genai.knowledgebase.repository;

import org.genai.knowledgebase.model.Snippet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for managing Snippet entities in the database.
 *
 * <p>
 * Extends JpaRepository to provide CRUD operations and query methods for the Snippet entity.
 * Spring Data JPA will automatically generate the implementation at runtime.
 * </p>
 *
 * <p>
 * You can define custom query methods here by following Spring Data naming conventions.
 * </p>
 */
@Repository
public interface SnippetRepository extends JpaRepository<Snippet, Long> {
    /**
     * Find snippets containing the keyword in title, code, or language (case-insensitive).
     * @param keyword the keyword to search for
     * @return list of matching snippets
     */
    List<Snippet> findByTitleContainingIgnoreCaseOrCodeContainingIgnoreCaseOrLanguageContainingIgnoreCase(String keyword1, String keyword2, String keyword3);

    /**
     * Find snippets by tag.
     * @param tag the tag to filter by
     * @return list of snippets with the given tag
     */
    List<Snippet> findByTagsContaining(String tag);

    // Additional custom query methods can be defined here if needed
} 