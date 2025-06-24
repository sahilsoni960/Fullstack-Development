package org.genai.knowledgebase.service;

import org.genai.knowledgebase.dto.NoteDto;
import java.util.List;

/**
 * Service interface for managing notes.
 *
 * <p>
 * Defines the contract for business logic related to Note entities, including CRUD operations.
 * Implementations of this interface handle the interaction between controllers and repositories.
 * </p>
 */
public interface NoteService {
    /**
     * Create a new note.
     * @param noteDto Data for the new note
     * @return The created note as a DTO
     */
    NoteDto createNote(NoteDto noteDto);

    /**
     * Retrieve all notes.
     * @return List of all notes as DTOs
     */
    List<NoteDto> getAllNotes();

    /**
     * Retrieve a note by its ID.
     * @param id The ID of the note
     * @return The note as a DTO, or null if not found
     */
    NoteDto getNoteById(Long id);

    /**
     * Update an existing note.
     * @param id The ID of the note to update
     * @param noteDto Updated note data
     * @return The updated note as a DTO
     */
    NoteDto updateNote(Long id, NoteDto noteDto);

    /**
     * Delete a note by its ID.
     * @param id The ID of the note to delete
     */
    void deleteNote(Long id);

    /**
     * Search notes by keyword (in title/content) and/or tag.
     * @param query the keyword to search for (nullable)
     * @param tag the tag to filter by (nullable)
     * @return list of matching notes as DTOs
     */
    List<NoteDto> searchNotes(String query, String tag);
} 