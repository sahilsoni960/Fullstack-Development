package org.genai.knowledgebase;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.genai.knowledgebase.dto.SnippetDto;
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
 * Integration tests for SnippetController.
 *
 * <p>
 * Verifies that the main endpoints for snippets work as expected.
 * </p>
 */
@SpringBootTest
@AutoConfigureMockMvc
public class SnippetControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Test creating a snippet via POST /api/snippets.
     */
    @Test
    void testCreateSnippet() throws Exception {
        SnippetDto snippet = new SnippetDto();
        snippet.setTitle("Test Snippet");
        snippet.setCode("System.out.println(\"Hello\");");
        snippet.setLanguage("Java");
        snippet.setTags(Set.of("test", "integration"));

        mockMvc.perform(post("/api/snippets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(snippet)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Snippet"));
    }

    /**
     * Test getting all snippets via GET /api/snippets.
     */
    @Test
    void testGetAllSnippets() throws Exception {
        mockMvc.perform(get("/api/snippets"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
} 