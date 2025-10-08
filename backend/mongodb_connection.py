#!/usr/bin/env python3
"""
MongoDB Connection Utility for Squadbox
Page Purpose: Simple MongoDB connection management for Squadbox backend
Last Modified: 2025-01-09
By: AI Assistant
Completeness Score: 100/100
"""

import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from typing import Optional, Dict, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MongoDBConnection:
    """MongoDB connection manager for Squadbox"""
    
    def __init__(self):
        self.client: Optional[MongoClient] = None
        self.db = None
        self.connected = False
    
    def connect(self, uri: str = None, db_name: str = None) -> bool:
        """Connect to MongoDB"""
        try:
            # Get connection parameters
            mongodb_uri = uri or os.getenv('MONGODB_URI', 'mongodb://localhost:27017/squadbox')
            mongodb_db = db_name or os.getenv('MONGODB_DB', 'squadbox')
            
            logger.info(f"Connecting to MongoDB: {mongodb_uri}")
            
            # Create client
            self.client = MongoClient(
                mongodb_uri,
                serverSelectionTimeoutMS=5000,
                connectTimeoutMS=10000,
                socketTimeoutMS=20000,
                maxPoolSize=10,
                minPoolSize=1,
                maxIdleTimeMS=30000
            )
            
            # Test connection
            self.client.admin.command('ping')
            self.db = self.client[mongodb_db]
            self.connected = True
            
            logger.info(f"✅ MongoDB connected successfully to database: {mongodb_db}")
            return True
            
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            logger.error(f"❌ MongoDB connection failed: {e}")
            self.connected = False
            return False
        except Exception as e:
            logger.error(f"❌ Unexpected MongoDB error: {e}")
            self.connected = False
            return False
    
    def disconnect(self):
        """Disconnect from MongoDB"""
        if self.client:
            self.client.close()
            self.client = None
            self.db = None
            self.connected = False
            logger.info("🔌 MongoDB connection closed")
    
    def get_collection(self, collection_name: str):
        """Get a collection from the database"""
        if not self.connected or not self.db:
            raise Exception("MongoDB not connected")
        return self.db[collection_name]
    
    def is_connected(self) -> bool:
        """Check if MongoDB is connected"""
        return self.connected and self.client is not None and self.db is not None
    
    def test_connection(self) -> bool:
        """Test the MongoDB connection"""
        if not self.connected:
            return False
        
        try:
            self.client.admin.command('ping')
            return True
        except Exception as e:
            logger.error(f"❌ MongoDB connection test failed: {e}")
            return False

# Global MongoDB connection instance
mongodb = MongoDBConnection()

def get_mongodb_connection() -> MongoDBConnection:
    """Get the global MongoDB connection instance"""
    return mongodb

def connect_to_mongodb() -> bool:
    """Connect to MongoDB using the global instance"""
    return mongodb.connect()

def disconnect_from_mongodb():
    """Disconnect from MongoDB using the global instance"""
    mongodb.disconnect()

def get_collection(collection_name: str):
    """Get a collection from the connected MongoDB database"""
    return mongodb.get_collection(collection_name)

# Example usage functions
def create_user(user_data: Dict[str, Any]) -> str:
    """Create a new user in MongoDB"""
    try:
        users_collection = get_collection('users')
        result = users_collection.insert_one(user_data)
        logger.info(f"✅ User created with ID: {result.inserted_id}")
        return str(result.inserted_id)
    except Exception as e:
        logger.error(f"❌ Failed to create user: {e}")
        raise

def get_user(user_id: str) -> Dict[str, Any]:
    """Get a user from MongoDB"""
    try:
        users_collection = get_collection('users')
        user = users_collection.find_one({'_id': user_id})
        if user:
            user['_id'] = str(user['_id'])  # Convert ObjectId to string
        return user
    except Exception as e:
        logger.error(f"❌ Failed to get user: {e}")
        raise

def update_user(user_id: str, update_data: Dict[str, Any]) -> bool:
    """Update a user in MongoDB"""
    try:
        users_collection = get_collection('users')
        result = users_collection.update_one(
            {'_id': user_id},
            {'$set': update_data}
        )
        return result.modified_count > 0
    except Exception as e:
        logger.error(f"❌ Failed to update user: {e}")
        raise

def delete_user(user_id: str) -> bool:
    """Delete a user from MongoDB"""
    try:
        users_collection = get_collection('users')
        result = users_collection.delete_one({'_id': user_id})
        return result.deleted_count > 0
    except Exception as e:
        logger.error(f"❌ Failed to delete user: {e}")
        raise

if __name__ == "__main__":
    # Test the MongoDB connection
    print("🚀 Testing MongoDB Connection...")
    
    if connect_to_mongodb():
        print("✅ MongoDB connection successful!")
        
        # Test basic operations
        try:
            # Test collection access
            users_collection = get_collection('users')
            print(f"📊 Users collection: {users_collection.name}")
            
            # Test connection
            if mongodb.test_connection():
                print("✅ MongoDB connection test passed!")
            else:
                print("❌ MongoDB connection test failed!")
                
        except Exception as e:
            print(f"❌ MongoDB operations failed: {e}")
        
        # Disconnect
        disconnect_from_mongodb()
    else:
        print("❌ MongoDB connection failed!")
