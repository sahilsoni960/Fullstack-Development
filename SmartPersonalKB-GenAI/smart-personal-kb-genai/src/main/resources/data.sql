-- Documents
INSERT INTO documents (id, title, file_path, created_at, updated_at) VALUES
  (1, 'Project Plan', '/docs/project-plan.pdf', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 'API Reference', '/docs/api-reference.pdf', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO document_tags (document_id, tag) VALUES
  (1, 'planning'),
  (1, 'project'),
  (2, 'api'),
  (2, 'reference');

-- Notes
INSERT INTO notes (id, title, content, created_at, updated_at) VALUES
  (1, 'Meeting Notes', 'Discussed project milestones and deadlines.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 'Ideas', 'Brainstormed new features for the dashboard.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO note_tags (note_id, tag) VALUES
  (1, 'meeting'),
  (2, 'ideas');

-- Snippets
INSERT INTO snippets (id, title, code, language, created_at, updated_at) VALUES
  (1, 'Hello World Java', 'public class HelloWorld { public static void main(String[] args) { System.out.println("Hello, World!"); } }', 'Java', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  (2, 'Fetch News API', 'fetch("https://newsapi.org/v2/everything?q=apple&apiKey=API_KEY")', 'JavaScript', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO snippet_tags (snippet_id, tag) VALUES
  (1, 'java'),
  (2, 'api'),
  (2, 'news'); 