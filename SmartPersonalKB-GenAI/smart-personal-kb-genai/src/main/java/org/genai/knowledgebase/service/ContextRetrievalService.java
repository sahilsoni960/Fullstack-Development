package org.genai.knowledgebase.service;

import org.genai.knowledgebase.dto.NoteDto;
import org.genai.knowledgebase.dto.SnippetDto;
import org.genai.knowledgebase.dto.DocumentDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service to retrieve relevant notes, snippets, and documents for a query and format them for LLM context.
 */
@Service
public class ContextRetrievalService {
    private final NoteService noteService;
    private final SnippetService snippetService;
    private final DocumentService documentService;
    private static final int TOP_N = 3; // Number of top results from each type

    @Autowired
    public ContextRetrievalService(NoteService noteService, SnippetService snippetService, DocumentService documentService) {
        this.noteService = noteService;
        this.snippetService = snippetService;
        this.documentService = documentService;
    }

    /**
     * Retrieves relevant notes, snippets, and documents for the given query and returns a formatted string.
     * @param query The user query
     * @return Formatted context string
     */
    public String getRelevantContext(String query) {
        List<NoteDto> notes = noteService.getAllNotes();
        List<SnippetDto> snippets = snippetService.getAllSnippets();
        List<DocumentDto> documents = documentService.getAllDocuments();

        StringBuilder context = new StringBuilder();
        if (!notes.isEmpty()) {
            context.append("Notes:\n");
            for (NoteDto note : notes) {
                context.append("- Title: ").append(note.getTitle()).append("\n  Content: ").append(note.getContent()).append("\n");
            }
            context.append("\n");
        }
        if (!snippets.isEmpty()) {
            context.append("Snippets:\n");
            for (SnippetDto snippet : snippets) {
                context.append("- Title: ").append(snippet.getTitle())
                       .append(" (Language: ").append(snippet.getLanguage()).append(")\n  Code: ")
                       .append(snippet.getCode()).append("\n");
            }
            context.append("\n");
        }
        if (!documents.isEmpty()) {
            context.append("Documents:\n");
            for (DocumentDto doc : documents) {
                context.append("- Title: ").append(doc.getTitle())
                       .append("\n  File Path: ").append(doc.getFilePath()).append("\n");
            }
            context.append("\n");
        }
        return context.toString();
    }
} 