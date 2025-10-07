#!/usr/bin/env python
# -*- coding: utf-8 -*-
# File: llm_provider_openai.py
# Description: OpenAI implementation of LLM provider
# Last modified: 2023-11-05
# By: AI Assistant
# Completeness: 100

import os
import logging
from typing import Dict, Any, Optional
import openai

from llm_provider import LLMProvider

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class OpenAIProvider(LLMProvider):
    """
    Concrete implementation of LLMProvider for OpenAI
    """
    def __init__(self, api_key=None, api_key_path=None):
        # Configure API key
        if api_key:
            openai.api_key = api_key
        elif api_key_path:
            with open(api_key_path, 'r') as f:
                openai.api_key = f.read().strip()
        elif os.environ.get("OPENAI_API_KEY"):
            # Use from environment if available
            openai.api_key = os.environ.get("OPENAI_API_KEY")
        elif os.environ.get("OPENAI_API_KEY_PATH"):
            # Read from file specified in environment
            with open(os.environ.get("OPENAI_API_KEY_PATH"), 'r') as f:
                openai.api_key = f.read().strip()
                
        # Choose a model based on environment variables
        self.model = os.environ.get("OPENAI_MODEL", "gpt-4o")
        
        # Set model parameters
        self.temperature = float(os.environ.get("OPENAI_TEMPERATURE", "0.2"))
        self.max_tokens = int(os.environ.get("OPENAI_MAX_TOKENS", "4000"))
        
        logger.info(f"Initialized OpenAIProvider with model: {self.model}")
        
    def generate_completion(self, system_prompt: str, user_prompt: str) -> str:
        """
        Generate a completion from the OpenAI API
        """
        try:
            logger.info(f"Generating completion with OpenAI model: {self.model}")
            
            # Create messages for the chat completion
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
            
            # Make API call
            response = openai.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )
            
            # Extract content from the response
            if hasattr(response, 'choices') and len(response.choices) > 0:
                content = response.choices[0].message.content
                logger.info(f"Successfully generated {len(content)} chars of text with OpenAI")
                return content
            else:
                logger.error("Unexpected response structure from OpenAI API")
                return ""
                
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            raise
    
    def ensure_model_available(self) -> bool:
        """
        Check if the OpenAI API key is valid and the model is available
        """
        try:
            # Simple model check to test the API key
            response = openai.models.list()
            available_models = [model.id for model in response.data]
            
            if self.model not in available_models:
                logger.warning(f"Model {self.model} may not be available in your OpenAI plan.")
                logger.info(f"Available models include: {', '.join(available_models[:5])}")
                
                # Try to suggest a fallback model
                fallback = next((m for m in available_models if "gpt-4" in m), next((m for m in available_models if "gpt-3.5" in m), None))
                if fallback:
                    logger.info(f"Consider using {fallback} as an alternative")
                    self.model = fallback
            
            return True
            
        except Exception as e:
            logger.error(f"Error checking OpenAI API: {e}")
            logger.warning("OpenAI API key may be invalid or expired")
            return False
