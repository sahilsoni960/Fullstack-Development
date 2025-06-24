package org.genai.knowledgebase.service;

import org.genai.knowledgebase.dto.DocumentDto;
import org.genai.knowledgebase.model.Document;
import org.genai.knowledgebase.repository.DocumentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of the DocumentService interface.
 *
 * <p>
 * Handles business logic for creating, retrieving, updating, and deleting documents.
 * Maps between Document entities and DocumentDto objects for API communication.
 * </p>
 */
@Service
public class DocumentServiceImpl implements DocumentService {
    private final DocumentRepository documentRepository;

    /**
     * Constructor-based dependency injection of DocumentRepository.
     * @param documentRepository the repository for Document entities
     */
    @Autowired
    public DocumentServiceImpl(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
    }

    /**
     * Create a new document from a DocumentDto.
     * @param documentDto Data for the new document
     * @return The created document as a DTO
     */
    @Override
    public DocumentDto createDocument(DocumentDto documentDto) {
        Document document = mapToEntity(documentDto);
        Document saved = documentRepository.save(document);
        return mapToDto(saved);
    }

    /**
     * Retrieve all documents as DTOs.
     * @return List of all documents as DTOs
     */
    @Override
    public List<DocumentDto> getAllDocuments() {
        return documentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Retrieve a document by its ID.
     * @param id The ID of the document
     * @return The document as a DTO, or throws if not found
     */
    @Override
    public DocumentDto getDocumentById(Long id) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Document not found with id: " + id));
        return mapToDto(document);
    }

    /**
     * Update an existing document.
     * @param id The ID of the document to update
     * @param documentDto Updated document data
     * @return The updated document as a DTO
     */
    @Override
    public DocumentDto updateDocument(Long id, DocumentDto documentDto) {
        Document document = documentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Document not found with id: " + id));
        document.setTitle(documentDto.getTitle());
        document.setFilePath(documentDto.getFilePath());
        document.setTags(documentDto.getTags());
        Document updated = documentRepository.save(document);
        return mapToDto(updated);
    }

    /**
     * Delete a document by its ID.
     * @param id The ID of the document to delete
     */
    @Override
    public void deleteDocument(Long id) {
        if (!documentRepository.existsById(id)) {
            throw new IllegalArgumentException("Document not found with id: " + id);
        }
        documentRepository.deleteById(id);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<DocumentDto> searchDocuments(String query, String tag) {
        List<Document> documents;
        if (query != null && !query.isEmpty() && tag != null && !tag.isEmpty()) {
            // Both query and tag
            documents = documentRepository.findByTitleContainingIgnoreCaseOrFilePathContainingIgnoreCase(query, query)
                .stream().filter(d -> d.getTags() != null && d.getTags().contains(tag)).collect(java.util.stream.Collectors.toList());
        } else if (query != null && !query.isEmpty()) {
            documents = documentRepository.findByTitleContainingIgnoreCaseOrFilePathContainingIgnoreCase(query, query);
        } else if (tag != null && !tag.isEmpty()) {
            documents = documentRepository.findByTagsContaining(tag);
        } else {
            documents = documentRepository.findAll();
        }
        return documents.stream().map(this::mapToDto).collect(java.util.stream.Collectors.toList());
    }

    /**
     * Map a Document entity to a DocumentDto.
     * @param document the Document entity
     * @return the corresponding DocumentDto
     */
    private DocumentDto mapToDto(Document document) {
        DocumentDto dto = new DocumentDto();
        dto.setId(document.getId());
        dto.setTitle(document.getTitle());
        dto.setFilePath(document.getFilePath());
        dto.setTags(document.getTags());
        return dto;
    }

    /**
     * Map a DocumentDto to a Document entity.
     * @param dto the DocumentDto
     * @return the corresponding Document entity
     */
    private Document mapToEntity(DocumentDto dto) {
        return new Document(dto.getTitle(), dto.getFilePath(), dto.getTags());
    }
} 