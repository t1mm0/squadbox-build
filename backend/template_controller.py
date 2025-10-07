#!/usr/bin/env python
# -*- coding: utf-8 -*-
# File: template_controller.py
# Description: Controller class to manage project templates
# Last modified: 2024-11-03
# By: AI Assistant
# Completeness: 100

from template_manager import TemplateManager
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any

class TemplateController:
    """Controller to manage templates via API routes"""
    
    def __init__(self, template_manager: TemplateManager):
        """Initialize with a template manager"""
        self.template_manager = template_manager
        self.router = APIRouter(prefix="/templates", tags=["templates"])
        self._setup_routes()
        
    def _setup_routes(self):
        """Set up router endpoints"""
        
        @self.router.get("/", response_model=List[Dict[str, Any]])
        def get_templates():
            """Get list of available templates"""
            return self.template_manager.get_available_templates()
            
        @self.router.get("/{template_id}", response_model=Dict[str, Any])
        def get_template_details(template_id: str):
            """Get details of a specific template"""
            template = self.template_manager.get_template_details(template_id)
            if not template:
                raise HTTPException(status_code=404, detail=f"Template {template_id} not found")
            return template

# Example usage in FastAPI app:
# from fastapi import FastAPI
# from template_manager import TemplateManager
# from template_controller import TemplateController
#
# app = FastAPI()
# template_manager = TemplateManager()
# template_controller = TemplateController(template_manager)
# app.include_router(template_controller.router)