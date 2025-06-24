package org.genai.knowledgebase.llm.gemini;

import java.util.List;

/**
 * DTO for sending requests to the Gemini API.
 *
 * <p>
 * The request contains a list of contents, each with a list of parts (text segments).
 * </p>
 */
public class GeminiRequest {
    private List<Content> contents;

    public GeminiRequest() {}
    public GeminiRequest(List<Content> contents) {
        this.contents = contents;
    }

    public List<Content> getContents() { return contents; }
    public void setContents(List<Content> contents) { this.contents = contents; }

    /**
     * Inner class representing a content block for Gemini.
     */
    public static class Content {
        private List<Part> parts;
        public Content() {}
        public Content(List<Part> parts) { this.parts = parts; }
        public List<Part> getParts() { return parts; }
        public void setParts(List<Part> parts) { this.parts = parts; }
    }

    /**
     * Inner class representing a part (text segment) for Gemini.
     */
    public static class Part {
        private String text;
        public Part() {}
        public Part(String text) { this.text = text; }
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
    }
} 