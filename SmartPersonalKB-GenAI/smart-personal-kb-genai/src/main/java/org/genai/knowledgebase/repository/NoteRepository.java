package org.genai.knowledgebase.repository;

import org.genai.knowledgebase.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for managing Note entities in the database.
 *
 * <p>
 * Extends JpaRepository to provide CRUD operations and query methods for the Note entity.
 * Spring Data JPA will automatically generate the implementation at runtime.
 * </p>
 *
 * <p>
 * You can define custom query methods here by following Spring Data naming conventions.
 * </p>
 */
@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    /**
     * Find notes containing the keyword in title or content (case-insensitive).
     * @param keyword the keyword to search for
     * @return list of matching notes
     */
    List<Note> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(String keyword1, String keyword2);

    /**
     * Find notes by tag.
     * @param tag the tag to filter by
     * @return list of notes with the given tag
     */
    List<Note> findByTagsContaining(String tag);

    // Additional custom query methods can be defined here if needed
} 