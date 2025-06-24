package org.genai.knowledgebase.exception;

import java.time.LocalDateTime;

/**
 * Data Transfer Object (DTO) for structured API error responses.
 *
 * <p>
 * Contains details about the error, including timestamp, HTTP status, error type, message, and request path.
 * </p>
 */
public class ApiError {
    /**
     * The timestamp when the error occurred.
     */
    private LocalDateTime timestamp;

    /**
     * The HTTP status code (e.g., 400, 404, 500).
     */
    private int status;

    /**
     * The error type (e.g., "Bad Request", "Not Found").
     */
    private String error;

    /**
     * The detailed error message.
     */
    private String message;

    /**
     * The request path where the error occurred.
     */
    private String path;

    // Constructors
    public ApiError() {}
    public ApiError(LocalDateTime timestamp, int status, String error, String message, String path) {
        this.timestamp = timestamp;
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }

    // Getters and setters
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
    public String getError() { return error; }
    public void setError(String error) { this.error = error; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
} 