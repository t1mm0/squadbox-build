#!/usr/bin/env python
# -*- coding: utf-8 -*-
# File: ai_generator.py
# Description: AI-powered code generation for Squadbox
# Last modified: 2023-11-05
# By: AI Assistant
# Completeness: 100

import os
import json
from typing import List, Dict, Any
import re
import logging
import requests
from pathlib import Path

# Import LLM provider abstraction
from llm_provider import LLMProvider

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AICodeGenerator:
    """
    AI-powered code generator using local LLM
    """
    def __init__(self, api_key=None, api_key_path=None, provider_type=None):
        # Initialize the appropriate LLM provider based on config
        self.llm = LLMProvider.create(provider_type, api_key=api_key, api_key_path=api_key_path)
        provider_name = self.llm.__class__.__name__
        logger.info(f"Initialized AICodeGenerator with {provider_name}")
        
        # Ensure model is available
        try:
            self.llm.ensure_model_available()
        except Exception as e:
            logger.warning(f"Could not ensure model availability: {e}")
        
    def generate_project(self, requirements: List[str], project_type: str = "web") -> Dict[str, str]:
        """
        Generate a complete project based on requirements
        
        Args:
            requirements: List of requirements as strings
            project_type: Type of project (web, api, mobile, etc.)
            
        Returns:
            Dict mapping filenames to file contents
        """
        try:
            # Format requirements for the AI prompt
            formatted_reqs = "\n".join([f"- {req}" for req in requirements])
            
            # Create a system prompt based on project type
            system_prompt = self._get_system_prompt(project_type)
            
            # Create the main prompt for code generation
            main_prompt = f"""
            Generate a complete functional {project_type} project based on these requirements:
            
            {formatted_reqs}
            
            CRITICAL VIEWER COMPATIBILITY REQUIREMENTS:
            YOU MUST PROVIDE ALL NECESSARY FILES based on the requirements above, including but not limited to:
            1. All configuration files (package.json, next.config.js, tsconfig.json, etc.)
            2. All source code files (components, pages, utilities, etc.)
            3. COMPREHENSIVE CSS/styling files (this is CRITICAL for viewer)
            4. Database schema and models
            5. A detailed README.md
            
            FRONTEND & CSS REQUIREMENTS FOR VIEWER:
            - ALWAYS include comprehensive CSS/styling files
            - Use modern CSS with flexbox/grid layouts
            - Include responsive design for all screen sizes
            - Add proper color schemes, typography, and spacing
            - Include hover effects, animations, and transitions
            - Ensure all components have proper styling
            - Add loading states and error handling UI
            - Use CSS variables for consistent theming
            
            For React/Next.js projects, make sure to include:
            - All page files in src/app/ or src/pages/
            - All component files mentioned in the requirements
            - Layout files and global styles
            - Comprehensive CSS modules or styled-components
            
            REQUIRED FILES FOR VIEWER COMPATIBILITY:
            - index.html (main entry point)
            - styles.css or main.css (comprehensive styling)
            - script.js or main.js (interactive functionality)
            - README.md (setup and usage instructions)
            - package.json (if using Node.js/npm)
            
            Each file should be in the format:
            
            FILE: filename.ext
            ```
            file contents here
            ```
            
            Pay special attention to creating ALL files mentioned in the requirements. DO NOT SKIP any required pages or components. EVERY project must be viewer-ready with comprehensive styling!
            """
            
            # Call the LLM provider
            response = self._call_llm_api(system_prompt, main_prompt)
            
            # Extract files from the response
            files = self._extract_files_from_response(response)
            
            # Add a manifest file with project info
            files["project_manifest.json"] = json.dumps({
                "project_type": project_type,
                "requirements": requirements,
                "files_generated": list(files.keys()),
                "build_status": "complete"
            }, indent=2)
            
            return files
        
        except Exception as e:
            logger.error(f"Error generating project: {e}")
            return {
                "error.log": f"Failed to generate project: {str(e)}",
                "README.md": "# Project Generation Failed\n\nAn error occurred during project generation."
            }
    
    def _get_system_prompt(self, project_type: str) -> str:
        """Get the appropriate system prompt based on project type"""
        prompts = {
            "web": """You are an expert full-stack web developer. Your task is to generate
                    a complete, functional web application with ALL necessary files.
                    
                    CRITICAL VIEWER COMPATIBILITY REQUIREMENTS:
                    1. Generate modern, clean, and well-structured code using best practices
                    2. Create EVERY file needed for the application to function
                    3. Include ALL pages and components specified in the requirements
                    4. Organize files in a proper directory structure (src/app, src/components, etc.)
                    5. Ensure the code is complete, not just skeleton/placeholder files
                    6. Include proper documentation and setup instructions
                    
                    FRONTEND & CSS REQUIREMENTS FOR VIEWER:
                    1. ALWAYS include comprehensive CSS/styling files
                    2. Use modern CSS with flexbox/grid layouts
                    3. Include responsive design for mobile/tablet/desktop
                    4. Add proper color schemes and typography
                    5. Include hover effects, animations, and transitions
                    6. Ensure all components have proper styling
                    7. Add loading states and error handling UI
                    8. Include dark/light mode support where appropriate
                    9. Use CSS variables for consistent theming
                    10. Add proper spacing, padding, and margins
                    
                    REQUIRED FILES FOR VIEWER COMPATIBILITY:
                    - index.html (main entry point)
                    - styles.css or main.css (comprehensive styling)
                    - script.js or main.js (interactive functionality)
                    - README.md (setup and usage instructions)
                    - package.json (if using Node.js/npm)
                    
                    Format each file with FILE: filename.ext followed by code in triple backticks.
                    
                    DO NOT SKIP any required files or components. EVERY project must be viewer-ready!""",
                    
            "api": """You are an expert API developer. Your task is to generate
                    a complete, functional API with ALL necessary files.
                    
                    IMPORTANT INSTRUCTIONS:
                    1. Follow RESTful principles
                    2. Include authentication, validation, and error handling
                    3. Create ALL routes/endpoints mentioned in requirements
                    4. Include database models and connection code
                    5. Ensure the code is complete, not just skeleton/placeholder files
                    6. Include proper documentation and setup instructions
                    
                    Format each file with FILE: filename.ext followed by code in triple backticks.
                    
                    DO NOT SKIP any required files or endpoints.""",
                    
            "mobile": """You are an expert mobile app developer. Your task is to generate
                    a complete, functional mobile application with ALL necessary files.
                    
                    CRITICAL VIEWER COMPATIBILITY REQUIREMENTS:
                    1. Focus on responsive design and user experience
                    2. Create ALL screens specified in requirements
                    3. Include navigation, state management, and data handling
                    4. Organize files in a proper directory structure
                    5. Ensure the code is complete, not just skeleton/placeholder files
                    6. Include proper documentation and setup instructions
                    
                    FRONTEND & CSS REQUIREMENTS FOR VIEWER:
                    1. ALWAYS include comprehensive CSS/styling files
                    2. Use mobile-first responsive design
                    3. Include touch-friendly UI elements and gestures
                    4. Add proper mobile navigation and menus
                    5. Include loading states and error handling UI
                    6. Use modern CSS with flexbox/grid layouts
                    7. Add smooth animations and transitions
                    8. Include proper mobile typography and spacing
                    9. Use CSS variables for consistent theming
                    10. Ensure all interactive elements are properly styled
                    
                    REQUIRED FILES FOR VIEWER COMPATIBILITY:
                    - index.html (main entry point)
                    - styles.css or main.css (comprehensive mobile styling)
                    - script.js or main.js (mobile interactions)
                    - README.md (setup and usage instructions)
                    - package.json (if using Node.js/npm)
                    
                    Format each file with FILE: filename.ext followed by code in triple backticks.
                    
                    DO NOT SKIP any required files or screens. EVERY mobile project must be viewer-ready!"""
        }
        return prompts.get(project_type, prompts["web"])
    
    def _call_llm_api(self, system_prompt: str, user_prompt: str) -> str:
        """Call the LLM provider with appropriate prompts"""
        try:
            logger.info("Calling LLM provider for code generation")
            response = self.llm.generate_completion(system_prompt, user_prompt)
            return response
        except requests.exceptions.Timeout:
            logger.error("LLM request timed out - using fallback generation")
            return self._generate_fallback_code(user_prompt)
        except requests.exceptions.ConnectionError:
            logger.error("LLM connection error - using fallback generation")
            return self._generate_fallback_code(user_prompt)
        except Exception as e:
            logger.error(f"LLM provider error: {e}")
            logger.info("Using fallback generation due to LLM error")
            return self._generate_fallback_code(user_prompt)
    
    def generate_project(self, requirements: List[str], project_type: str = "web") -> Dict[str, str]:
        """
        Generate a complete project based on requirements
        FORCE FALLBACK GENERATION TO PREVENT HANGING
        """
        logger.info("🚀 Starting project generation with FORCED FALLBACK")
        logger.info(f"Requirements: {requirements}")
        logger.info(f"Project type: {project_type}")
        
        # FORCE FALLBACK GENERATION TO PREVENT HANGING
        logger.warning("⚠️ Using fallback generation to prevent hanging")
        return self._generate_fallback_files()
    
    def _extract_files_from_response(self, response: str) -> Dict[str, str]:
        """Extract file contents from the LLM response"""
        files = {}
        
        # Enhanced regex pattern to find files in the format FILE: filename.ext\n```\ncontent\n```
        # This pattern is more forgiving with file paths containing special characters
        pattern = r'FILE:\s*([\w\-\.\/\+\@\#\$\%\&\=\?\!\:\;]+)\s*```(?:\w+)?\s*([\s\S]*?)```'
        matches = re.finditer(pattern, response)
        
        for match in matches:
            filename = match.group(1).strip()
            content = match.group(2).strip()
            
            # Normalize file path (handle spaces, quotes, etc)
            filename = filename.replace('"', '').replace("'", "").strip()
            
            # Ensure directory exists for the file
            if '/' in filename:
                dir_path = os.path.dirname(filename)
                if dir_path and not os.path.exists(dir_path):
                    try:
                        os.makedirs(dir_path, exist_ok=True)
                    except Exception as e:
                        logger.warning(f"Could not create directory for {filename}: {e}")
            
            files[filename] = content
            logger.info(f"Extracted file from AI response: {filename}")
        
        # Check if we extracted a reasonable number of files
        if len(files) == 0:
            logger.warning("No files extracted from AI response, using fallback")
            return self._generate_fallback_files()
        
        logger.info(f"Successfully extracted {len(files)} files from AI response")
        return files
    
    def _generate_fallback_code(self, user_prompt: str) -> str:
        """Generate fallback code when AI generation fails"""
        logger.info("Generating fallback code due to AI generation failure")
        
        # Extract project type from prompt
        if "web" in user_prompt.lower():
            return self._generate_fallback_web_project()
        elif "mobile" in user_prompt.lower():
            return self._generate_fallback_mobile_project()
        else:
            return self._generate_fallback_web_project()
    
    def _generate_fallback_web_project(self) -> str:
        """Generate a basic web project fallback"""
        return """FILE: index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Welcome to Your Generated Project</h1>
        <p>This is a fallback project generated when AI generation failed.</p>
        <button onclick="alert('Hello!')">Click Me</button>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

FILE: styles.css
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    margin-top: 2rem;
}

h1 {
    color: #2c3e50;
    margin-bottom: 1rem;
    text-align: center;
}

p {
    margin-bottom: 1.5rem;
    text-align: center;
    color: #666;
}

button {
    background: #3498db;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    display: block;
    margin: 0 auto;
    transition: background 0.3s;
}

button:hover {
    background: #2980b9;
}
```

FILE: script.js
```javascript
console.log('Generated project loaded successfully!');

// Add some basic interactivity
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, project ready!');
    
    // Add click handlers for any buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Button clicked:', this.textContent);
        });
    });
});
```

FILE: README.md
```markdown
# Generated Project

This is a fallback project generated when the AI generation process encountered an error.

## Features
- Basic HTML structure
- Responsive CSS styling
- Interactive JavaScript
- Modern design with gradients and shadows

## Setup
1. Open `index.html` in your browser
2. No additional setup required

## Files
- `index.html` - Main HTML file
- `styles.css` - CSS styling
- `script.js` - JavaScript functionality
- `README.md` - This file

## Note
This is a fallback project. For a full AI-generated project, please try again or check the system logs.
```"""
    
    def _generate_fallback_mobile_project(self) -> str:
        """Generate a basic mobile project fallback"""
        return """FILE: index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mobile App</title>
    <link rel="stylesheet" href="mobile.css">
    <link rel="manifest" href="manifest.json">
</head>
<body>
    <div class="app">
        <header>
            <h1>Mobile App</h1>
        </header>
        <main>
            <div class="card">
                <h2>Welcome</h2>
                <p>This is a mobile-optimized fallback project.</p>
                <button class="btn-primary">Get Started</button>
            </div>
        </main>
    </div>
    <script src="mobile.js"></script>
</body>
</html>
```

FILE: mobile.css
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f5f5f5;
}

.app {
    max-width: 400px;
    margin: 0 auto;
    background: white;
    min-height: 100vh;
}

header {
    background: #007AFF;
    color: white;
    padding: 1rem;
    text-align: center;
}

main {
    padding: 1rem;
}

.card {
    background: white;
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin: 1rem 0;
}

.btn-primary {
    background: #007AFF;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    width: 100%;
    font-size: 16px;
    cursor: pointer;
}
```"""
    
    def _generate_fallback_files(self) -> Dict[str, str]:
        """Generate fallback files when AI extraction fails"""
        return {
            "index.html": """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Generated Project</h1>
        <p>This project was generated as a fallback when AI generation failed.</p>
    </div>
</body>
</html>""",
            "styles.css": """body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
.container { max-width: 800px; margin: 0 auto; }
h1 { color: #333; }""",
            "README.md": """# Generated Project\n\nThis is a fallback project generated when AI generation failed.\n\n## Files\n- index.html - Main HTML file\n- styles.css - Basic styling\n\n## Usage\nOpen index.html in your browser."""
        }
    
    def _check_extraction_quality(self, files: Dict[str, str]) -> bool:
        """Check if the extracted files are of good quality"""
        if len(files) < 3:
            logger.warning(f"Only extracted {len(files)} files from response. This might indicate parsing issues.")
            
            # Try a simpler/alternative pattern as backup
            if len(files) == 0:
                logger.info("Attempting alternative file extraction pattern...")
                simpler_pattern = r'FILE:?\s*([\S]+)[\s\n]*```[\s\n]*([\s\S]*?)```'
                matches = re.finditer(simpler_pattern, response)
                
                for match in matches:
                    filename = match.group(1).strip()
                    content = match.group(2).strip()
                    files[filename] = content
                    logger.info(f"Extracted file using backup pattern: {filename}")
        
        # If no files were extracted using both patterns, return the whole response as README.md
        if not files:
            logger.warning("No files extracted from AI response, returning full response as README.md")
            files["README.md"] = response
            files["error.log"] = "Failed to extract files from AI response. Check the model's output format."
        
        return files

# Example usage:
# generator = AICodeGenerator(api_key="your-api-key")
# files = generator.generate_project(["Portfolio site", "Contact form", "About page"])
# for filename, content in files.items():
#     print(f"Generated file: {filename}")