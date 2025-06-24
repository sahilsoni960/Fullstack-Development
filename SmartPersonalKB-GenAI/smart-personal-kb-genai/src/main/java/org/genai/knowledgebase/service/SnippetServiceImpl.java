package org.genai.knowledgebase.service;

import org.genai.knowledgebase.dto.SnippetDto;
import org.genai.knowledgebase.model.Snippet;
import org.genai.knowledgebase.repository.SnippetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of the SnippetService interface.
 *
 * <p>
 * Handles business logic for creating, retrieving, updating, and deleting code snippets.
 * Maps between Snippet entities and SnippetDto objects for API communication.
 * </p>
 */
@Service
public class SnippetServiceImpl implements SnippetService {
    private final SnippetRepository snippetRepository;

    /**
     * Constructor-based dependency injection of SnippetRepository.
     * @param snippetRepository the repository for Snippet entities
     */
    @Autowired
    public SnippetServiceImpl(SnippetRepository snippetRepository) {
        this.snippetRepository = snippetRepository;
    }

    /**
     * Create a new snippet from a SnippetDto.
     * @param snippetDto Data for the new snippet
     * @return The created snippet as a DTO
     */
    @Override
    public SnippetDto createSnippet(SnippetDto snippetDto) {
        Snippet snippet = mapToEntity(snippetDto);
        Snippet saved = snippetRepository.save(snippet);
        return mapToDto(saved);
    }

    /**
     * Retrieve all snippets as DTOs.
     * @return List of all snippets as DTOs
     */
    @Override
    public List<SnippetDto> getAllSnippets() {
        return snippetRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Retrieve a snippet by its ID.
     * @param id The ID of the snippet
     * @return The snippet as a DTO, or throws if not found
     */
    @Override
    public SnippetDto getSnippetById(Long id) {
        Snippet snippet = snippetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Snippet not found with id: " + id));
        return mapToDto(snippet);
    }

    /**
     * Update an existing snippet.
     * @param id The ID of the snippet to update
     * @param snippetDto Updated snippet data
     * @return The updated snippet as a DTO
     */
    @Override
    public SnippetDto updateSnippet(Long id, SnippetDto snippetDto) {
        Snippet snippet = snippetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Snippet not found with id: " + id));
        snippet.setTitle(snippetDto.getTitle());
        snippet.setCode(snippetDto.getCode());
        snippet.setLanguage(snippetDto.getLanguage());
        snippet.setTags(snippetDto.getTags());
        Snippet updated = snippetRepository.save(snippet);
        return mapToDto(updated);
    }

    /**
     * Delete a snippet by its ID.
     * @param id The ID of the snippet to delete
     */
    @Override
    public void deleteSnippet(Long id) {
        if (!snippetRepository.existsById(id)) {
            throw new IllegalArgumentException("Snippet not found with id: " + id);
        }
        snippetRepository.deleteById(id);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<SnippetDto> searchSnippets(String query, String tag) {
        List<Snippet> snippets;
        if (query != null && !query.isEmpty() && tag != null && !tag.isEmpty()) {
            // Both query and tag
            snippets = snippetRepository.findByTitleContainingIgnoreCaseOrCodeContainingIgnoreCaseOrLanguageContainingIgnoreCase(query, query, query)
                .stream().filter(s -> s.getTags() != null && s.getTags().contains(tag)).collect(java.util.stream.Collectors.toList());
        } else if (query != null && !query.isEmpty()) {
            snippets = snippetRepository.findByTitleContainingIgnoreCaseOrCodeContainingIgnoreCaseOrLanguageContainingIgnoreCase(query, query, query);
        } else if (tag != null && !tag.isEmpty()) {
            snippets = snippetRepository.findByTagsContaining(tag);
        } else {
            snippets = snippetRepository.findAll();
        }
        return snippets.stream().map(this::mapToDto).collect(java.util.stream.Collectors.toList());
    }

    /**
     * Map a Snippet entity to a SnippetDto.
     * @param snippet the Snippet entity
     * @return the corresponding SnippetDto
     */
    private SnippetDto mapToDto(Snippet snippet) {
        SnippetDto dto = new SnippetDto();
        dto.setId(snippet.getId());
        dto.setTitle(snippet.getTitle());
        dto.setCode(snippet.getCode());
        dto.setLanguage(snippet.getLanguage());
        dto.setTags(snippet.getTags());
        return dto;
    }

    /**
     * Map a SnippetDto to a Snippet entity.
     * @param dto the SnippetDto
     * @return the corresponding Snippet entity
     */
    private Snippet mapToEntity(SnippetDto dto) {
        return new Snippet(dto.getTitle(), dto.getCode(), dto.getLanguage(), dto.getTags());
    }
} 