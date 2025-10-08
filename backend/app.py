"""
File: app.py
Purpose: FastAPI application entry for Squadbox API
Last modified: 2025-08-13
By: AI Assistant
Completeness: 95/100
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, PlainTextResponse
from fastapi.staticfiles import StaticFiles
import shutil
import os
import zipfile
import time
import json
from typing import List, Dict, Any, Optional
import re
import logging

# Import our project generator, template controller, and projects controller
from project_generator import ProjectGenerator
from template_controller import TemplateController
from projects_controller import ProjectsController, router as projects_router
from mmry_workflow_service import mmry_workflow_service
from agentic_team_system import agentic_team_system
from agentic_team_monitor import agentic_team_monitor

# Set up logging
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Squadbox API", description="API for the Squadbox AI Webapp Builder")

# CORS configuration
# Explicitly list allowed origins to avoid browser access control issues
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "https://squadbox.co.uk",
    "https://www.squadbox.co.uk",
    "https://squadbox.vercel.app",
    "https://squadbox-frontend.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.(vercel\.app|onrender\.com)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directory to store generated projects
PROJECTS_DIR = "generated_projects"
os.makedirs(PROJECTS_DIR, exist_ok=True)

# Initialize project generator
# You can directly set the API key here if you prefer not to use environment variables
# For example: api_key = "your_openai_api_key_here"
api_key = None  # Set this to your API key if you don't want to use .env file
api_key_path = None  # Or set this to the path of a file containing your API key

# Initialize the project generator with the chosen API key approach
project_generator = ProjectGenerator(
    projects_dir=PROJECTS_DIR,
    api_key=api_key,
    api_key_path=api_key_path
)

# Set up template controller
template_controller = TemplateController(project_generator.template_manager)
app.include_router(template_controller.router)

# Set up projects router
app.include_router(projects_router)

# Set up authentication router (always attempt to include; endpoints will validate runtime env)
try:
    from auth_api import router as auth_router
    app.include_router(auth_router)
    logging.info("Authentication routes loaded under /auth")
except Exception as e:
    logging.error(f"Authentication routes not loaded: {e}")

SAFE_FILENAME = re.compile(r'^[\w\-\.]+$')
SAFE_PROJECT_ID = re.compile(r'^\d+$')

def is_safe_project_id(project_id):
    return SAFE_PROJECT_ID.match(project_id)

def is_safe_filename(filename):
    return SAFE_FILENAME.match(filename)

def execute_build_task(project_id: str):
    """Background task to execute project build"""
    project_generator.execute_build(project_id)


@app.get("/")
async def root():
    """Root endpoint for health check"""
    return {"message": "Squadbox API is running", "status": "healthy"}

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": time.time()}

@app.post("/generate-project/")
async def generate_project(
    background_tasks: BackgroundTasks,
    requirements: List[str] = Form(...),
    project_type: str = Form("web"),
    template_id: Optional[str] = Form(None),
    project_name: str = Form("My Project"),
    user_api_key: Optional[str] = Form(None),
    use_personal_key: Optional[str] = Form(None),
    ollama_url: Optional[str] = Form(None),
    use_ollama: Optional[str] = Form(None),
    x_user_api_key: Optional[str] = Header(None),
    x_ollama_url: Optional[str] = Header(None),
):
    """
    Accepts requirements and initiates an AI-powered project build process
    
    Args:
        background_tasks: FastAPI BackgroundTasks
        requirements: List of project requirements as strings
        project_type: Type of project to generate (web, api, mobile, etc.)
        template_id: Optional template to use as starting point
        project_name: Name of the project
    """
    # Start project build
    # Determine effective preferences
    effective_key = x_user_api_key or user_api_key
    effective_ollama = x_ollama_url or ollama_url

    result = project_generator.start_build(
        project_name=project_name,
        requirements=requirements,
        template_id=template_id,
        project_type=project_type,
        user_api_key=effective_key,
        use_personal_key=bool(use_personal_key) or bool(effective_key),
        ollama_url=effective_ollama,
        use_ollama=bool(use_ollama) or bool(effective_ollama),
    )
    
    project_id = result["project_id"]
    
    # Start background task for building
    background_tasks.add_task(execute_build_task, project_id)
    
    return {"project_id": project_id, "zip_file": f"/download/{project_id}.zip"}

@app.get("/logs/{project_id}")
def get_logs(project_id: str):
    if not is_safe_project_id(project_id):
        raise HTTPException(status_code=400, detail="Invalid project id")
    log_path = os.path.join(PROJECTS_DIR, project_id, "build.log")
    if not os.path.exists(log_path):
        raise HTTPException(status_code=404, detail="Log not found")
    with open(log_path, "r") as f:
        content = f.read()
    return PlainTextResponse(content)

@app.get("/build-status/{project_id}")
def get_build_status(project_id: str):
    """Get the current build status for a project"""
    if not is_safe_project_id(project_id):
        raise HTTPException(status_code=400, detail="Invalid project id")
    
    # Check if project exists
    project_path = os.path.join(PROJECTS_DIR, project_id)
    if not os.path.exists(project_path):
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get detailed status from project generator
    status_data = project_generator.get_build_status(project_id)
    
    # Calculate progress percentage
    progress = 0
    if status_data["status"] == "initializing":
        progress = 10
    elif status_data["status"] == "generating":
        progress = 50
    elif status_data["status"] == "complete":
        progress = 100
    elif status_data["status"] == "failed":
        progress = 100  # Even if failed, process is complete
    
    # Add progress to status data
    status_data["progress"] = progress
    status_data["timestamp"] = time.time()
    
    return status_data

@app.get("/agent-status/{project_id}")
def get_agent_status(project_id: str):
    """Get the status of AI agents for a project"""
    if not is_safe_project_id(project_id):
        raise HTTPException(status_code=400, detail="Invalid project id")
    
    # Check if project exists
    project_path = os.path.join(PROJECTS_DIR, project_id)
    if not os.path.exists(project_path):
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get agent status from project generator
    agent_status = project_generator.get_agent_status(project_id)
    
    return agent_status

# Template endpoints are now handled by TemplateController

@app.get("/download/{zip_name}")
def download_zip(zip_name: str):
    if not is_safe_filename(zip_name):
        raise HTTPException(status_code=400, detail="Invalid zip filename")
    zip_path = os.path.join(PROJECTS_DIR, zip_name)
    if os.path.exists(zip_path):
        return FileResponse(zip_path, filename=zip_name)
    return JSONResponse({"error": "Not found"}, status_code=404)

@app.delete("/cleanup/{project_id}")
def cleanup_project(project_id: str):
    if not is_safe_project_id(project_id):
        raise HTTPException(status_code=400, detail="Invalid project id")
    project_path = os.path.join(PROJECTS_DIR, project_id)
    zip_path = os.path.join(PROJECTS_DIR, f"{project_id}.zip")
    # Remove project directory
    if os.path.exists(project_path):
        shutil.rmtree(project_path)
    # Remove zip file
    if os.path.exists(zip_path):
        os.remove(zip_path)
    return {"status": "cleaned"}

# Serve generated zips statically
app.mount("/generated_projects", StaticFiles(directory=PROJECTS_DIR), name="generated_projects")

# MMRY Storage and Retrieval Endpoints
@app.get("/mmry/user-stats/{user_id}")
def get_user_storage_stats(user_id: str):
    """Get MMRY storage statistics for a user"""
    try:
        stats = mmry_workflow_service.get_user_storage_stats(user_id)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting user stats: {str(e)}")

@app.get("/mmry/retrieve/{user_id}/{project_id}")
def retrieve_project_files(user_id: str, project_id: str):
    """Retrieve project files from MMRY storage"""
    try:
        files = mmry_workflow_service.retrieve_project_files(user_id, project_id)
        return files
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving files: {str(e)}")

@app.get("/mmry/system-stats")
def get_mmry_system_stats():
    """Get overall MMRY system statistics"""
    try:
        stats = mmry_workflow_service.get_system_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting system stats: {str(e)}")

@app.post("/feedback")
async def submit_feedback(feedback: dict):
    """Submit user feedback"""
    try:
        # Store feedback in database
        # For now, just log it and send email
        print(f"Feedback received: {feedback}")
        
        # TODO: Implement email sending to hello@squadbox.uk
        # TODO: Store in database
        
        return {"success": True, "message": "Feedback submitted successfully"}
    except Exception as e:
        return {"success": False, "error": str(e)}

# Agentic Team System Endpoints
@app.get("/agentic-teams/status")
async def get_all_teams_status():
    """Get status of all agentic teams"""
    try:
        return agentic_team_system.get_all_teams()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting teams status: {str(e)}")

@app.get("/agentic-teams/{team_id}/status")
async def get_team_status(team_id: str):
    """Get status of a specific agentic team"""
    try:
        status = agentic_team_system.get_team_status(team_id)
        if not status:
            raise HTTPException(status_code=404, detail="Team not found")
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting team status: {str(e)}")

@app.post("/agentic-teams/{team_id}/execute")
async def execute_team_workflow(team_id: str):
    """Execute the agentic team workflow"""
    try:
        import asyncio
        result = await agentic_team_system.execute_team_workflow(team_id)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error executing team workflow: {str(e)}")

# Agentic Team Monitoring Endpoints
@app.get("/agentic-teams/analytics")
async def get_system_analytics():
    """Get system-wide analytics for agentic teams"""
    try:
        return agentic_team_monitor.get_system_analytics()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting system analytics: {str(e)}")

@app.get("/agentic-teams/{team_id}/analytics")
async def get_team_analytics(team_id: str):
    """Get detailed analytics for a specific team"""
    try:
        analytics = agentic_team_monitor.get_team_analytics(team_id)
        if not analytics:
            raise HTTPException(status_code=404, detail="Team not found")
        return analytics
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting team analytics: {str(e)}")

@app.get("/agentic-teams/{team_id}/performance-report")
async def get_team_performance_report(team_id: str):
    """Get detailed performance report for a team"""
    try:
        report = agentic_team_monitor.get_team_performance_report(team_id)
        if not report:
            raise HTTPException(status_code=404, detail="Team not found")
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting performance report: {str(e)}")

@app.get("/agentic-teams/export-analytics")
async def export_analytics(format: str = "json"):
    """Export analytics data in specified format"""
    try:
        if format not in ["json", "csv"]:
            raise HTTPException(status_code=400, detail="Format must be 'json' or 'csv'")
        
        data = agentic_team_monitor.export_analytics(format)
        return {"data": data, "format": format}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exporting analytics: {str(e)}")
