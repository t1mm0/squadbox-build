#!/usr/bin/env python
# -*- coding: utf-8 -*-
# File: direct_key_example.py
# Description: Example showing direct API key usage in Squabdox
# Last modified: 2024-11-03

from ai_generator import AICodeGenerator
from project_generator import ProjectGenerator
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def main():
    # Replace this with your actual API key
    api_key = "your_openai_api_key_here"
    
    # Method 1: Use API key directly with AICodeGenerator
    ai_generator = AICodeGenerator(api_key=api_key)
    
    # Test generate a simple README file
    logger.info("Testing AI generator with direct API key...")
    try:
        files = ai_generator.generate_project(
            requirements=["Create a simple README file for a Python project"],
            project_type="web"
        )
        
        if "README.md" in files:
            logger.info("Successfully generated README.md with direct API key")
            logger.info("README content preview:")
            logger.info(files["README.md"][:200] + "...")
        else:
            logger.info("Generated files: " + str(list(files.keys())))
    except Exception as e:
        logger.error(f"Error testing AI generator: {e}")
    
    # Method 2: Use API key with ProjectGenerator
    logger.info("\nInitializing ProjectGenerator with direct API key...")
    project_generator = ProjectGenerator(
        projects_dir="generated_projects",
        api_key=api_key
    )
    
    # Method 3: Using API key from file path
    # Uncomment to test this method:
    """
    # Create a file with just your API key
    with open("my_openai_key.txt", "w") as f:
        f.write(api_key)
        
    # Use API key path
    project_generator_with_path = ProjectGenerator(
        projects_dir="generated_projects",
        api_key_path="my_openai_key.txt"
    )
    """

if __name__ == "__main__":
    main()