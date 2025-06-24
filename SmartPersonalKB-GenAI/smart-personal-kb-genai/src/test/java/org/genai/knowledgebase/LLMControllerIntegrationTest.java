package org.genai.knowledgebase;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.genai.knowledgebase.llm.OllamaRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integration test for LLMController.
 *
 * <p>
 * Verifies that the /api/ask endpoint is reachable and responds.
 * </p>
 */
@SpringBootTest
@AutoConfigureMockMvc
public class LLMControllerIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    /**
     * Test the /api/ask endpoint with a mock request.
     */
    @Test
    void testAskEndpoint() throws Exception {
        OllamaRequest req = new OllamaRequest("What is Java?", "Java is a programming language.");
        mockMvc.perform(post("/api/ask")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }
} 