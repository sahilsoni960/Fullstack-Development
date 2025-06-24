package org.genai.knowledgebase.scheduler;

import org.genai.knowledgebase.dto.NoteDto;
import org.genai.knowledgebase.llm.OllamaRequest;
import org.genai.knowledgebase.llm.OllamaResponse;
import org.genai.knowledgebase.llm.OllamaService;
import org.genai.knowledgebase.service.NoteService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Scheduled task for periodic summarization of all notes using the LLM.
 *
 * <p>
 * This scheduler fetches all notes, concatenates their content, sends it to the LLM summarization endpoint,
 * and logs the generated summary. Runs every 6 hours by default.
 * </p>
 */
@Component
public class SummarizationScheduler {
    private static final Logger logger = LoggerFactory.getLogger(SummarizationScheduler.class);
    private final NoteService noteService;
    private final OllamaService ollamaService;

    public SummarizationScheduler(NoteService noteService, OllamaService ollamaService) {
        this.noteService = noteService;
        this.ollamaService = ollamaService;
    }

    /**
     * Periodically summarizes all notes and logs the summary.
     * Runs every 6 hours (cron: 0 0 0,6,12,18 * * *).
     */
    @Scheduled(cron = "0 0 0,6,12,18 * * *")
    public void summarizeNotesPeriodically() {
        List<NoteDto> notes = noteService.getAllNotes();
        String context = notes.stream()
                .map(n -> n.getTitle() + ": " + n.getContent())
                .collect(Collectors.joining("\n"));
        if (context.isEmpty()) {
            logger.info("[SummarizationScheduler] No notes to summarize.");
            return;
        }
        OllamaRequest request = new OllamaRequest(null, context);
        OllamaResponse response = ollamaService.summarize(request);
        logger.info("[SummarizationScheduler] LLM Summary: {}", response.getAnswer());
    }
} 