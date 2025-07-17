import os
import requests
from dotenv import load_dotenv
from typing import List, Dict, Any
import re
from cachetools import TTLCache
import json
import configparser

# Load environment variables from .env file
load_dotenv()

JENKINS_URL = os.getenv("JENKINS_URL")
JENKINS_USER = os.getenv("JENKINS_USER")
JENKINS_TOKEN = os.getenv("JENKINS_TOKEN")
JENKINS_JOB_PATH = os.getenv("JENKINS_JOB_PATH")

RUNS_URL = f"{JENKINS_URL}{JENKINS_JOB_PATH}/wfapi/runs"

# Cache: key=(build_number, node_id), value=summary, 100 items, 1 day TTL
SUMMARY_CACHE = TTLCache(maxsize=100, ttl=86400)

# Internal LLM API config
INTERNAL_LLM_URL = "https://egpt.informatica.com/api/chat/send-message"
INTERNAL_LLM_CHAT_SESSION_ID = os.getenv("INTERNAL_LLM_CHAT_SESSION_ID", "826989b8-6d04-4d9c-a3a3-dd77c8333503")


def get_pipeline_status():
    try:
        # Step 1: Get the list of runs
        runs_resp = requests.get(
            RUNS_URL,
            auth=(JENKINS_USER, JENKINS_TOKEN),
            timeout=10
        )
        runs_resp.raise_for_status()
        runs = runs_resp.json()
        if not runs:
            return {"error": "No runs found for this pipeline."}
        # Find the most recent completed run (not IN_PROGRESS or PAUSED)
        completed_run = next((run for run in runs if run.get("status") not in ["IN_PROGRESS", "PAUSED"]), None)
        if not completed_run:
            return {"error": "No completed runs found for this pipeline."}
        build_number = completed_run.get("id")
        if not build_number:
            return {"error": "Could not determine build number of last completed run."}

        # Step 2: Get the stage/status info for the selected run
        describe_url = f"{JENKINS_URL}{JENKINS_JOB_PATH}/{build_number}/wfapi/describe"
        desc_resp = requests.get(
            describe_url,
            auth=(JENKINS_USER, JENKINS_TOKEN),
            timeout=10
        )
        desc_resp.raise_for_status()
        data = desc_resp.json()
        stages = data.get("stages", [])  # Use as-is, flat array
        return {
            "pipeline_name": data.get("name", "promotion-pipeline"),
            "build_number": build_number,
            "stages": stages,
            "status": data.get("status"),
            "startTimeMillis": data.get("startTimeMillis"),
            "endTimeMillis": data.get("endTimeMillis")
        }
    except Exception as e:
        return {"error": str(e)}


def join_url(*parts):
    # Join URL parts ensuring only single slashes between them
    return '/'.join(part.strip('/') for part in parts if part)

def summarize_log_with_internal_llm(log_text: str, run_search: str = "auto") -> str:
    headers = {"Content-Type": "application/json", "Accept": "*/*",
        "Cookie": "last_utms=e30=; do_mkto_call=false; _mkto_trk=id:867-MAO-634&token:_mch-informatica.com-1726585126637-45518; drift_aid=74ab6f9e-8922-4fbb-a33b-34eb59c751db; driftt_aid=74ab6f9e-8922-4fbb-a33b-34eb59c751db; mrkto_rest_call_made=true; mrkto_lead=%7B%22success%22%3Afalse%2C%22errors%22%3A%5B%7B%22type%22%3A%22java+exception%22%2C%22code%22%3A%22server_error_500%22%2C%22message%22%3A%22java.lang.Exception%3A+Error+Code+99%3A+Null+munckinId%22%7D%5D%2C%22marketoCall%22%3A%22false%22%7D; AMCV_C0B11CFE5330AAFD0A490D45%40AdobeOrg=-408604571%7CMCIDTS%7C20119%7CMCMID%7C87870158167509771562013495818759625767%7CMCAAMLH-1738871587%7C9%7CMCAAMB-1738871587%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1738273987s%7CNONE%7CMCAID%7CNONE%7CMCCIDH%7C0%7CvVersion%7C4.6.0; coveo_visitorId=e50639b2-267b-4aad-04d0-f7733ded8f31; _gcl_au=1.1.518156236.1745221596; _uetvid=56c34000750511ef9c7509f1144921db; kndctr_C0B11CFE5330AAFD0A490D45_AdobeOrg_identity=CiY4Nzg3MDE1ODE2NzUwOTc3MTU2MjAxMzQ5NTgxODc1OTYyNTc2N1IQCPeezOvTMhgBKgNWQTYwA_ABibC9x4Az; _rdt_uuid=1736882433791.134bafef-bfab-4229-8cf2-17d14d1796bc; _ga_REW3LPY1RD=GS2.2.s1752496567$o9$g0$t1752496567$j60$l0$h0; _ga=GA1.1.1571249424.1726585125; mbox=session#87870158167509771562013495818759625767-etRWoE#1752498428|PC#d769d00871b24a27b3e7619a4421af8b.35_0#1801511591; fastapiusersauth=Gc15WMx5tVWUPkI9DppJla9hnBbKirNYhxv5MNwLNQs; __stripe_mid=c52a909e-165f-4242-8d9a-5d73de3bc76cd9cda9; RT=\"z=1&dm=informatica.com&si=26e4f52e-0baf-4c2e-86f5-c6443ccb7428&ss=md337ah6&sl=1&tt=7i0&bcn=//17de4c14.akstat.io/&ul=av2d&hd=av2j\"; _ga_68KP4HCH6Y=GS2.1.s1752496568$o9$g0$t1752497064$j60$l0$h0; __stripe_sid=bdacfa3a-41b9-4ebd-be16-1cd0c7d1652da61668"
    }
    # Pre-filter log for error/failure lines and context
    MAX_LOG_LINES = 500  # Limit for LLM context
    lines = log_text.splitlines()

    # Take the last MAX_LOG_LINES lines for context
    tail_lines = lines[-MAX_LOG_LINES:]

    # Now filter for error/failure/assertion lines and their context in the tail
    keywords = re.compile(r"fail|error|assert|exception|not equal|expected|at assertion", re.IGNORECASE)
    matches = [i for i, line in enumerate(tail_lines) if keywords.search(line)]
    context = set()
    for idx in matches:
        for i in range(max(0, idx-2), min(len(tail_lines), idx+3)):
            context.add(i)
    filtered_lines = [tail_lines[i] for i in sorted(context)]

    # If not enough matches, fallback to just the last MAX_LOG_LINES lines
    if not filtered_lines:
        filtered_lines = tail_lines

    filtered_log = "\n".join(filtered_lines)
    if not filtered_log.strip():
        filtered_log = "No failed test or error lines found in this log excerpt."

    prompt = (
        "You are analyzing the output of an automated test pipeline. "
        "Ignore any Jenkins pipeline steps, setup, or infrastructure messages. "
        "Focus only on failed test steps and error logs. For each failed test or assertion, extract and summarize:\n"
        "- The test name or context (e.g., inside \"...\")\n"
        "- The assertion that failed\n"
        "- The expected vs actual values, if present\n"
        "- Any error message or stack trace\n"
        "- Summarize the root cause in 1-2 sentences.\n"
        "Present your answer as a bullet list, one bullet per failed test/assertion. Ignore all passed tests and infrastructure output.\n\n"
        f"Log:\n{filtered_log}"
    )
    #prompt = ("find tickets for C360 Tests")
    payload = {
        "alternate_assistant_id": 0,
        "chat_session_id": INTERNAL_LLM_CHAT_SESSION_ID,
        "parent_message_id": None,
        "message": prompt,
        "prompt_id": None,
        "search_doc_ids": None,
        "file_descriptors": [],
        "user_file_ids": [],
        "user_folder_ids": [],
        "regenerate": False,
        "retrieval_options": {
            "run_search": run_search,
            "real_time": True,
            "filters": {
                "source_type": None,
                "document_set": None,
                "time_cutoff": None,
                "tags": [],
                "user_file_ids": []
            }
        },
        "prompt_override": None,
        "llm_override": {
            "model_provider": "INFA",
            "model_version": "qwen2.5-32b-instruct"
        },
        "use_agentic_search": False
    }
    try:
        print("\n========== LLM REQUEST ==========")
        print(json.dumps(payload, indent=2))
        print("========== END LLM REQUEST ==========")
        resp = requests.post(INTERNAL_LLM_URL, headers=headers, data=json.dumps(payload), verify=False)
        resp.raise_for_status()
        print("\n========== LLM RAW RESPONSE ==========")
        print(resp.text)
        print("========== END LLM RAW RESPONSE ==========")
        try:
            data = resp.json()
            # Try to extract the main LLM response text
            if isinstance(data, dict):
                for key in ["summary", "result", "message", "data"]:
                    if key in data and isinstance(data[key], str):
                        return {"summary": data[key]}
                if "data" in data and isinstance(data["data"], dict):
                    for key in ["summary", "result", "message"]:
                        if key in data["data"] and isinstance(data["data"][key], str):
                            return {"summary": data["data"][key]}
            return {"summary": str(data)}
        except Exception:
            # If not JSON, try to parse as JSON lines and extract the last 'message' and any 'document_id's
            lines = resp.text.strip().splitlines()
            message = None
            document_ids = set()
            for line in reversed(lines):
                try:
                    obj = json.loads(line)
                    # Extract message
                    if message is None and "message" in obj:
                        message = obj["message"]
                    # Extract document_ids from top_documents if present
                    if "top_documents" in obj and isinstance(obj["top_documents"], list):
                        for doc in obj["top_documents"]:
                            if isinstance(doc, dict) and "document_id" in doc:
                                document_ids.add(doc["document_id"])
                except Exception:
                    continue
            result = {}
            if message:
                result["summary"] = message
            if document_ids:
                result["document_ids"] = list(document_ids)
            if result:
                return result
            # fallback: return the whole response
            return {"summary": resp.text}
    except Exception as e:
        return f"Internal LLM summarization failed: {str(e)}"


def get_stage_log(build_number, node_id, run_search="auto"):
    try:
        describe_url = join_url(JENKINS_URL, JENKINS_JOB_PATH, f"{build_number}/execution/node/{node_id}/wfapi/describe")
        desc_resp = requests.get(
            describe_url,
            auth=(JENKINS_USER, JENKINS_TOKEN),
            timeout=10
        )
        desc_data = None
        try:
            desc_resp.raise_for_status()
            desc_data = desc_resp.json()
        except Exception:
            desc_data = None

        # 1. Try to find downstream job info in stageFlowNodes
        if desc_data:
            stage_flow_nodes = desc_data.get("stageFlowNodes", [])
            for node in stage_flow_nodes:
                node_log_url = node.get("_links", {}).get("console", {}).get("href")
                if node_log_url:
                    full_log_url = join_url(JENKINS_URL, node_log_url)
                    node_log_resp = requests.get(
                        full_log_url,
                        auth=(JENKINS_USER, JENKINS_TOKEN),
                        timeout=10
                    )
                    if node_log_resp.status_code == 200:
                        log_text = node_log_resp.text
                        import re
                        anchor_match = re.search(r"<a href='(/job/[^']+/\d+/)'[ >]", log_text)
                        downstream_console_url = None
                        if anchor_match:
                            downstream_console_url = join_url(JENKINS_URL, anchor_match.group(1))
                        else:
                            downstream_match = re.search(r'Starting building: ([^#]+)#(\\d+)', log_text)
                            if downstream_match:
                                job_path_str = downstream_match.group(1).strip()
                                build_num = downstream_match.group(2)
                                job_path = '/'.join(f"job/{part.strip()}" for part in job_path_str.split('»'))
                                downstream_console_url = join_url(JENKINS_URL, job_path, build_num)
                        if downstream_console_url:
                            console_text_url = downstream_console_url + "/consoleText"
                            console_text_resp = requests.get(
                                console_text_url,
                                auth=(JENKINS_USER, JENKINS_TOKEN),
                                timeout=10
                            )
                            if console_text_resp.status_code == 200 and not console_text_resp.text.lstrip().startswith('<!DOCTYPE html>'):
                                log = console_text_resp.text
                                log_result = {'log': log}
                                if log_result and log_result.get('log'):
                                    cache_key = (str(build_number), str(node_id), run_search)
                                    if cache_key in SUMMARY_CACHE:
                                        summary = SUMMARY_CACHE[cache_key]
                                    else:
                                        summary = summarize_log_with_internal_llm(log_result['log'], run_search)
                                        SUMMARY_CACHE[cache_key] = summary
                                    log_result['summary'] = summary
                                return log_result if log_result else {"error": "No log found."}
                            console_html_url = downstream_console_url + "/console"
                            console_html_resp = requests.get(
                                console_html_url,
                                auth=(JENKINS_USER, JENKINS_TOKEN),
                                timeout=10
                            )
                            if console_html_resp.status_code == 200:
                                html = console_html_resp.text
                                pre_match = re.search(r'<pre[^>]*>(.*?)</pre>', html, re.DOTALL)
                                if pre_match:
                                    import html as html_module
                                    log_content = html_module.unescape(pre_match.group(1))
                                    log = log_content
                                    log_result = {'log': log}
                                    if log_result and log_result.get('log'):
                                        cache_key = (str(build_number), str(node_id), run_search)
                                        if cache_key in SUMMARY_CACHE:
                                            summary = SUMMARY_CACHE[cache_key]
                                        else:
                                            summary = summarize_log_with_internal_llm(log_result['log'], run_search)
                                            SUMMARY_CACHE[cache_key] = summary
                                        log_result['summary'] = summary
                                    return log_result if log_result else {"error": "Could not extract log from downstream job HTML."}
                                else:
                                    return {"error": "Could not extract log from downstream job HTML.", "console_html_url": console_html_url}
                            else:
                                return {"error": f"Downstream job log fetch failed: {console_html_resp.status_code}", "console_html_url": console_html_url}
        log_url = join_url(JENKINS_URL, JENKINS_JOB_PATH, f"{build_number}/execution/node/{node_id}/log")
        resp = requests.get(
            log_url,
            auth=(JENKINS_USER, JENKINS_TOKEN),
            timeout=10
        )
        if resp.status_code == 200:
            log = resp.text
            log_result = {'log': log}
            if log_result and log_result.get('log'):
                cache_key = (str(build_number), str(node_id), run_search)
                if cache_key in SUMMARY_CACHE:
                    summary = SUMMARY_CACHE[cache_key]
                else:
                    summary = summarize_log_with_internal_llm(log_result['log'], run_search)
                    SUMMARY_CACHE[cache_key] = summary
                log_result['summary'] = summary
            return log_result if log_result else {"error": "No log found."}
        else:
            # Extra debug logging for 404 or other errors
            print(f"\n==== Jenkins log fetch failed for node {node_id} (build {build_number}) ====")
            print(f"URL: {log_url}")
            print(f"Status code: {resp.status_code}")
            print(f"Response text: {resp.text[:500]}")
            print(f"Node description (desc_data): {json.dumps(desc_data, indent=2) if desc_data else 'None'}")
            # Try to find downstream job or console links in desc_data
            if desc_data:
                # Check for _links.console
                links = desc_data.get('_links', {})
                if 'console' in links and 'href' in links['console']:
                    downstream_console_url = join_url(JENKINS_URL, links['console']['href'])
                    return {"downstream_console_url": downstream_console_url}
                # Check for displayName or other clues
                if 'displayName' in desc_data:
                    # Try to construct a Jenkins search URL for the displayName
                    search_url = f"{JENKINS_URL}/search/?q={desc_data['displayName']}"
                    return {"error": f"Log not found for this node, but you can search Jenkins for: {desc_data['displayName']}", "jenkins_search_url": search_url}
            return {"error": f"{resp.status_code} Client Error: Not Found for url: {log_url}", "log_url": log_url, "describe_url": describe_url, "node_description": desc_data}
    except Exception as e:
        return {"error": str(e)} 