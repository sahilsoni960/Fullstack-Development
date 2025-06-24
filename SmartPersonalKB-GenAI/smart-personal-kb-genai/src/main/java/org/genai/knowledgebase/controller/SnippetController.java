package org.genai.knowledgebase.controller;

import org.genai.knowledgebase.dto.SnippetDto;
import org.genai.knowledgebase.service.SnippetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

/**
 * REST controller for managing code snippets.
 *
 * <p>
 * Exposes endpoints for creating, retrieving, updating, and deleting snippets via HTTP.
 * Uses SnippetService for business logic and SnippetDto for data transfer.
 * </p>
 */
@RestController
@RequestMapping("/api/snippets")
public class SnippetController {
    private final SnippetService snippetService;

    /**
     * Constructor-based dependency injection of SnippetService.
     * @param snippetService the service for snippet operations
     */
    @Autowired
    public SnippetController(SnippetService snippetService) {
        this.snippetService = snippetService;
    }

    /**
     * Create a new snippet.
     * @param snippetDto the snippet data
     * @return the created snippet
     */
    @PostMapping
    public ResponseEntity<SnippetDto> createSnippet(@RequestBody @Valid SnippetDto snippetDto) {
        SnippetDto created = snippetService.createSnippet(snippetDto);
        return ResponseEntity.ok(created);
    }

    /**
     * Search or list snippets by keyword and/or tag.
     * @param query the keyword to search for (optional)
     * @param tag the tag to filter by (optional)
     * @return list of matching snippets
     */
    @GetMapping
    public ResponseEntity<List<SnippetDto>> searchSnippets(@RequestParam(required = false) String query,
                                                         @RequestParam(required = false) String tag) {
        if ((query != null && !query.isEmpty()) || (tag != null && !tag.isEmpty())) {
            return ResponseEntity.ok(snippetService.searchSnippets(query, tag));
        } else {
            return ResponseEntity.ok(snippetService.getAllSnippets());
        }
    }

    /**
     * Get a snippet by ID.
     * @param id the snippet ID
     * @return the snippet
     */
    @GetMapping("/{id}")
    public ResponseEntity<SnippetDto> getSnippetById(@PathVariable Long id) {
        return ResponseEntity.ok(snippetService.getSnippetById(id));
    }

    /**
     * Update a snippet by ID.
     * @param id the snippet ID
     * @param snippetDto updated snippet data
     * @return the updated snippet
     */
    @PutMapping("/{id}")
    public ResponseEntity<SnippetDto> updateSnippet(@PathVariable Long id, @RequestBody @Valid SnippetDto snippetDto) {
        return ResponseEntity.ok(snippetService.updateSnippet(id, snippetDto));
    }

    /**
     * Delete a snippet by ID.
     * @param id the snippet ID
     * @return no content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSnippet(@PathVariable Long id) {
        snippetService.deleteSnippet(id);
        return ResponseEntity.noContent().build();
    }
} 