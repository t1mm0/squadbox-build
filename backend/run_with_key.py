#!/usr/bin/env python
# -*- coding: utf-8 -*-
# File: run_with_key.py
# Description: Launches the Squadbox API with a direct OpenAI API key
# Last modified: 2023-11-05
# By: AI Assistant
# Completeness: 100

import sys
import os
import uvicorn
import argparse
from pathlib import Path

def main():
    parser = argparse.ArgumentParser(description='Run Squadbox API with configurable LLM provider')
    
    # LLM provider option
    parser.add_argument('--provider', choices=['openai', 'ollama'], default='openai',
                        help='LLM provider to use (openai or ollama)')
    
    # API key options
    key_group = parser.add_mutually_exclusive_group()
    key_group.add_argument('--api-key', help='Your OpenAI API key')
    key_group.add_argument('--api-key-path', help='Path to a file containing your OpenAI API key')
    
    # OpenAI model options
    parser.add_argument('--model', help='OpenAI model to use (e.g., gpt-4o, gpt-3.5-turbo)')
    
    # Server options
    parser.add_argument('--host', default='127.0.0.1', help='Host to bind the server to')
    parser.add_argument('--port', type=int, default=8000, help='Port to bind the server to')
    parser.add_argument('--reload', action='store_true', help='Enable auto-reload on code changes')
    
    args = parser.parse_args()
    
    # Set environment variables for LLM provider
    os.environ['LLM_PROVIDER'] = args.provider
    print(f"Using LLM provider: {args.provider}")
    
    # Set OpenAI-specific environment variables if using OpenAI
    if args.provider == 'openai':
        if args.api_key:
            os.environ['OPENAI_API_KEY'] = args.api_key
            print(f"Using provided OpenAI API key directly")
        elif args.api_key_path:
            os.environ['OPENAI_API_KEY_PATH'] = args.api_key_path
            print(f"Using OpenAI API key from file: {args.api_key_path}")
        else:
            print("Warning: No OpenAI API key provided. Will attempt to use key from environment variables.")
            
        if args.model:
            os.environ['OPENAI_MODEL'] = args.model
            print(f"Using OpenAI model: {args.model}")
    
    # Run the server
    print(f"Starting Squadbox API server at {args.host}:{args.port}")
    uvicorn.run(
        "app:app",
        host=args.host,
        port=args.port,
        reload=args.reload
    )

if __name__ == "__main__":
    # Ensure we're in the backend directory
    os.chdir(Path(__file__).parent)
    main()