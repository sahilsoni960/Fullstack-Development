package org.genai.knowledgebase.service;

import org.genai.knowledgebase.dto.NoteDto;
import org.genai.knowledgebase.model.Note;
import org.genai.knowledgebase.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of the NoteService interface.
 *
 * <p>
 * Handles business logic for creating, retrieving, updating, and deleting notes.
 * Maps between Note entities and NoteDto objects for API communication.
 * </p>
 */
@Service
public class NoteServiceImpl implements NoteService {
    private final NoteRepository noteRepository;

    /**
     * Constructor-based dependency injection of NoteRepository.
     * @param noteRepository the repository for Note entities
     */
    @Autowired
    public NoteServiceImpl(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    /**
     * Create a new note from a NoteDto.
     * @param noteDto Data for the new note
     * @return The created note as a DTO
     */
    @Override
    public NoteDto createNote(NoteDto noteDto) {
        Note note = mapToEntity(noteDto);
        Note saved = noteRepository.save(note);
        return mapToDto(saved);
    }

    /**
     * Retrieve all notes as DTOs.
     * @return List of all notes as DTOs
     */
    @Override
    public List<NoteDto> getAllNotes() {
        return noteRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Retrieve a note by its ID.
     * @param id The ID of the note
     * @return The note as a DTO, or throws if not found
     */
    @Override
    public NoteDto getNoteById(Long id) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Note not found with id: " + id));
        return mapToDto(note);
    }

    /**
     * Update an existing note.
     * @param id The ID of the note to update
     * @param noteDto Updated note data
     * @return The updated note as a DTO
     */
    @Override
    public NoteDto updateNote(Long id, NoteDto noteDto) {
        Note note = noteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Note not found with id: " + id));
        note.setTitle(noteDto.getTitle());
        note.setContent(noteDto.getContent());
        note.setTags(noteDto.getTags());
        Note updated = noteRepository.save(note);
        return mapToDto(updated);
    }

    /**
     * Delete a note by its ID.
     * @param id The ID of the note to delete
     */
    @Override
    public void deleteNote(Long id) {
        if (!noteRepository.existsById(id)) {
            throw new IllegalArgumentException("Note not found with id: " + id);
        }
        noteRepository.deleteById(id);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<NoteDto> searchNotes(String query, String tag) {
        List<Note> notes;
        if (query != null && !query.isEmpty() && tag != null && !tag.isEmpty()) {
            // Both query and tag
            notes = noteRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(query, query)
                .stream().filter(n -> n.getTags() != null && n.getTags().contains(tag)).collect(java.util.stream.Collectors.toList());
        } else if (query != null && !query.isEmpty()) {
            notes = noteRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(query, query);
        } else if (tag != null && !tag.isEmpty()) {
            notes = noteRepository.findByTagsContaining(tag);
        } else {
            notes = noteRepository.findAll();
        }
        return notes.stream().map(this::mapToDto).collect(java.util.stream.Collectors.toList());
    }

    /**
     * Map a Note entity to a NoteDto.
     * @param note the Note entity
     * @return the corresponding NoteDto
     */
    private NoteDto mapToDto(Note note) {
        NoteDto dto = new NoteDto();
        dto.setId(note.getId());
        dto.setTitle(note.getTitle());
        dto.setContent(note.getContent());
        dto.setTags(note.getTags());
        return dto;
    }

    /**
     * Map a NoteDto to a Note entity.
     * @param dto the NoteDto
     * @return the corresponding Note entity
     */
    private Note mapToEntity(NoteDto dto) {
        return new Note(dto.getTitle(), dto.getContent(), dto.getTags());
    }
} 