#!/usr/bin/env python
# -*- coding: utf-8 -*-
# File: projects_controller.py
# Description: API endpoints for managing and retrieving projects
# Last modified: 2025-08-06
# By: AI Assistant
# Completeness: 100

import os
import json
import logging
from typing import List, Dict, Any, Optional
from pathlib import Path
from fastapi import APIRouter, HTTPException
import time

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

router = APIRouter()

class ProjectsController:
    def __init__(self, projects_dir: str = "generated_projects"):
        self.projects_dir = projects_dir
        os.makedirs(projects_dir, exist_ok=True)
    
    def get_all_projects(self) -> List[Dict[str, Any]]:
        """Get a list of all projects with their status and stats"""
        try:
            # Get all project directories (numeric folders)
            project_dirs = [d for d in os.listdir(self.projects_dir) 
                          if os.path.isdir(os.path.join(self.projects_dir, d)) and d.isdigit()]
            
            projects = []
            for project_id in sorted(project_dirs, key=int, reverse=True):  # Newest first
                project_path = os.path.join(self.projects_dir, project_id)
                manifest_path = os.path.join(project_path, "build_manifest.json")
                
                project_info = {
                    "id": project_id,
                    "name": f"Project {project_id}",
                    "creation_time": os.path.getctime(project_path),
                    "status": "unknown"
                }
                
                # Try to get info from manifest
                if os.path.exists(manifest_path):
                    try:
                        with open(manifest_path, "r") as f:
                            manifest = json.load(f)
                            
                        project_info.update({
                            "name": manifest.get("project_name", f"Project {project_id}"),
                            "status": manifest.get("status", "unknown"),
                            "template_id": manifest.get("template_id"),
                            "requirements": manifest.get("requirements", []),
                            "start_time": manifest.get("start_time"),
                            "end_time": manifest.get("end_time"),
                            "duration": manifest.get("end_time", time.time()) - manifest.get("start_time") if manifest.get("start_time") and manifest.get("end_time") else 0,
                            "file_count": len(manifest.get("files_generated", [])),
                            "has_errors": len(manifest.get("errors", [])) > 0
                        })
                
                    except Exception as e:
                        logger.error(f"Error reading manifest for project {project_id}: {str(e)}")
                
                # Check if zip file exists
                zip_path = os.path.join(self.projects_dir, f"{project_id}.zip")
                project_info["has_zip"] = os.path.exists(zip_path)
                if project_info["has_zip"]:
                    project_info["zip_size"] = os.path.getsize(zip_path)
                    project_info["download_url"] = f"/download/{project_id}.zip"
                
                projects.append(project_info)
            
            return projects
            
        except Exception as e:
            logger.error(f"Error getting projects: {str(e)}")
            return []
    
    def get_project(self, project_id: str) -> Optional[Dict[str, Any]]:
        """Get details for a specific project"""
        try:
            project_path = os.path.join(self.projects_dir, project_id)
            if not os.path.exists(project_path):
                return None
                
            manifest_path = os.path.join(project_path, "build_manifest.json")
            
            project_info = {
                "id": project_id,
                "name": f"Project {project_id}",
                "creation_time": os.path.getctime(project_path),
                "status": "unknown",
                "files": []
            }
            
            # Get file list
            for root, _, files in os.walk(project_path):
                for file in files:
                    if file not in ["build_manifest.json", "build.log"]:
                        file_path = os.path.join(root, file)
                        rel_path = os.path.relpath(file_path, project_path)
                        project_info["files"].append({
                            "path": rel_path,
                            "size": os.path.getsize(file_path),
                            "modified_time": os.path.getmtime(file_path)
                        })
            
            # Try to get info from manifest
            if os.path.exists(manifest_path):
                try:
                    with open(manifest_path, "r") as f:
                        manifest = json.load(f)
                        
                    project_info.update({
                        "name": manifest.get("project_name", f"Project {project_id}"),
                        "status": manifest.get("status", "unknown"),
                        "template_id": manifest.get("template_id"),
                        "requirements": manifest.get("requirements", []),
                        "start_time": manifest.get("start_time"),
                        "end_time": manifest.get("end_time"),
                        "duration": manifest.get("end_time", time.time()) - manifest.get("start_time") if manifest.get("start_time") and manifest.get("end_time") else 0,
                        "generated_files": manifest.get("files_generated", []),
                        "errors": manifest.get("errors", [])
                    })
            
                except Exception as e:
                    logger.error(f"Error reading manifest for project {project_id}: {str(e)}")
            
            # Check if zip file exists
            zip_path = os.path.join(self.projects_dir, f"{project_id}.zip")
            project_info["has_zip"] = os.path.exists(zip_path)
            if project_info["has_zip"]:
                project_info["zip_size"] = os.path.getsize(zip_path)
                project_info["download_url"] = f"/download/{project_id}.zip"
            
            # Check if build log exists and add its content
            log_path = os.path.join(project_path, "build.log")
            if os.path.exists(log_path):
                try:
                    with open(log_path, "r") as f:
                        project_info["build_log"] = f.read()
                except Exception as e:
                    logger.error(f"Error reading build log for project {project_id}: {str(e)}")
            
            return project_info
            
        except Exception as e:
            logger.error(f"Error getting project {project_id}: {str(e)}")
            return None

# Initialize controller
projects_controller = ProjectsController()

@router.get("/projects/")
async def list_projects():
    """Get a list of all projects with basic info"""
    return projects_controller.get_all_projects()

@router.get("/projects/{project_id}")
async def get_project(project_id: str):
    """Get detailed info for a specific project"""
    project = projects_controller.get_project(project_id)
    if project is None:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
    return project