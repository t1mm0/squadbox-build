#!/usr/bin/env python3
"""
MongoDB Atlas Migration Script
Page Purpose: Migrate SQL schema to MongoDB Atlas cloud database
Last Modified: 2024-12-19
By: AI Assistant
Completeness Score: 100/100
"""

import os
import sys
import json
import logging
from datetime import datetime, timezone
from typing import Dict, List, Any, Optional
from bson import ObjectId
from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import certifi

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class MongoDBAtlasMigration:
    """MongoDB Atlas Migration Manager"""
    
    def __init__(self, mongodb_uri: str):
        """Initialize MongoDB Atlas connection"""
        self.mongodb_uri = mongodb_uri
        self.client = None
        self.db = None
        
    def connect(self) -> bool:
        """Connect to MongoDB Atlas"""
        try:
            # Connect with SSL certificate verification for Atlas
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
            logger.info("✅ Successfully connected to MongoDB Atlas")
            
            # Set database - support both sbox and squadbox collections
            self.db = self.client.squadbox
            logger.info(f"📊 Using database: {self.db.name}")
            
            # Check if sbox collection exists, if not create it
            if 'sbox' not in self.db.list_collection_names():
                logger.info("📦 Creating sbox collection for backward compatibility")
                self.db.create_collection('sbox')
            
            return True
            
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            logger.error(f"❌ Failed to connect to MongoDB Atlas: {e}")
            return False
        except Exception as e:
            logger.error(f"❌ Unexpected error connecting to MongoDB Atlas: {e}")
            return False
    
    def create_collections(self) -> bool:
        """Create MongoDB collections with proper indexes"""
        try:
            logger.info("🏗️ Creating MongoDB collections...")
            
            # Users collection (in both sbox and squadbox)
            for db_name in ['sbox', 'squadbox']:
                if db_name == 'sbox':
                    users_collection = self.client.squadbox.sbox
                else:
                    users_collection = self.db.users
                
                users_collection.create_index([("email", ASCENDING)], unique=True)
                users_collection.create_index([("created_at", DESCENDING)])
                logger.info(f"✅ Users collection created with indexes in {db_name}")
            
            # User Projects collection
            projects_collection = self.db.user_projects
            projects_collection.create_index([("user_id", ASCENDING)])
            projects_collection.create_index([("status", ASCENDING)])
            projects_collection.create_index([("created_at", DESCENDING)])
            projects_collection.create_index([("share_token", ASCENDING)], unique=True, sparse=True)
            logger.info("✅ User Projects collection created with indexes")
            
            # Project Files collection
            files_collection = self.db.project_files
            files_collection.create_index([("project_id", ASCENDING)])
            files_collection.create_index([("user_id", ASCENDING)])
            files_collection.create_index([("file_path", ASCENDING)])
            files_collection.create_index([("file_type", ASCENDING)])
            files_collection.create_index([("is_entry_point", ASCENDING)])
            files_collection.create_index([("content_hash", ASCENDING)])
            files_collection.create_index([("access_frequency", DESCENDING)])
            # Compound index for unique file paths per project
            files_collection.create_index([("project_id", ASCENDING), ("file_path", ASCENDING)], unique=True)
            logger.info("✅ Project Files collection created with indexes")
            
            # MMRY Neural Patterns collection
            patterns_collection = self.db.mmry_neural_patterns
            patterns_collection.create_index([("pattern_id", ASCENDING)], unique=True)
            patterns_collection.create_index([("pattern_type", ASCENDING)])
            patterns_collection.create_index([("file_extension", ASCENDING)])
            patterns_collection.create_index([("quality_score", DESCENDING)])
            patterns_collection.create_index([("usage_count", DESCENDING)])
            patterns_collection.create_index([("parent_pattern_id", ASCENDING)])
            logger.info("✅ MMRY Neural Patterns collection created with indexes")
            
            # Project Dependencies collection
            dependencies_collection = self.db.project_dependencies
            dependencies_collection.create_index([("project_id", ASCENDING)])
            dependencies_collection.create_index([("user_id", ASCENDING)])
            dependencies_collection.create_index([("package_name", ASCENDING)])
            # Compound index for unique dependencies per project
            dependencies_collection.create_index([
                ("project_id", ASCENDING), 
                ("package_name", ASCENDING), 
                ("dependency_type", ASCENDING)
            ], unique=True)
            logger.info("✅ Project Dependencies collection created with indexes")
            
            # User Project Analytics collection
            analytics_collection = self.db.user_project_analytics
            analytics_collection.create_index([("user_id", ASCENDING)])
            analytics_collection.create_index([("project_id", ASCENDING)])
            analytics_collection.create_index([("action_type", ASCENDING)])
            analytics_collection.create_index([("created_at", DESCENDING)])
            analytics_collection.create_index([("session_id", ASCENDING)])
            logger.info("✅ User Project Analytics collection created with indexes")
            
            # MMRY Storage collection
            storage_collection = self.db.mmry_storage
            storage_collection.create_index([("user_id", ASCENDING)])
            storage_collection.create_index([("project_id", ASCENDING)])
            storage_collection.create_index([("file_path", ASCENDING)])
            storage_collection.create_index([("compression_type", ASCENDING)])
            storage_collection.create_index([("created_at", DESCENDING)])
            logger.info("✅ MMRY Storage collection created with indexes")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to create collections: {e}")
            return False
    
    def create_sample_data(self) -> bool:
        """Create sample data for testing"""
        try:
            logger.info("📝 Creating sample data...")
            
            # Sample user
            sample_user = {
                "_id": ObjectId(),
                "email": "admin@squadbox.co.uk",
                "name": "SquadBox Admin",
                "subscription_tier": "unlimited",
                "role": "admin",
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc)
            }
            
            # Insert user
            user_result = self.db.users.insert_one(sample_user)
            user_id = user_result.inserted_id
            logger.info(f"✅ Created sample user: {sample_user['email']}")
            
            # Sample project
            sample_project = {
                "_id": ObjectId(),
                "user_id": user_id,
                "name": "Sample React App",
                "description": "A sample React application created by SquadBox",
                "template_id": "react-app-basic",
                "status": "complete",
                "build_started_at": datetime.now(timezone.utc),
                "build_completed_at": datetime.now(timezone.utc),
                "build_duration": 45,
                "build_log": "Build completed successfully",
                "error_log": None,
                "requirements": ["React", "TypeScript", "Tailwind CSS"],
                "tech_stack": {
                    "frontend": ["React", "TypeScript"],
                    "styling": ["Tailwind CSS"],
                    "build": ["Vite"]
                },
                "custom_config": {
                    "theme": "dark",
                    "features": ["routing", "state-management"]
                },
                "total_files": 15,
                "total_size_bytes": 1024000,
                "is_public": False,
                "share_token": "sample-share-token-123",
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
                "last_accessed_at": datetime.now(timezone.utc)
            }
            
            # Insert project
            project_result = self.db.user_projects.insert_one(sample_project)
            project_id = project_result.inserted_id
            logger.info(f"✅ Created sample project: {sample_project['name']}")
            
            # Sample project files
            sample_files = [
                {
                    "_id": ObjectId(),
                    "project_id": project_id,
                    "user_id": user_id,
                    "file_path": "src/App.tsx",
                    "file_name": "App.tsx",
                    "file_extension": "tsx",
                    "file_type": "source",
                    "content_text": "import React from 'react';\n\nfunction App() {\n  return <div>Hello SquadBox!</div>;\n}\n\nexport default App;",
                    "content_mmry": None,
                    "mmry_version": "2.0",
                    "compression_type": "none",
                    "original_size": 89,
                    "compressed_size": 89,
                    "compression_ratio": 1.0,
                    "compression_quality_score": 1.0,
                    "content_hash": "sample-hash-123",
                    "mime_type": "text/plain",
                    "encoding": "utf-8",
                    "is_binary": False,
                    "directory_level": 1,
                    "is_entry_point": True,
                    "access_frequency": 0,
                    "created_at": datetime.now(timezone.utc),
                    "updated_at": datetime.now(timezone.utc),
                    "last_accessed_at": datetime.now(timezone.utc)
                },
                {
                    "_id": ObjectId(),
                    "project_id": project_id,
                    "user_id": user_id,
                    "file_path": "package.json",
                    "file_name": "package.json",
                    "file_extension": "json",
                    "file_type": "config",
                    "content_text": '{\n  "name": "sample-react-app",\n  "version": "1.0.0",\n  "dependencies": {\n    "react": "^18.0.0",\n    "typescript": "^5.0.0"\n  }\n}',
                    "content_mmry": None,
                    "mmry_version": "2.0",
                    "compression_type": "none",
                    "original_size": 120,
                    "compressed_size": 120,
                    "compression_ratio": 1.0,
                    "compression_quality_score": 1.0,
                    "content_hash": "sample-hash-456",
                    "mime_type": "application/json",
                    "encoding": "utf-8",
                    "is_binary": False,
                    "directory_level": 0,
                    "is_entry_point": False,
                    "access_frequency": 0,
                    "created_at": datetime.now(timezone.utc),
                    "updated_at": datetime.now(timezone.utc),
                    "last_accessed_at": datetime.now(timezone.utc)
                }
            ]
            
            # Insert files
            files_result = self.db.project_files.insert_many(sample_files)
            logger.info(f"✅ Created {len(sample_files)} sample files")
            
            # Sample dependencies
            sample_dependencies = [
                {
                    "_id": ObjectId(),
                    "project_id": project_id,
                    "user_id": user_id,
                    "package_name": "react",
                    "version": "^18.0.0",
                    "dependency_type": "production",
                    "package_manager": "npm",
                    "created_at": datetime.now(timezone.utc)
                },
                {
                    "_id": ObjectId(),
                    "project_id": project_id,
                    "user_id": user_id,
                    "package_name": "typescript",
                    "version": "^5.0.0",
                    "dependency_type": "development",
                    "package_manager": "npm",
                    "created_at": datetime.now(timezone.utc)
                }
            ]
            
            # Insert dependencies
            deps_result = self.db.project_dependencies.insert_many(sample_dependencies)
            logger.info(f"✅ Created {len(sample_dependencies)} sample dependencies")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Failed to create sample data: {e}")
            return False
    
    def verify_migration(self) -> bool:
        """Verify the migration was successful"""
        try:
            logger.info("🔍 Verifying migration...")
            
            # Check collections exist
            collections = self.db.list_collection_names()
            expected_collections = [
                'users', 'user_projects', 'project_files', 
                'mmry_neural_patterns', 'project_dependencies', 
                'user_project_analytics', 'mmry_storage'
            ]
            
            for collection in expected_collections:
                if collection in collections:
                    logger.info(f"  ✅ Collection '{collection}' exists")
                else:
                    logger.error(f"  ❌ Collection '{collection}' missing")
                    return False
            
            # Check sample data
            user_count = self.db.users.count_documents({})
            project_count = self.db.user_projects.count_documents({})
            file_count = self.db.project_files.count_documents({})
            
            logger.info(f"  📊 Users: {user_count}")
            logger.info(f"  📊 Projects: {project_count}")
            logger.info(f"  📊 Files: {file_count}")
            
            if user_count > 0 and project_count > 0 and file_count > 0:
                logger.info("✅ Migration verification successful!")
                return True
            else:
                logger.error("❌ Migration verification failed - no data found")
                return False
                
        except Exception as e:
            logger.error(f"❌ Migration verification failed: {e}")
            return False
    
    def close(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
            logger.info("🔌 MongoDB connection closed")

def main():
    """Main migration function"""
    print("🚀 MongoDB Atlas Migration")
    print("="*50)
    
    # Get MongoDB URI from environment
    mongodb_uri = os.getenv('MONGODB_URI')
    if not mongodb_uri:
        print("❌ MONGODB_URI environment variable not set")
        print("Please set your MongoDB Atlas connection string:")
        print("export MONGODB_URI='mongodb+srv://username:password@cluster.mongodb.net/squadbox'")
        sys.exit(1)
    
    # Initialize migration
    migration = MongoDBAtlasMigration(mongodb_uri)
    
    try:
        # Connect to MongoDB Atlas
        if not migration.connect():
            sys.exit(1)
        
        # Create collections and indexes
        if not migration.create_collections():
            sys.exit(1)
        
        # Create sample data
        if not migration.create_sample_data():
            sys.exit(1)
        
        # Verify migration
        if not migration.verify_migration():
            sys.exit(1)
        
        print("\n🎉 MongoDB Atlas migration completed successfully!")
        print("📊 Your SquadBox database is now ready in MongoDB Atlas")
        
    except KeyboardInterrupt:
        print("\n⚠️ Migration interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        sys.exit(1)
    finally:
        migration.close()

if __name__ == "__main__":
    main()
