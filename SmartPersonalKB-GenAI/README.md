# Smart Personal Knowledge Base with Generative AI

## Project Overview
A modern Spring Boot application that allows users to store, organize, and search personal notes, code snippets, and documents. The system integrates with a local LLM (Ollama) to provide generative Q&A and summarization features based on the stored content.

## Goals
- Maximize use of Spring Boot concepts for hands-on learning.
- Integrate Generative AI (Ollama LLM) for Q&A and summarization.
- Keep resource usage minimal (runs on local machine, no paid tokens or cloud auth).
- Modular, extensible, and production-ready codebase.

## Key Features
- RESTful CRUD API for notes, snippets, and documents
- Search and filter notes
- Ask questions and get LLM-generated answers based on stored content
- Summarize notes using LLM
- Scheduling for periodic summarization or reminders
- Caching for repeated queries
- Profiles for dev/prod environments
- Monitoring with Spring Boot Actuator
- Robust validation and exception handling
- Unit and integration tests
- (Optional, later) WebSocket for real-time Q&A

## High-Level Design

### 1. **Architecture**
- **Backend:** Java, Spring Boot
- **Database:** H2 (dev), MySQL/Postgres (prod)
- **LLM Integration:** Ollama (local REST API)
- **Testing:** JUnit, Mockito

### 2. **Modules/Packages**
- `controller` — REST endpoints
- `service` — Business logic
- `repository` — JPA repositories
- `model` — JPA entities
- `dto` — Data transfer objects
- `mapper` — Entity/DTO mapping
- `exception` — Custom exceptions & handlers
- `config` — Configuration (profiles, caching, scheduling, actuator)
- `llm` — Ollama integration logic
- `scheduler` — Scheduled tasks
- `test` — Unit and integration tests

### 3. **Core Entities**
- **Note**: id, title, content, tags, createdAt, updatedAt
- **Snippet**: id, title, code, language, tags, createdAt, updatedAt
- **Document**: id, title, filePath, tags, createdAt, updatedAt

### 4. **Key Endpoints**
- `POST /api/notes` — Create note
- `GET /api/notes` — List/search notes
- `GET /api/notes/{id}` — Get note by id
- `PUT /api/notes/{id}` — Update note
- `DELETE /api/notes/{id}` — Delete note
- `POST /api/ask` — Ask a question (LLM Q&A)
- `POST /api/summarize` — Summarize notes (LLM)

### 5. **LLM Integration (Gemini)**
- The application now uses the [Google Gemini LLM API](https://aistudio.google.com/app/apikey) for Q&A and summarization.
- You must obtain a free Gemini API key and add it to `src/main/resources/application.properties`:
  ```properties
  llm.gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_GEMINI_API_KEY
  llm.gemini.api.key=YOUR_GEMINI_API_KEY
  ```
- The backend sends user questions or content to Gemini and returns the generated answer or summary.

### Example API Usage

**POST /api/ask**
```
{
  "prompt": "What is Java?"
}
```
**Response:**
```
{
  "answer": "Java is a programming language..."
}
```

**POST /api/summarize**
```
{
  "prompt": "Note 1: Java basics. Note 2: Spring Boot tips."
}
```
**Response:**
```
{
  "summary": "Summary of your notes: ..."
}
```

### 6. **Other Spring Boot Concepts**
- **Validation:** Hibernate Validator for DTOs
- **Exception Handling:** @ControllerAdvice for global error handling
- **Scheduling:** Periodic summarization/reminders
- **Caching:** For repeated LLM queries
- **Profiles:** Separate configs for dev/prod
- **Actuator:** Health, metrics, monitoring
- **Testing:** JUnit, Mockito, Spring Boot Test

### 7. **Future Enhancements**
- WebSocket for real-time Q&A
- User authentication/authorization
- File/document upload and parsing
- Analytics and usage stats

## Project Structure (as of initial setup)

```
smart-personal-kb-genai/
│
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── org/
│   │   │       └── genai/
│   │   │           └── knowledgebase/
│   │   │               ├── SmartPersonalKbGenAiApplication.java
│   │   │               ├── model/
│   │   │               │   └── Note.java
│   │   │               └── repository/
│   │   │                   └── NoteRepository.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
│           └── org/
│               └── genai/
│                   └── knowledgebase/
│                       └── SmartPersonalKbGenAiApplicationTests.java
```

### Design Rationale
- The project follows a modular package structure inspired by best practices for Spring Boot applications.
- Each major concern (model, repository, etc.) is separated into its own package for clarity and maintainability.
- The main application class bootstraps the app and serves as the root for component scanning.
- JPA is used for ORM, with H2 as the development database for easy local testing.
- All files and classes are documented to ensure the codebase is easy to understand and extend.

---

## Getting Started
1. Clone the repo
2. Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
3. Add your API key to `src/main/resources/application.properties`
4. Run the Spring Boot app
5. Use the REST API to manage notes and ask questions

---

## License

This project is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) license, with an additional clause:

- This project may not be used for academic, educational, or school/university coursework or projects.

See the [LICENSE](LICENSE) file for details.

## Deployment & Configuration Decisions

- **Spring Boot Actuator** is included for health checks and basic monitoring.
- **Local Development Only:** The application is configured to run locally (H2 database, no prod profile).
- **Testing:** Basic unit/integration tests are included for critical paths.
- **Open Access:** The API is open and does not require authentication (for now).
- **No production deployment planned** at this stage. 