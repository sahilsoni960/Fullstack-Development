from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
from jenkins_api import get_pipeline_status, get_stage_log

app = FastAPI()

# Allow CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/pipeline/status")
def pipeline_status() -> Dict:
    return get_pipeline_status()

@app.post("/pipeline/log/{build_number}/{node_id}")
async def pipeline_stage_log(build_number: str, node_id: str, request: Request) -> Dict:
    body = await request.json()
    run_search = body.get("run_search", "auto")
    return get_stage_log(build_number, node_id, run_search=run_search) 