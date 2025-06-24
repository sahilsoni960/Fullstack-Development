package org.genai.knowledgebase.llm.gemini;

import java.util.List;

/**
 * DTO for receiving responses from the Gemini API.
 *
 * <p>
 * The response contains a list of candidates, each with a content (which has a list of parts, each with text).
 * </p>
 */
public class GeminiResponse {
    private List<Candidate> candidates;

    public GeminiResponse() {}
    public GeminiResponse(List<Candidate> candidates) { this.candidates = candidates; }
    public List<Candidate> getCandidates() { return candidates; }
    public void setCandidates(List<Candidate> candidates) { this.candidates = candidates; }

    /**
     * Inner class representing a candidate answer from Gemini.
     */
    public static class Candidate {
        private Content content;
        public Candidate() {}
        public Candidate(Content content) { this.content = content; }
        public Content getContent() { return content; }
        public void setContent(Content content) { this.content = content; }
    }

    /**
     * Inner class representing the content of a candidate.
     */
    public static class Content {
        private List<Part> parts;
        public Content() {}
        public Content(List<Part> parts) { this.parts = parts; }
        public List<Part> getParts() { return parts; }
        public void setParts(List<Part> parts) { this.parts = parts; }
    }

    /**
     * Inner class representing a part (text segment) in the response.
     */
    public static class Part {
        private String text;
        public Part() {}
        public Part(String text) { this.text = text; }
        public String getText() { return text; }
        public void setText(String text) { this.text = text; }
    }
} 