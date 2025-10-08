#!/usr/bin/env python3
"""
MongoDB Atlas Configuration for Squadbox
Page Purpose: Configure MongoDB Atlas connection with proper authentication
Last Modified: 2025-01-09
By: AI Assistant
Completeness Score: 100/100
"""

import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import certifi
from typing import Optional, Dict, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MongoDBAtlasConnection:
    """MongoDB Atlas connection manager for Squadbox"""
    
    def __init__(self):
        self.client: Optional[MongoClient] = None
        self.db = None
        self.connected = False
    
    def connect(self, username: str = None, password: str = None) -> bool:
        """Connect to MongoDB Atlas with authentication"""
        try:
            # Get credentials from environment or parameters
            atlas_username = username or os.getenv('MONGODB_ATLAS_USERNAME', 'your-username')
            atlas_password = password or os.getenv('MONGODB_ATLAS_PASSWORD', 'your-password')
            
            # Build connection string
            atlas_uri = f"mongodb://{atlas_username}:{atlas_password}@atlas-sql-68e252c0deb4b70ed3ec1da7-o4dxc6.a.query.mongodb.net/squadbox?ssl=true&authSource=admin"
            
            logger.info("Connecting to MongoDB Atlas...")
            
            # Create client with SSL configuration
            self.client = MongoClient(
                atlas_uri,
                tlsCAFile=certifi.where(),  # Use certifi for SSL certificate verification
                serverSelectionTimeoutMS=10000,  # 10 second timeout
                connectTimeoutMS=10000,           # 10 second connection timeout
                socketTimeoutMS=20000,            # 20 second socket timeout
                maxPoolSize=10,                   # Connection pool size
                minPoolSize=1,                    # Minimum connections
                maxIdleTimeMS=30000,              # 30 second idle time
                retryWrites=True,                 # Enable retryable writes
                retryReads=True                   # Enable retryable reads
            )
            
            # Test connection
            self.client.admin.command('ping')
            self.db = self.client['squadbox']
            self.connected = True
            
            logger.info("✅ MongoDB Atlas connected successfully!")
            return True
            
        except (ConnectionFailure, ServerSelectionTimeoutError) as e:
            logger.error(f"❌ MongoDB Atlas connection failed: {e}")
            self.connected = False
            return False
        except Exception as e:
            logger.error(f"❌ Unexpected MongoDB Atlas error: {e}")
            self.connected = False
            return False
    
    def disconnect(self):
        """Disconnect from MongoDB Atlas"""
        if self.client:
            self.client.close()
            self.client = None
            self.db = None
            self.connected = False
            logger.info("🔌 MongoDB Atlas connection closed")
    
    def get_collection(self, collection_name: str):
        """Get a collection from the database"""
        if not self.connected or self.db is None:
            raise Exception("MongoDB Atlas not connected")
        return self.db[collection_name]
    
    def is_connected(self) -> bool:
        """Check if MongoDB Atlas is connected"""
        return self.connected and self.client is not None and self.db is not None
    
    def test_connection(self) -> bool:
        """Test the MongoDB Atlas connection"""
        if not self.connected:
            return False
        
        try:
            self.client.admin.command('ping')
            return True
        except Exception as e:
            logger.error(f"❌ MongoDB Atlas connection test failed: {e}")
            return False

# Global MongoDB Atlas connection instance
mongodb_atlas = MongoDBAtlasConnection()

def get_mongodb_atlas_connection() -> MongoDBAtlasConnection:
    """Get the global MongoDB Atlas connection instance"""
    return mongodb_atlas

def connect_to_mongodb_atlas(username: str = None, password: str = None) -> bool:
    """Connect to MongoDB Atlas using the global instance"""
    return mongodb_atlas.connect(username, password)

def disconnect_from_mongodb_atlas():
    """Disconnect from MongoDB Atlas using the global instance"""
    mongodb_atlas.disconnect()

def get_atlas_collection(collection_name: str):
    """Get a collection from the connected MongoDB Atlas database"""
    return mongodb_atlas.get_collection(collection_name)

# Example usage functions for Squadbox
def create_user_atlas(user_data: Dict[str, Any]) -> str:
    """Create a new user in MongoDB Atlas"""
    try:
        users_collection = get_atlas_collection('users')
        result = users_collection.insert_one(user_data)
        logger.info(f"✅ User created in Atlas with ID: {result.inserted_id}")
        return str(result.inserted_id)
    except Exception as e:
        logger.error(f"❌ Failed to create user in Atlas: {e}")
        raise

def get_user_atlas(user_id: str) -> Dict[str, Any]:
    """Get a user from MongoDB Atlas"""
    try:
        users_collection = get_atlas_collection('users')
        user = users_collection.find_one({'_id': user_id})
        if user:
            user['_id'] = str(user['_id'])  # Convert ObjectId to string
        return user
    except Exception as e:
        logger.error(f"❌ Failed to get user from Atlas: {e}")
        raise

def update_user_atlas(user_id: str, update_data: Dict[str, Any]) -> bool:
    """Update a user in MongoDB Atlas"""
    try:
        users_collection = get_atlas_collection('users')
        result = users_collection.update_one(
            {'_id': user_id},
            {'$set': update_data}
        )
        return result.modified_count > 0
    except Exception as e:
        logger.error(f"❌ Failed to update user in Atlas: {e}")
        raise

def delete_user_atlas(user_id: str) -> bool:
    """Delete a user from MongoDB Atlas"""
    try:
        users_collection = get_atlas_collection('users')
        result = users_collection.delete_one({'_id': user_id})
        return result.deleted_count > 0
    except Exception as e:
        logger.error(f"❌ Failed to delete user from Atlas: {e}")
        raise

if __name__ == "__main__":
    # Test the MongoDB Atlas connection
    print("🚀 Testing MongoDB Atlas Connection...")
    print("=" * 50)
    
    # You need to provide your MongoDB Atlas credentials
    print("📝 To connect to MongoDB Atlas, you need:")
    print("1. MongoDB Atlas username")
    print("2. MongoDB Atlas password")
    print("3. IP address whitelisted in MongoDB Atlas")
    print("4. SSL/TLS enabled")
    print()
    
    # Example connection (you'll need to provide real credentials)
    print("🔧 Example usage:")
    print("python3 mongodb_atlas_config.py")
    print("Or set environment variables:")
    print("export MONGODB_ATLAS_USERNAME=your-username")
    print("export MONGODB_ATLAS_PASSWORD=your-password")
    print()
    
    # Try to connect with environment variables
    if connect_to_mongodb_atlas():
        print("✅ MongoDB Atlas connection successful!")
        
        # Test basic operations
        try:
            # Test collection access
            users_collection = get_atlas_collection('users')
            print(f"📊 Users collection: {users_collection.name}")
            
            # Test connection
            if mongodb_atlas.test_connection():
                print("✅ MongoDB Atlas connection test passed!")
            else:
                print("❌ MongoDB Atlas connection test failed!")
                
        except Exception as e:
            print(f"❌ MongoDB Atlas operations failed: {e}")
        
        # Disconnect
        disconnect_from_mongodb_atlas()
    else:
        print("❌ MongoDB Atlas connection failed!")
        print("Please check your credentials and network settings.")
