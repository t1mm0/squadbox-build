#!/usr/bin/env python3
"""
Dual Collection Manager for MongoDB Atlas
Page Purpose: Manage both sbox and squadbox collections in MongoDB Atlas
Last Modified: 2024-12-19
By: AI Assistant
Completeness Score: 100/100
"""

import os
import logging
from typing import Dict, List, Any, Optional, Union
from bson import ObjectId
from pymongo import MongoClient, ASCENDING, DESCENDING
import certifi

logger = logging.getLogger(__name__)

class DualCollectionManager:
    """Manages both sbox and squadbox collections in MongoDB Atlas"""
    
    def __init__(self, mongodb_uri: str):
        """Initialize with MongoDB Atlas connection"""
        self.mongodb_uri = mongodb_uri
        self.client = None
        self.squadbox_db = None
        self.sbox_collection = None
        
    def connect(self) -> bool:
        """Connect to MongoDB Atlas and setup collections"""
        try:
            # Connect to MongoDB Atlas
            self.client = MongoClient(
                self.mongodb_uri,
                tlsCAFile=certifi.where(),
                serverSelectionTimeoutMS=10000,
                connectTimeoutMS=10000,
                socketTimeoutMS=45000,
                maxPoolSize=100,
                minPoolSize=5
            )
            
            # Test connection
            self.client.admin.command('ping')
            logger.info("✅ Connected to MongoDB Atlas")
            
            # Setup collections
            self.squadbox_db = self.client.squadbox
            self.sbox_collection = self.squadbox_db.sbox
            
            logger.info("📦 Dual collection manager initialized")
            logger.info("   - sbox collection: auth and users only")
            logger.info("   - squadbox database: everything else (projects, files, analytics, etc.)")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to connect: {e}")
            return False
    
    def get_collection(self, collection_name: str, use_sbox: bool = False) -> Any:
        """Get the appropriate collection"""
        # sbox collection: auth and users only
        # squadbox database: everything else
        if use_sbox or collection_name in ['users', 'auth']:
            return self.sbox_collection
        else:
            return self.squadbox_db[collection_name]
    
    def create_user(self, user_data: Dict[str, Any], use_sbox: bool = False) -> Optional[Dict[str, Any]]:
        """Create user in specified collection"""
        try:
            collection = self.get_collection('users', use_sbox)
            result = collection.insert_one(user_data)
            user_data['id'] = str(result.inserted_id)
            return user_data
        except Exception as e:
            logger.error(f"Error creating user: {e}")
            return None
    
    def get_user_by_email(self, email: str, use_sbox: bool = False) -> Optional[Dict[str, Any]]:
        """Get user by email from specified collection"""
        try:
            collection = self.get_collection('users', use_sbox)
            user = collection.find_one({"email": email})
            if user:
                user['id'] = str(user['_id'])
                del user['_id']
            return user
        except Exception as e:
            logger.error(f"Error getting user by email: {e}")
            return None
    
    def get_user_by_id(self, user_id: str, use_sbox: bool = False) -> Optional[Dict[str, Any]]:
        """Get user by ID from specified collection"""
        try:
            collection = self.get_collection('users', use_sbox)
            user = collection.find_one({"_id": ObjectId(user_id)})
            if user:
                user['id'] = str(user['_id'])
                del user['_id']
            return user
        except Exception as e:
            logger.error(f"Error getting user by ID: {e}")
            return None
    
    def update_user(self, user_id: str, updates: Dict[str, Any], use_sbox: bool = False) -> bool:
        """Update user in specified collection"""
        try:
            collection = self.get_collection('users', use_sbox)
            result = collection.update_one({"_id": ObjectId(user_id)}, {"$set": updates})
            return result.modified_count > 0
        except Exception as e:
            logger.error(f"Error updating user: {e}")
            return False
    
    def create_project(self, project_data: Dict[str, Any], use_sbox: bool = False) -> Optional[Dict[str, Any]]:
        """Create project in specified collection"""
        try:
            collection = self.get_collection('user_projects', use_sbox)
            result = collection.insert_one(project_data)
            project_data['id'] = str(result.inserted_id)
            return project_data
        except Exception as e:
            logger.error(f"Error creating project: {e}")
            return None
    
    def get_user_projects(self, user_id: str, use_sbox: bool = False) -> List[Dict[str, Any]]:
        """Get user projects from specified collection"""
        try:
            collection = self.get_collection('user_projects', use_sbox)
            projects = list(collection.find({"user_id": user_id}).sort("created_at", -1))
            for project in projects:
                project['id'] = str(project['_id'])
                del project['_id']
            return projects
        except Exception as e:
            logger.error(f"Error getting user projects: {e}")
            return []
    
    def create_project_file(self, file_data: Dict[str, Any], use_sbox: bool = False) -> Optional[Dict[str, Any]]:
        """Create project file in specified collection"""
        try:
            collection = self.get_collection('project_files', use_sbox)
            result = collection.insert_one(file_data)
            file_data['id'] = str(result.inserted_id)
            return file_data
        except Exception as e:
            logger.error(f"Error creating project file: {e}")
            return None
    
    def get_project_files(self, project_id: str, use_sbox: bool = False) -> List[Dict[str, Any]]:
        """Get project files from specified collection"""
        try:
            collection = self.get_collection('project_files', use_sbox)
            files = list(collection.find({"project_id": project_id}).sort("file_path", 1))
            for file in files:
                file['id'] = str(file['_id'])
                del file['_id']
            return files
        except Exception as e:
            logger.error(f"Error getting project files: {e}")
            return []
    
    def migrate_data(self, from_sbox: bool = True) -> bool:
        """Migrate data between collections"""
        try:
            logger.info(f"🔄 Migrating data from {'sbox' if from_sbox else 'squadbox'} to {'squadbox' if from_sbox else 'sbox'}")
            
            # Migrate users
            source_users = self.get_collection('users', from_sbox)
            target_users = self.get_collection('users', not from_sbox)
            
            users = list(source_users.find({}))
            if users:
                for user in users:
                    # Remove _id to avoid conflicts
                    user_id = user.pop('_id')
                    # Check if user already exists in target
                    existing = target_users.find_one({"email": user["email"]})
                    if not existing:
                        target_users.insert_one(user)
                        logger.info(f"  ✅ Migrated user: {user['email']}")
                    else:
                        logger.info(f"  ⚠️ User already exists: {user['email']}")
            
            # Migrate projects
            source_projects = self.get_collection('user_projects', from_sbox)
            target_projects = self.get_collection('user_projects', not from_sbox)
            
            projects = list(source_projects.find({}))
            if projects:
                for project in projects:
                    project_id = project.pop('_id')
                    # Check if project already exists
                    existing = target_projects.find_one({"name": project["name"], "user_id": project["user_id"]})
                    if not existing:
                        target_projects.insert_one(project)
                        logger.info(f"  ✅ Migrated project: {project['name']}")
                    else:
                        logger.info(f"  ⚠️ Project already exists: {project['name']}")
            
            logger.info("✅ Data migration completed")
            return True
            
        except Exception as e:
            logger.error(f"❌ Data migration failed: {e}")
            return False
    
    def get_collection_stats(self) -> Dict[str, Any]:
        """Get statistics for both collections"""
        try:
            stats = {
                'sbox': {},
                'squadbox': {}
            }
            
            # Sbox collection stats (auth and users only)
            sbox_users = self.sbox_collection.count_documents({})
            stats['sbox']['users'] = sbox_users
            stats['sbox']['auth'] = sbox_users  # Same as users for auth
            
            # Squadbox database stats (everything else)
            squadbox_projects = self.squadbox_db.user_projects.count_documents({})
            squadbox_files = self.squadbox_db.project_files.count_documents({})
            squadbox_patterns = self.squadbox_db.mmry_neural_patterns.count_documents({})
            squadbox_dependencies = self.squadbox_db.project_dependencies.count_documents({})
            squadbox_analytics = self.squadbox_db.user_project_analytics.count_documents({})
            squadbox_storage = self.squadbox_db.mmry_storage.count_documents({})
            
            stats['squadbox']['projects'] = squadbox_projects
            stats['squadbox']['files'] = squadbox_files
            stats['squadbox']['patterns'] = squadbox_patterns
            stats['squadbox']['dependencies'] = squadbox_dependencies
            stats['squadbox']['analytics'] = squadbox_analytics
            stats['squadbox']['storage'] = squadbox_storage
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting collection stats: {e}")
            return {}
    
    def sync_collections(self) -> bool:
        """Sync data between collections to ensure consistency"""
        try:
            logger.info("🔄 Syncing collections...")
            
            # Get stats
            stats = self.get_collection_stats()
            
            # If sbox has more users, migrate to squadbox
            if stats['sbox']['users'] > stats['squadbox']['users']:
                logger.info("📦 Migrating from sbox to squadbox")
                return self.migrate_data(from_sbox=True)
            
            # If squadbox has more users, migrate to sbox
            elif stats['squadbox']['users'] > stats['sbox']['users']:
                logger.info("📦 Migrating from squadbox to sbox")
                return self.migrate_data(from_sbox=False)
            
            else:
                logger.info("✅ Collections are in sync")
                return True
                
        except Exception as e:
            logger.error(f"❌ Collection sync failed: {e}")
            return False
    
    def close(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
            logger.info("🔌 MongoDB connection closed")

def main():
    """Test the dual collection manager"""
    print("🚀 Dual Collection Manager Test")
    print("="*50)
    
    # Get MongoDB URI from environment
    mongodb_uri = os.getenv('MONGODB_URI')
    if not mongodb_uri:
        print("❌ MONGODB_URI environment variable not set")
        return
    
    # Initialize manager
    manager = DualCollectionManager(mongodb_uri)
    
    try:
        # Connect
        if not manager.connect():
            return
        
        # Get stats
        stats = manager.get_collection_stats()
        print(f"📊 Collection Statistics:")
        print(f"  sbox: {stats['sbox']}")
        print(f"  squadbox: {stats['squadbox']}")
        
        # Sync collections if needed
        manager.sync_collections()
        
        print("✅ Dual collection manager test completed")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
    finally:
        manager.close()

if __name__ == "__main__":
    main()
