#!/usr/bin/env python
# -*- coding: utf-8 -*-
# File: llm_provider_ollama.py
# Description: Ollama implementation of LLM provider
# Last modified: 2023-11-05
# By: AI Assistant
# Completeness: 100

import os
import logging
import requests
from typing import Dict, Any, Optional

from llm_provider import LLMProvider

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class OllamaProvider(LLMProvider):
    """
    Concrete implementation of LLMProvider for Ollama
    """
    def __init__(self, api_key=None, api_key_path=None):
        self.host = os.environ.get("LLM_HOST", "localhost")
        self.port = os.environ.get("LLM_PORT", "11434")
        
        # Choose a model based on environment or system capabilities
        self.model = os.environ.get("LLM_MODEL", "gpt-oss:20b")
        
        # Default to gpt-oss:20b if not specified (better quality)
        if not self.model:
            self.model = "gpt-oss:20b"
            
        self.base_url = f"http://{self.host}:{self.port}"
        
        logger.info(f"Initialized OllamaProvider with model: {self.model} at {self.base_url}")
        
    def generate_completion(self, system_prompt: str, user_prompt: str) -> str:
        """
        Generate a completion from the Ollama API
        """
        try:
            logger.info(f"Generating completion with Ollama model: {self.model}")
            
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
            
            # Make the request with timeout
            response = requests.post(url, json=payload, timeout=10)  # 10 second timeout for faster response
            response.raise_for_status()
            
            # Extract the response
            result = response.json()
            generated_text = result.get("response", "")
            
            logger.info(f"Successfully generated {len(generated_text)} chars of text with Ollama")
            return generated_text
            
        except Exception as e:
            logger.error(f"Ollama error: {e}")
            raise
    
    def ensure_model_available(self) -> bool:
        """
        Ensure the model is available locally on Ollama
        """
        try:
            # Check if model exists
            url = f"{self.base_url}/api/tags"
            response = requests.get(url, timeout=30)  # 30 second timeout
            response.raise_for_status()
            
            models = response.json().get("models", [])
            model_exists = any(model.get("name") == self.model for model in models)
            
            if not model_exists:
                logger.info(f"Model {self.model} not found locally, pulling...")
                
                # Pull the model
                pull_url = f"{self.base_url}/api/pull"
                pull_payload = {"name": self.model}
                
                pull_response = requests.post(pull_url, json=pull_payload, timeout=600)  # 10 minute timeout for model pull
                pull_response.raise_for_status()
                
                logger.info(f"Successfully pulled model {self.model}")
                
            else:
                logger.info(f"Model {self.model} already available locally")
                
            return True
            
        except Exception as e:
            logger.error(f"Error ensuring model availability: {e}")
            return False
