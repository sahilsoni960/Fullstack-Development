package org.genai.knowledgebase;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.genai.knowledgebase.dto.NoteDto;
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
 * Integration tests for NoteController.
 *
 * <p>
 * Verifies that the main endpoints for notes work as expected.
 * </p>
 */
@SpringBootTest
@AutoConfigureMockMvc
public class NoteControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Test creating a note via POST /api/notes.
     */
    @Test
    void testCreateNote() throws Exception {
        NoteDto note = new NoteDto();
        note.setTitle("Test Note");
        note.setContent("This is a test note.");
        note.setTags(Set.of("test", "integration"));

        mockMvc.perform(post("/api/notes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(note)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Note"));
    }

    /**
     * Test getting all notes via GET /api/notes.
     */
    @Test
    void testGetAllNotes() throws Exception {
        mockMvc.perform(get("/api/notes"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
    }
} 