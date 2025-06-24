package org.genai.knowledgebase;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.cache.annotation.EnableCaching;

/**
 * Main entry point for the Smart Personal Knowledge Base with Generative AI application.
 *
 * <p>
 * This class bootstraps the Spring Boot application. It is responsible for:
 * <ul>
 *   <li>Launching the embedded web server (Tomcat by default)</li>
 *   <li>Scanning for Spring components (controllers, services, repositories, etc.)</li>
 *   <li>Loading application configuration and initializing beans</li>
 *   <li>Enabling scheduling for periodic tasks (e.g., summarization, reminders)</li>
 *   <li>Enabling caching for repeated LLM queries and other expensive operations</li>
 * </ul>
 *
 * <p>
 * The @SpringBootApplication annotation enables component scanning, auto-configuration,
 * and allows this class to serve as the configuration root for the application.
 *
 * <p>
 * The @EnableScheduling annotation enables Spring's scheduled task execution capability.
 *
 * <p>
 * The @EnableCaching annotation enables Spring's caching abstraction for performance optimization.
 *
 * <p>
 * To run the application, execute the main method. The application will start and listen
 * for HTTP requests as defined by the REST controllers.
 */
@SpringBootApplication
@EnableScheduling
@EnableCaching
public class SmartPersonalKbGenAiApplication {
    /**
     * Main method to launch the Spring Boot application.
     * @param args command-line arguments (not used)
     */
    public static void main(String[] args) {
        SpringApplication.run(SmartPersonalKbGenAiApplication.class, args);
    }
} 