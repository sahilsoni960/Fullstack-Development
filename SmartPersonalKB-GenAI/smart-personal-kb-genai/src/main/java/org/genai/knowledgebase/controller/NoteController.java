package org.genai.knowledgebase.controller;

import org.genai.knowledgebase.dto.NoteDto;
import org.genai.knowledgebase.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

/**
 * REST controller for managing notes.
 *
 * <p>
 * Exposes endpoints for creating, retrieving, updating, and deleting notes via HTTP.
 * Uses NoteService for business logic and NoteDto for data transfer.
 * </p>
 */
@RestController
@RequestMapping("/api/notes")
public class NoteController {
    private final NoteService noteService;

    /**
     * Constructor-based dependency injection of NoteService.
     * @param noteService the service for note operations
     */
    @Autowired
    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    /**
     * Create a new note.
     * @param noteDto the note data
     * @return the created note
     */
    @PostMapping
    public ResponseEntity<NoteDto> createNote(@RequestBody @Valid NoteDto noteDto) {
        NoteDto created = noteService.createNote(noteDto);
        return ResponseEntity.ok(created);
    }

    /**
     * Search or list notes by keyword and/or tag.
     * @param query the keyword to search for (optional)
     * @param tag the tag to filter by (optional)
     * @return list of matching notes
     */
    @GetMapping
    public ResponseEntity<List<NoteDto>> searchNotes(@RequestParam(required = false) String query,
                                                    @RequestParam(required = false) String tag) {
        if ((query != null && !query.isEmpty()) || (tag != null && !tag.isEmpty())) {
            return ResponseEntity.ok(noteService.searchNotes(query, tag));
        } else {
            return ResponseEntity.ok(noteService.getAllNotes());
        }
    }

    /**
     * Get a note by ID.
     * @param id the note ID
     * @return the note
     */
    @GetMapping("/{id}")
    public ResponseEntity<NoteDto> getNoteById(@PathVariable Long id) {
        return ResponseEntity.ok(noteService.getNoteById(id));
    }

    /**
     * Update a note by ID.
     * @param id the note ID
     * @param noteDto updated note data
     * @return the updated note
     */
    @PutMapping("/{id}")
    public ResponseEntity<NoteDto> updateNote(@PathVariable Long id, @RequestBody @Valid NoteDto noteDto) {
        return ResponseEntity.ok(noteService.updateNote(id, noteDto));
    }

    /**
     * Delete a note by ID.
     * @param id the note ID
     * @return no content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable Long id) {
        noteService.deleteNote(id);
        return ResponseEntity.noContent().build();
    }
} 