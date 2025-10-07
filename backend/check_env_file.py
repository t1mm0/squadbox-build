#!/usr/bin/env python3
# Simple script to check the .env file content

import os
import sys
from pathlib import Path

def main():
    # Path to the .env file
    env_path = Path(__file__).parent.parent / '.env'
    
    print(f"Checking .env file at: {env_path}")
    
    if not env_path.exists():
        print(f"ERROR: .env file not found at {env_path}")
        return
    
    print("\nReading .env file content:")
    try:
        with open(env_path, 'r') as f:
            content = f.read()
            
        # Split by lines and print each line
        lines = content.strip().split('\n')
        for line in lines:
            if line.strip() and not line.strip().startswith('#'):
                # For API keys, mask all but the first few chars
                if 'API_KEY' in line:
                    parts = line.split('=', 1)
                    if len(parts) == 2:
                        key_name = parts[0].strip()
                        value = parts[1].strip()
                        # Mask all but first 5 characters of the API key
                        if len(value) > 8:
                            masked_value = value[:5] + '*' * (len(value) - 5)
                        else:
                            masked_value = '***VERY SHORT KEY***'
                        print(f"{key_name}={masked_value}")
                else:
                    print(line)
        
        # Also try manually loading key config variables from .env
        llm_provider = None
        openai_api_key = None
        openai_api_path = None
        openai_model = None
        
        for line in lines:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
                
            if '=' in line:
                key, value = line.split('=', 1)
                key = key.strip()
                value = value.strip()
                
                if key == 'LLM_PROVIDER':
                    llm_provider = value
                elif key == 'OPENAI_API_KEY':
                    openai_api_key = value
                elif key == 'OPENAI_API_KEY_PATH':
                    openai_api_path = value
                elif key == 'OPENAI_MODEL':
                    openai_model = value
        
        print("\nManually extracted variables:")
        if llm_provider:
            print(f"LLM_PROVIDER={llm_provider}")
        else:
            print("LLM_PROVIDER not found in .env file, will default to 'ollama'")
            
        if llm_provider == 'openai':
            if openai_api_key:
                masked_key = openai_api_key[:5] + '*' * (len(openai_api_key) - 5) if len(openai_api_key) > 8 else '***VERY SHORT KEY***'
                print(f"OPENAI_API_KEY={masked_key}")
            else:
                print("OPENAI_API_KEY not found in .env file")
                
            if openai_api_path:
                print(f"OPENAI_API_KEY_PATH={openai_api_path}")
            else:
                print("OPENAI_API_KEY_PATH not found in .env file")
                
            if openai_model:
                print(f"OPENAI_MODEL={openai_model}")
            else:
                print("OPENAI_MODEL not found in .env file, will default to 'gpt-4o'")
        else:
            print("Using local Ollama LLM provider")
            
    except Exception as e:
        print(f"ERROR reading .env file: {e}")
    
if __name__ == "__main__":
    main()