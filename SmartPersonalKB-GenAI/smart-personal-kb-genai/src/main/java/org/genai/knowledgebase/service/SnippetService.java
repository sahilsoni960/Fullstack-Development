package org.genai.knowledgebase.service;

import org.genai.knowledgebase.dto.SnippetDto;
import java.util.List;

/**
 * Service interface for managing code snippets.
 *
 * <p>
 * Defines the contract for business logic related to Snippet entities, including CRUD operations.
 * Implementations of this interface handle the interaction between controllers and repositories.
 * </p>
 */
public interface SnippetService {
    /**
     * Create a new snippet.
     * @param snippetDto Data for the new snippet
     * @return The created snippet as a DTO
     */
    SnippetDto createSnippet(SnippetDto snippetDto);

    /**
     * Retrieve all snippets.
     * @return List of all snippets as DTOs
     */
    List<SnippetDto> getAllSnippets();

    /**
     * Retrieve a snippet by its ID.
     * @param id The ID of the snippet
     * @return The snippet as a DTO, or null if not found
     */
    SnippetDto getSnippetById(Long id);

    /**
     * Update an existing snippet.
     * @param id The ID of the snippet to update
     * @param snippetDto Updated snippet data
     * @return The updated snippet as a DTO
     */
    SnippetDto updateSnippet(Long id, SnippetDto snippetDto);

    /**
     * Delete a snippet by its ID.
     * @param id The ID of the snippet to delete
     */
    void deleteSnippet(Long id);

    /**
     * Search snippets by keyword (in title/code/language) and/or tag.
     * @param query the keyword to search for (nullable)
     * @param tag the tag to filter by (nullable)
     * @return list of matching snippets as DTOs
     */
    List<SnippetDto> searchSnippets(String query, String tag);
} 