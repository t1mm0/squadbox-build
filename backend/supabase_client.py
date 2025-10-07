# Database client configuration for Squadbox Backend
# Purpose: Initialize database client for backend authentication and database operations
# Last modified: 2025-08-08
# Completeness score: 100

import os
import logging
from typing import Optional, Dict, Any

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import the database abstraction layer
from database_abstraction import database, DatabaseFactory, DB_PROVIDERS

# Create a manager class that uses the database abstraction
class DatabaseManager:
    """Manager class for database operations using abstraction layer"""
    
    def __init__(self):
        self.database = database
        self.logger = logging.getLogger(__name__)
    
    # Authentication methods
    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        try:
            import asyncio
            return asyncio.run(self.database.get_user_by_id(user_id))
        except Exception as e:
            self.logger.error(f"Error getting user by ID: {e}")
            return None
    
    def verify_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Verify JWT token"""
        try:
            import asyncio
            return asyncio.run(self.database.verify_token(token))
        except Exception as e:
            self.logger.error(f"Error verifying token: {e}")
            return None
    
    # Database operations
    def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user profile from database"""
        try:
            import asyncio
            return asyncio.run(self.database.get_user_by_id(user_id))
        except Exception as e:
            self.logger.error(f"Error getting user profile: {e}")
            return None
    
    def create_user_profile(self, user_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create user profile in database"""
        try:
            import asyncio
            return asyncio.run(self.database.create_user(user_data))
        except Exception as e:
            self.logger.error(f"Error creating user profile: {e}")
            return None
    
    def update_user_profile(self, user_id: str, updates: Dict[str, Any]) -> bool:
        """Update user profile"""
        try:
            import asyncio
            return asyncio.run(self.database.update_user(user_id, updates))
        except Exception as e:
            self.logger.error(f"Error updating user profile: {e}")
            return False
    
    def get_user_by_email(self, email: str) -> Optional[Dict[str, Any]]:
        """Get user by email from database"""
        try:
            import asyncio
            return asyncio.run(self.database.get_user_by_email(email))
        except Exception as e:
            self.logger.error(f"Error getting user by email: {e}")
            return None
    
    def get_user_projects(self, user_id: str) -> list:
        """Get user projects"""
        try:
            import asyncio
            return asyncio.run(self.database.get_user_projects(user_id))
        except Exception as e:
            self.logger.error(f"Error getting user projects: {e}")
            return []
    
    def create_project(self, project_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create new project"""
        try:
            import asyncio
            return asyncio.run(self.database.create_project(project_data))
        except Exception as e:
            self.logger.error(f"Error creating project: {e}")
            return None
    
    def update_project(self, project_id: str, updates: Dict[str, Any]) -> bool:
        """Update project"""
        try:
            import asyncio
            return asyncio.run(self.database.update_project(project_id, updates))
        except Exception as e:
            self.logger.error(f"Error updating project: {e}")
            return False
    
    def delete_project(self, project_id: str) -> bool:
        """Delete project"""
        try:
            import asyncio
            return asyncio.run(self.database.delete_project(project_id))
        except Exception as e:
            self.logger.error(f"Error deleting project: {e}")
            return False

# Create global instance
supabase_manager = DatabaseManager()

# Export for use in other modules
__all__ = ['supabase_manager', 'DatabaseManager', 'DatabaseFactory', 'DB_PROVIDERS']
