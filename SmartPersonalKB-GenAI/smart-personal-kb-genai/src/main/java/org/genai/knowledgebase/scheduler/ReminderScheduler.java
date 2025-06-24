package org.genai.knowledgebase.scheduler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduled task for sending daily reminders.
 *
 * <p>
 * This scheduler logs a reminder message every day at 9 AM. In a real application, this could be extended
 * to send emails, push notifications, or other types of reminders.
 * </p>
 */
@Component
public class ReminderScheduler {
    private static final Logger logger = LoggerFactory.getLogger(ReminderScheduler.class);

    /**
     * Logs a reminder message every day at 9 AM (cron: 0 0 9 * * *).
     */
    @Scheduled(cron = "0 0 9 * * *")
    public void sendDailyReminder() {
        logger.info("[ReminderScheduler] This is your daily reminder! (Extend this to send real notifications.)");
    }
} 