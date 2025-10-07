#!/usr/bin/env python
# -*- coding: utf-8 -*-
# File: llm_provider.py
# Description: Abstract LLM provider interface with implementations
# Last modified: 2023-11-05
# By: AI Assistant
# Completeness: 100

import os
import logging
import abc
import requests
from typing import Dict, Any, Optional, List

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class LLMProvider(abc.ABC):
    """Abstract base class for LLM providers"""
    
    @abc.abstractmethod
    def generate_completion(self, system_prompt: str, user_prompt: str) -> str:
        """Generate a completion from the LLM"""
        pass
    
    @abc.abstractmethod
    def ensure_model_available(self) -> bool:
        """Ensure the model is available for use"""
        pass
    
    @classmethod
    def create(cls, provider_type: str = None, **kwargs) -> 'LLMProvider':
        """
        Factory method to create the appropriate LLM provider
        
        Args:
            provider_type: Type of provider ("ollama", "openai", or None)
            **kwargs: Additional provider-specific arguments
            
        Returns:
            An instance of a concrete LLM provider
        """
        # Determine provider type from environment if not specified
        if not provider_type:
            provider_type = os.environ.get("LLM_PROVIDER", "ollama").lower()
            
        # Create appropriate provider
        if provider_type == "openai":
            from llm_provider_openai import OpenAIProvider
            return OpenAIProvider(**kwargs)
        else:
            # Default to Ollama
            from llm_provider_ollama import OllamaProvider
            return OllamaProvider(**kwargs)
