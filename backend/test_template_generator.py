#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# File: test_template_generator.py
# Description: Test script for template-based file generation
# Last modified: 2025-08-06
# By: AI Assistant
# Completeness: 100

import os
import shutil
from pathlib import Path
from template_manager import TemplateManager

# Setup test directory
test_dir = Path("./test_generated")
if test_dir.exists():
    shutil.rmtree(test_dir)
os.makedirs(test_dir, exist_ok=True)

print("Testing template-based project generation...")

# Initialize template manager
template_mgr = TemplateManager()

# Get available templates
templates = template_mgr.get_available_templates()
print(f"Available templates: {[t['name'] for t in templates]}")

# Choose a template to test
template_id = "ecommerce_template"  # Change this to test different templates
template = template_mgr.get_template_details(template_id)

if not template:
    print(f"Template {template_id} not found!")
    exit(1)

print(f"Using template: {template['name']}")

# Apply template
result = template_mgr.apply_template(
    template_id, 
    str(test_dir), 
    "Test E-Commerce Project",
    ["Test requirement 1", "Test requirement 2"]
)

print("\nResult:", result["status"])
print(f"Generated {len(result['files'])} files")

# List all generated files
print("\nGenerated files:")
for file_path in result['files']:
    rel_path = os.path.relpath(file_path, test_dir)
    print(f"- {rel_path}")

print("\nTest complete. Check the ./test_generated directory for results.")