package org.genai.knowledgebase.service;

import org.genai.knowledgebase.dto.DocumentDto;
import java.util.List;

/**
 * Service interface for managing documents.
 *
 * <p>
 * Defines the contract for business logic related to Document entities, including CRUD operations.
 * Implementations of this interface handle the interaction between controllers and repositories.
 * </p>
 */
public interface DocumentService {
    /**
     * Create a new document.
     * @param documentDto Data for the new document
     * @return The created document as a DTO
     */
    DocumentDto createDocument(DocumentDto documentDto);

    /**
     * Retrieve all documents.
     * @return List of all documents as DTOs
     */
    List<DocumentDto> getAllDocuments();

    /**
     * Retrieve a document by its ID.
     * @param id The ID of the document
     * @return The document as a DTO, or null if not found
     */
    DocumentDto getDocumentById(Long id);

    /**
     * Update an existing document.
     * @param id The ID of the document to update
     * @param documentDto Updated document data
     * @return The updated document as a DTO
     */
    DocumentDto updateDocument(Long id, DocumentDto documentDto);

    /**
     * Delete a document by its ID.
     * @param id The ID of the document to delete
     */
    void deleteDocument(Long id);

    /**
     * Search documents by keyword (in title/filePath) and/or tag.
     * @param query the keyword to search for (nullable)
     * @param tag the tag to filter by (nullable)
     * @return list of matching documents as DTOs
     */
    List<DocumentDto> searchDocuments(String query, String tag);
} 