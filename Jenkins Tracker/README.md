# 🚀 Jenkins Promotion Pipeline Tracker

Welcome to the **Jenkins Promotion Pipeline Tracker**! This project provides a modern, interactive dashboard to monitor Jenkins promotion pipelines, track automation run stages, and get instant AI-powered summaries of failures—complete with direct Jira ticket links! 🕵️‍♂️🤖

---

## 🏗️ **Architecture Overview**

```
[ Jenkins 🏗️ ]
     |
     v
[ FastAPI Backend 🐍⚡ ] <--- AI LLM (Internal API) 🤖
     |
     v
[ React Frontend ⚛️🖥️ ]
```

- **Jenkins**: Runs your CI/CD pipelines and exposes job/stage data via REST API.
- **Backend (FastAPI)**: Fetches pipeline/stage data, retrieves logs, summarizes failures using an internal LLM, and extracts Jira ticket links.
- **Frontend (React + MUI)**: Beautiful dashboard UI for pipeline status, drill-down logs, AI summaries, and clickable Jira links.

---

## 🐍 **Backend: FastAPI**

### **Responsibilities**
- Fetch pipeline and stage status from Jenkins REST API
- Retrieve and filter logs for failed stages
- Summarize logs using an internal LLM API (with togglable search mode)
- Extract and return Jira ticket/document links from LLM responses
- Provide robust error handling and fallback for missing logs/downstream jobs

### **Key Endpoints**
- `GET /pipeline/status` — Get high-level pipeline and stage status
- `POST /pipeline/log/{build_number}/{node_id}` — Get logs and AI summary for a specific stage (with `run_search` mode)

### **How Log Summarization & Jira Extraction Works**
1. **Log Fetching**: For a failed stage, fetch the last 500 lines and filter for error/failure/assertion context.
2. **LLM Summarization**: Send the filtered log to the internal LLM API, with `run_search` set to either `auto` or `always` (based on UI toggle).
3. **Jira Extraction**: Parse the LLM's streaming JSON response for `document_id` fields in `top_documents` arrays—these are Jira ticket links!
4. **Response**: Return both the summary and all Jira links to the frontend.

### **Special Features**
- 🧠 **Caching**: Summaries are cached per (build, node, search mode) for speed.
- 🕵️‍♂️ **Downstream Job Fallback**: If a log isn't found, the backend tries to find and link to downstream Jenkins jobs.
- 🪵 **Debug Logging**: All LLM requests and responses are logged for easy troubleshooting.

---

## ⚛️ **Frontend: React + MUI**

### **Responsibilities**
- Display pipeline and stage status in a color-coded dashboard
- Allow drill-down into failed stages to view logs and AI summaries
- Show a toggle for `run_search` mode ("Auto" vs "Always")
- Display clickable Jira ticket links when available
- Handle errors and fallback links gracefully

### **Key UI Features**
- 🟢🟡🔴 **Status Chips**: Instantly see which stages passed, failed, or are in progress
- 👁️ **View Log**: Drill down into any failed stage to see the raw log and AI summary
- 🤖 **AI Summary**: Get a bullet-point summary of failures, root causes, and assertions
- 🏷️ **Jira Link Ids**: Clickable buttons for each Jira ticket found by the AI
- 🔄 **Run Search Toggle**: Switch between `auto` and `always` search modes for the LLM

### **How the UI Talks to the Backend**
- On "View Log", sends a POST with `{ run_search: 'auto' | 'always' }`
- Displays log, summary, and all Jira links returned by the backend
- Handles downstream job links and errors with user-friendly messages

---

## 🔗 **End-to-End Flow**

1. **User opens dashboard** → sees pipeline and stage status
2. **User clicks "View Log" on a failed stage**
3. **Frontend sends request to backend with selected `run_search` mode**
4. **Backend fetches and filters log, calls LLM, parses Jira links**
5. **Frontend displays log, AI summary, and all Jira ticket links**
6. **User can click Jira links to open tickets directly!**

---

## 🛠️ **Error Handling & Fallbacks**
- If a log can't be fetched, the backend tries to find a downstream job link or provides a Jenkins search URL
- All errors are shown in the UI with clear messages
- Debug logs are printed in the backend for every LLM request/response

---

## 🚦 **Run Search Toggle: What Does It Do?**
- **Auto**: Lets the LLM decide if it needs to search for related Jira tickets
- **Always**: Forces the LLM to always search for and return related Jira tickets (more comprehensive, but may be slower)

---

## 🏃‍♂️ **How to Run the Project**

### **Backend (FastAPI)**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### **Frontend (React)**
```bash
cd frontend
npm install
npm start
```

- The frontend runs on `localhost:3000` (or as configured)
- The backend runs on `localhost:8000`

---

## 🤝 **Contributing & Support**
- PRs and issues welcome!
- See code comments and debug logs for troubleshooting
- For questions, open an issue or contact the maintainers

---

## 🎉 **Enjoy tracking your Jenkins pipelines with AI superpowers!** 