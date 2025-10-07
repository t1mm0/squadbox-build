#!/usr/bin/env python
# -*- coding: utf-8 -*-
# File: test_llm_provider.py
# Description: Test script for LLM provider abstraction
# Last modified: 2023-11-05
# By: AI Assistant
# Completeness: 100

import os
import sys
import logging
from pathlib import Path

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load .env file if it exists
env_path = Path(__file__).parent.parent / '.env'
if env_path.exists():
    print(f"Loading environment variables from {env_path}")
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                key, value = line.split('=', 1)
                os.environ[key] = value
                if 'API_KEY' in key:
                    print(f"Found {key} in .env file")

# Import our LLM provider abstraction
try:
    from llm_provider import LLMProvider
except ImportError:
    sys.path.append(str(Path(__file__).parent))
    from llm_provider import LLMProvider

def test_openai_provider():
    """Test the OpenAI provider implementation"""
    print("\n--- Testing OpenAI Provider ---")
    
    # Set the LLM provider to OpenAI
    os.environ['LLM_PROVIDER'] = 'openai'
    
    # Check if we have an API key in environment
    api_key = os.environ.get('OPENAI_API_KEY')
    if not api_key:
        print("ERROR: OPENAI_API_KEY environment variable not set!")
        print("Please set OPENAI_API_KEY in your .env file or export it directly.")
        return False
        
    try:
        print(f"Creating OpenAI provider...")
        provider = LLMProvider.create()
        
        # Test model availability
        print("Testing model availability...")
        if provider.ensure_model_available():
            print("✅ Model is available")
        else:
            print("❌ Model is NOT available - check your API key and model access")
            return False
            
        # Test a simple completion
        print("\nTesting completion generation...")
        system_prompt = "You are a helpful AI assistant."
        user_prompt = "Write a short haiku about coding."
        
        print("Generating completion...")
        start_time = __import__('time').time()
        result = provider.generate_completion(system_prompt, user_prompt)
        end_time = __import__('time').time()
        
        print(f"\n--- Completion generated in {end_time - start_time:.2f} seconds ---")
        print(f"\nRESULT:\n{result}\n")
        print("✅ OpenAI provider test successful!")
        return True
        
    except Exception as e:
        print(f"\n❌ Error testing OpenAI provider: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_ollama_provider():
    """Test the Ollama provider implementation"""
    print("\n--- Testing Ollama Provider ---")
    
    # Set the LLM provider to Ollama (only if not already set)
    if not os.environ.get('LLM_PROVIDER'):
        os.environ['LLM_PROVIDER'] = 'ollama'
    
    try:
        print(f"Creating Ollama provider...")
        provider = LLMProvider.create()
        
        # Test model availability (skip actual pulling if not available)
        print("Testing if Ollama service is responding...")
        try:
            provider.ensure_model_available()
            print("✅ Ollama service is responding")
            
            # Test a simple completion (if wanted)
            response = input("Do you want to test a completion with Ollama? (y/N): ")
            if response.lower() == 'y':
                system_prompt = "You are a helpful AI assistant."
                user_prompt = "Write a short haiku about coding."
                
                print("Generating completion (this may take a moment)...")
                start_time = __import__('time').time()
                result = provider.generate_completion(system_prompt, user_prompt)
                end_time = __import__('time').time()
                
                print(f"\n--- Completion generated in {end_time - start_time:.2f} seconds ---")
                print(f"\nRESULT:\n{result}\n")
            
            print("✅ Ollama provider test complete!")
            
        except Exception as e:
            print(f"❌ Ollama service is NOT responding: {e}")
            print("Make sure Ollama is running locally or in Docker.")
            return False
            
        return True
        
    except Exception as e:
        print(f"\n❌ Error testing Ollama provider: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("LLM Provider Abstraction Test")
    print("=============================")
    
    # Determine which provider to test
    if len(sys.argv) > 1 and sys.argv[1] in ['openai', 'ollama', 'both']:
        providers_to_test = [sys.argv[1]]
        if sys.argv[1] == 'both':
            providers_to_test = ['openai', 'ollama']
    else:
        print("\nWhich provider would you like to test?")
        print("1. OpenAI")
        print("2. Ollama")
        print("3. Both")
        choice = input("Enter choice (1-3): ")
        
        if choice == '1':
            providers_to_test = ['openai']
        elif choice == '2':
            providers_to_test = ['ollama']
        else:
            providers_to_test = ['openai', 'ollama']
    
    results = {}
    
    # Test each selected provider
    for provider in providers_to_test:
        if provider == 'openai':
            results['openai'] = test_openai_provider()
        elif provider == 'ollama':
            results['ollama'] = test_ollama_provider()
    
    # Print summary
    print("\n--- Test Summary ---")
    for provider, success in results.items():
        print(f"{provider}: {'✅ PASSED' if success else '❌ FAILED'}")
