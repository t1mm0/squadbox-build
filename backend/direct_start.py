#!/usr/bin/env python3
# Direct start script for the backend with key reading

import os
import sys
from pathlib import Path
import uvicorn

def main():
    # Get the path to the .env file
    env_path = Path(__file__).parent.parent / '.env'
    
    # Read API key from .env file directly
    api_key = None
    try:
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line.startswith('OPENAI_API_KEY='):
                    api_key = line.split('=', 1)[1].strip()
                    break
    except Exception as e:
        print(f"Error reading .env file: {e}")
        return 1

    if not api_key:
        print("No OPENAI_API_KEY found in .env file")
        return 1
        
    # Set API key as environment variable
    os.environ['OPENAI_API_KEY'] = api_key
    print(f"API key set from .env file (starting with: {api_key[:5]}...)")
    
    # Start the backend server
    print("Starting FastAPI backend server...")
    uvicorn.run("app:app", host="0.0.0.0", port=8000)

if __name__ == "__main__":
    # Ensure we're in the backend directory
    os.chdir(Path(__file__).parent)
    sys.exit(main())