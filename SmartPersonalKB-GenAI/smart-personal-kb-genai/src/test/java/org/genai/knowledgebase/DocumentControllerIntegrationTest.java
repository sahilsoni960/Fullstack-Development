package org.genai.knowledgebase;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.genai.knowledgebase.dto.DocumentDto;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Set;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for DocumentController.
 *
 * <p>
 * Verifies that the main endpoints for documents work as expected.
 * </p>
 */
@SpringBootTest
@AutoConfigureMockMvc
public class DocumentControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Test creating a document via POST /api/documents.
     */
    @Test
    void testCreateDocument() throws Exception {
        DocumentDto doc = new DocumentDto();
        doc.setTitle("Test Document");
        doc.setFilePath("/tmp/test.txt");
        doc.setTags(Set.of("test", "integration"));

        mockMvc.perform(post("/api/documents")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(doc)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Document"));
    }

    /**
     * Test getting all documents via GET /api/documents.
     */
    @Test
    void testGetAllDocuments() throws Exception {
        mockMvc.perform(get("/api/documents"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
} 