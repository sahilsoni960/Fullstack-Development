package org.genai.knowledgebase.controller;

import org.genai.knowledgebase.dto.DocumentDto;
import org.genai.knowledgebase.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

/**
 * REST controller for managing documents.
 *
 * <p>
 * Exposes endpoints for creating, retrieving, updating, and deleting documents via HTTP.
 * Uses DocumentService for business logic and DocumentDto for data transfer.
 * </p>
 */
@RestController
@RequestMapping("/api/documents")
public class DocumentController {
    private final DocumentService documentService;

    /**
     * Constructor-based dependency injection of DocumentService.
     * @param documentService the service for document operations
     */
    @Autowired
    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    /**
     * Create a new document.
     * @param documentDto the document data
     * @return the created document
     */
    @PostMapping
    public ResponseEntity<DocumentDto> createDocument(@RequestBody @Valid DocumentDto documentDto) {
        DocumentDto created = documentService.createDocument(documentDto);
        return ResponseEntity.ok(created);
    }

    /**
     * Search or list documents by keyword and/or tag.
     * @param query the keyword to search for (optional)
     * @param tag the tag to filter by (optional)
     * @return list of matching documents
     */
    @GetMapping
    public ResponseEntity<List<DocumentDto>> searchDocuments(@RequestParam(required = false) String query,
                                                           @RequestParam(required = false) String tag) {
        if ((query != null && !query.isEmpty()) || (tag != null && !tag.isEmpty())) {
            return ResponseEntity.ok(documentService.searchDocuments(query, tag));
        } else {
            return ResponseEntity.ok(documentService.getAllDocuments());
        }
    }

    /**
     * Get a document by ID.
     * @param id the document ID
     * @return the document
     */
    @GetMapping("/{id}")
    public ResponseEntity<DocumentDto> getDocumentById(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.getDocumentById(id));
    }

    /**
     * Update a document by ID.
     * @param id the document ID
     * @param documentDto updated document data
     * @return the updated document
     */
    @PutMapping("/{id}")
    public ResponseEntity<DocumentDto> updateDocument(@PathVariable Long id, @RequestBody @Valid DocumentDto documentDto) {
        return ResponseEntity.ok(documentService.updateDocument(id, documentDto));
    }

    /**
     * Delete a document by ID.
     * @param id the document ID
     * @return no content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
} 