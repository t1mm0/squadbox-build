#!/usr/bin/env python
# -*- coding: utf-8 -*-
# File: test_openai_key.py
# Description: Script to test if OpenAI API key is working correctly
# Last modified: 2024-11-03

import os
import sys
from dotenv import load_dotenv
from pathlib import Path
import openai

# Load environment variables from .env file in the parent directory
load_dotenv(Path(__file__).parent.parent / '.env')

def main():
    print("Testing OpenAI API key...")
    
    # Check if API key is set in environment variables
    api_key = os.environ.get("OPENAI_API_KEY")
    api_key_path = os.environ.get("OPENAI_API_KEY_PATH")
    
    if not api_key and not api_key_path:
        print("ERROR: No API key found in environment variables.")
        print("Please set OPENAI_API_KEY or OPENAI_API_KEY_PATH in your .env file.")
        return False
        
    try:
        # Try to use the API key
        if api_key:
            print(f"Using OPENAI_API_KEY from environment (first 5 chars: {api_key[:5]}...)")
            openai.api_key = api_key
        elif api_key_path:
            print(f"Using OPENAI_API_KEY_PATH: {api_key_path}")
            openai.api_key_path = api_key_path
        
        # Test the API with a simple completion request
        print("Testing API with a simple request...")
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",  # Using a cheaper model for testing
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": "Say 'API key is working!' if you can read this."}
            ],
            max_tokens=20
        )
        
        content = response.choices[0].message.content
        print(f"API Response: {content}")
        
        if "API key is working" in content:
            print("\nSUCCESS! Your OpenAI API key is working correctly.")
            return True
        else:
            print("\nWARNING: Received a response, but it didn't contain the expected text.")
            print("This might indicate an issue with the API, but your key seems valid.")
            return True
            
    except Exception as e:
        print(f"\nERROR: OpenAI API test failed: {e}")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)