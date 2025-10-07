#!/usr/bin/env python
# -*- coding: utf-8 -*-
# File: local_llm.py
# Description: Local LLM adapter for code generation
# Last modified: 2024-11-03

import os
import requests
import json
import logging
from typing import List, Dict, Any

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class LocalLLM:
    """
    Adapter for local LLM using Ollama API
    """
    def __init__(self):
        self.host = os.environ.get("LLM_HOST", "localhost")
        self.port = os.environ.get("LLM_PORT", "11434")
        
        # Choose a model based on environment or system capabilities
        self.model = os.environ.get("LLM_MODEL", "gpt-oss:20b")
        
        # Default to gpt-oss:20b if not specified (better quality)
        if not self.model:
            self.model = "gpt-oss:20b"
            
        self.base_url = f"http://{self.host}:{self.port}"
        
        logger.info(f"Initialized LocalLLM with model: {self.model} at {self.base_url}")
        
    def generate_completion(self, system_prompt: str, user_prompt: str) -> str:
        """
        Generate a completion from the local LLM
        """
        try:
            logger.info(f"Generating completion with model: {self.model}")
            
            # Prepare the request
            url = f"{self.base_url}/api/generate"
            
            payload = {
                "model": self.model,
                "prompt": user_prompt,
                "system": system_prompt,
                "stream": False,
                "options": {
                    "temperature": 0.2,
                    "top_p": 0.95,
                }
            }
            
            # Make the request
            response = requests.post(url, json=payload)
            response.raise_for_status()
            
            # Extract the response
            result = response.json()
            generated_text = result.get("response", "")
            
            logger.info(f"Successfully generated {len(generated_text)} chars of text")
            return generated_text
            
        except Exception as e:
            logger.error(f"Error generating completion: {e}")
            raise
    
    def ensure_model_available(self):
        """
        Ensure the model is available locally
        """
        try:
            # Check if model exists
            url = f"{self.base_url}/api/tags"
            response = requests.get(url)
            response.raise_for_status()
            
            models = response.json().get("models", [])
            model_exists = any(model.get("name") == self.model for model in models)
            
            if not model_exists:
                logger.info(f"Model {self.model} not found locally, pulling...")
                
                # Pull the model
                pull_url = f"{self.base_url}/api/pull"
                pull_payload = {"name": self.model}
                
                pull_response = requests.post(pull_url, json=pull_payload)
                pull_response.raise_for_status()
                
                logger.info(f"Successfully pulled model {self.model}")
                
            else:
                logger.info(f"Model {self.model} already available locally")
                
            return True
            
        except Exception as e:
            logger.error(f"Error ensuring model availability: {e}")
            return False