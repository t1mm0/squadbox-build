#!/usr/bin/env python
# -*- coding: utf-8 -*-
# File: template_manager.py
# Description: Template management for Squadbox project generation
# Last modified: 2024-11-03
# By: AI Assistant
# Completeness: 100

import os
import json
import logging
from typing import Dict, List, Any, Optional
import re
from pathlib import Path

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class TemplateManager:
    """
    Manages templates for project generation
    """
    def __init__(self, templates_dir: str = "templates"):
        """Initialize with path to templates directory"""
        self.templates_dir = templates_dir
        self.templates_path = os.path.join(os.path.dirname(__file__), templates_dir)
        self.templates = self._load_templates()
    
    def _load_templates(self) -> Dict[str, Dict]:
        """Load all template files from the templates directory"""
        templates = {}
        
        try:
            template_files = [f for f in os.listdir(self.templates_path) 
                             if f.endswith('.json') and os.path.isfile(os.path.join(self.templates_path, f))]
            
            for template_file in template_files:
                template_name = os.path.splitext(template_file)[0]
                template_path = os.path.join(self.templates_path, template_file)
                
                with open(template_path, 'r') as f:
                    template_data = json.load(f)
                    templates[template_name] = template_data
                    logger.info(f"Loaded template: {template_name}")
        
        except Exception as e:
            logger.error(f"Error loading templates: {str(e)}")
        
        return templates
    
    def get_available_templates(self) -> List[Dict]:
        """Get list of available templates with basic info"""
        return [
            {
                "id": template_id,
                "name": template_data.get("name", template_id),
                "description": template_data.get("description", ""),
                "tech_stack": template_data.get("tech_stack", [])
            }
            for template_id, template_data in self.templates.items()
        ]
    
    def get_template_details(self, template_id: str) -> Optional[Dict]:
        """Get full template details by ID"""
        return self.templates.get(template_id)
    
    def apply_template(self, template_id: str, project_path: str, project_name: str, 
                       custom_requirements: List[str] = None) -> Dict:
        """
        Apply a template to generate project structure
        
        Args:
            template_id: ID of the template to use
            project_path: Path where project will be created
            project_name: Name of the project (for variable substitution)
            custom_requirements: Additional custom requirements
            
        Returns:
            Dict with status and generated files
        """
        template = self.templates.get(template_id)
        if not template:
            return {"status": "error", "message": f"Template {template_id} not found"}
        
        os.makedirs(project_path, exist_ok=True)
        generated_files = []
        
        try:
            # Create base files defined in template
            base_files = template.get("base_files", [])
            for file_def in base_files:
                file_path = os.path.join(project_path, file_def["path"])
                
                # Create subdirectories if needed
                os.makedirs(os.path.dirname(file_path), exist_ok=True)
                
                # Handle content based on type
                content = file_def["content"]
                
                if isinstance(content, dict):
                    # Convert dict to JSON string with proper formatting
                    content = json.dumps(content, indent=2)
                    
                # Replace template variables
                content = self._replace_variables(content, {
                    "project_name": project_name
                })
                
                # Write file
                with open(file_path, "w") as f:
                    f.write(content)
                
                generated_files.append(file_path)
                logger.info(f"Created file: {file_path}")
            
            # Generate source code files based on structure
            if "structure" in template:
                structure_files = self._generate_structure_files(template, project_path, project_name)
                generated_files.extend(structure_files)
            
            # Create a project structure summary
            structure_path = os.path.join(project_path, "project_structure.md")
            with open(structure_path, "w") as f:
                f.write(f"# {project_name} Structure\n\n")
                f.write(f"Template: {template.get('name')}\n\n")
                
                f.write("## Pages/Sections\n\n")
                # Add pages/sections from template structure
                if "structure" in template:
                    if "pages" in template["structure"]:
                        for page in template["structure"]["pages"]:
                            f.write(f"- {page['name']}\n")
                            if "sections" in page:
                                for section in page["sections"]:
                                    f.write(f"  - {section}\n")
                    elif "sections" in template["structure"]:
                        for section in template["structure"]["sections"]:
                            f.write(f"- {section['name']}\n")
                            if "components" in section:
                                for component in section["components"]:
                                    f.write(f"  - {component}\n")
                                    
                f.write("\n## Components\n\n")
                if "structure" in template and "components" in template["structure"]:
                    for component in template["structure"]["components"]:
                        f.write(f"- {component}\n")
                        
                f.write("\n## Tech Stack\n\n")
                if "tech_stack" in template:
                    for tech in template["tech_stack"]:
                        f.write(f"- {tech}\n")
                
                # Add custom requirements
                if custom_requirements:
                    f.write("\n## Custom Requirements\n\n")
                    for req in custom_requirements:
                        f.write(f"- {req}\n")
                
            generated_files.append(structure_path)
            
            return {
                "status": "success", 
                "message": f"Template {template_id} applied successfully",
                "files": generated_files
            }
            
        except Exception as e:
            logger.error(f"Error applying template {template_id}: {str(e)}")
            return {"status": "error", "message": f"Error applying template: {str(e)}"}
    
    def _replace_variables(self, content: str, variables: Dict[str, str]) -> str:
        """Replace template variables in content"""
        for var_name, var_value in variables.items():
            # Replace {{variable}} format
            content = content.replace(f"{{{{{var_name}}}}}", var_value)
            # Also replace [[variable]] format
            content = content.replace(f"[[{var_name}]]", var_value)
        return content
        
    def _generate_structure_files(self, template: Dict, project_path: str, project_name: str) -> List[str]:
        """Generate actual source code files based on template structure"""
        generated_files = []
        tech_stack = template.get("tech_stack", [])
        structure = template.get("structure", {})
        
        # Determine the structure of the project based on tech stack
        is_next_js = "Next.js" in tech_stack
        is_react = "React" in tech_stack or "Next.js" in tech_stack
        is_typescript = "TypeScript" in tech_stack
        
        file_ext = "tsx" if is_typescript and is_react else "jsx" if is_react else "ts" if is_typescript else "js"
        
        # Create src directory for most projects
        src_dir = os.path.join(project_path, "src")
        os.makedirs(src_dir, exist_ok=True)
        
        # Create standard directories
        if is_next_js:
            # Next.js app directory structure
            app_dir = os.path.join(src_dir, "app")
            os.makedirs(app_dir, exist_ok=True)
            components_dir = os.path.join(src_dir, "components")
            os.makedirs(components_dir, exist_ok=True)
            
            # Create app/layout.{ext}
            layout_content = self._generate_base_layout(project_name, is_typescript)
            layout_path = os.path.join(app_dir, f"layout.{file_ext}")
            with open(layout_path, "w") as f:
                f.write(layout_content)
            generated_files.append(layout_path)
            
            # Create app/globals.css
            globals_css_path = os.path.join(app_dir, "globals.css")
            with open(globals_css_path, "w") as f:
                f.write(self._generate_base_css())
            generated_files.append(globals_css_path)
        else:
            # Standard React project structure
            components_dir = os.path.join(src_dir, "components")
            os.makedirs(components_dir, exist_ok=True)
            
            # Create App.{ext}
            app_content = self._generate_base_app(project_name, is_typescript)
            app_path = os.path.join(src_dir, f"App.{file_ext}")
            with open(app_path, "w") as f:
                f.write(app_content)
            generated_files.append(app_path)
            
            # Create index.{ext}
            index_content = self._generate_base_index(is_typescript)
            index_path = os.path.join(src_dir, f"index.{file_ext}")
            with open(index_path, "w") as f:
                f.write(index_content)
            generated_files.append(index_path)
        
        # Generate page files
        if "pages" in structure:
            pages = structure["pages"]
            for page in pages:
                page_name = page["name"]
                file_name = self._page_name_to_file_name(page_name)
                
                if is_next_js:
                    # For Next.js, create app/page-name/page.{ext}
                    page_dir = os.path.join(app_dir, file_name)
                    os.makedirs(page_dir, exist_ok=True)
                    page_file_path = os.path.join(page_dir, f"page.{file_ext}")
                    
                    # For home page, also add to root
                    if page_name.lower() == "home":
                        root_page_path = os.path.join(app_dir, f"page.{file_ext}")
                        with open(root_page_path, "w") as f:
                            f.write(self._generate_page_content(page_name, page.get("sections", []), is_typescript))
                        generated_files.append(root_page_path)
                else:
                    # For standard React, create src/pages/PageName.{ext}
                    pages_dir = os.path.join(src_dir, "pages")
                    os.makedirs(pages_dir, exist_ok=True)
                    page_file_path = os.path.join(pages_dir, f"{self._capitalize(file_name)}.{file_ext}")
                
                # Generate page content based on sections
                with open(page_file_path, "w") as f:
                    f.write(self._generate_page_content(page_name, page.get("sections", []), is_typescript))
                
                generated_files.append(page_file_path)
        
        # Generate component files
        if "components" in structure:
            components = structure["components"]
            for component in components:
                component_file_path = os.path.join(components_dir, f"{component}.{file_ext}")
                with open(component_file_path, "w") as f:
                    f.write(self._generate_component_content(component, is_typescript))
                generated_files.append(component_file_path)
        
        return generated_files
    
    def _page_name_to_file_name(self, page_name: str) -> str:
        """Convert page name to file name format"""
        # Remove any non-alphanumeric characters and replace spaces with hyphens
        return re.sub(r'[^\w\s]', '', page_name).lower().replace(' ', '-')
    
    def _capitalize(self, s: str) -> str:
        """Capitalize first letter of each word and remove hyphens"""
        return ''.join(word.capitalize() for word in s.split('-'))
    
    def _generate_base_layout(self, project_name: str, is_typescript: bool) -> str:
        """Generate base Next.js layout file"""
        type_def = ": { children: React.ReactNode }" if is_typescript else ""
        return f'''import './globals.css';

export const metadata = {{  
  title: "{project_name}",
          description: "Generated by Squadbox",
}};

export default function RootLayout({{ children }}{type_def}) {{
  return (
    <html lang="en">
      <body>
        <main>
          {"{children}"}
        </main>
      </body>
    </html>
  );
}}
'''
    
    def _generate_base_app(self, project_name: str, is_typescript: bool) -> str:
        """Generate base React App file"""
        return f'''import {{ useState }} from 'react';

function App() {{
  return (
    <div className="App">
      <header>
        <h1>{project_name}</h1>
      </header>
      <main>
        {"{/* Your content here */}"}
      </main>
      <footer>
        <p>© {project_name}</p>
      </footer>
    </div>
  );
}}

export default App;
'''
    
    def _generate_base_index(self, is_typescript: bool) -> str:
        """Generate base index file"""
        return '''import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
'''
    
    def _generate_base_css(self) -> str:
        """Generate base CSS file"""
        return '''@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary-color: #3490dc;
  --secondary-color: #ffed4a;
  --dark-color: #1a202c;
}

body {
  @apply bg-gray-50 text-gray-900 min-h-screen;
}
'''
    
    def _generate_page_content(self, page_name: str, sections: List[str], is_typescript: bool) -> str:
        """Generate page content with sections"""
        section_imports = ''
        section_components = ''
        
        for section in sections:
            section_capitalized = ''.join(word.capitalize() for word in section.split('-'))
            section_imports += f"import {section_capitalized} from '../components/{section_capitalized}';\n"
            section_components += f"      <{section_capitalized} />\n"
        
        return f'''import React from 'react';
{section_imports}
export default function {self._capitalize(page_name)}() {{
  return (
    <div className="page {page_name.lower()}">
      <h1>{page_name}</h1>
{section_components}    </div>
  );
}}
'''
    
    def _generate_component_content(self, component_name: str, is_typescript: bool) -> str:
        """Generate component content"""
        props_type = "Props " if is_typescript else ""
        type_def = "\ntype Props = {\n  // Add props here\n};\n" if is_typescript else ""
        
        return f'''{type_def}export default function {component_name}({props_type}) {{
  return (
    <div className="component {component_name.lower()}">
      <h2>{component_name}</h2>
      {"{/* Component content will go here */}"}
    </div>
  );
}}
'''

# Example usage
if __name__ == "__main__":
    template_mgr = TemplateManager()
    templates = template_mgr.get_available_templates()
    print(f"Available templates: {templates}")
    
    # Example: Apply template
    # result = template_mgr.apply_template(
    #     "portfolio_template", 
    #     "./generated_projects/example", 
    #     "My Portfolio",
    #     ["Custom animation effects", "Dark theme"]
    # )
    # print(result)