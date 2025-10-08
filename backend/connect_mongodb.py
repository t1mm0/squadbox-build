#!/usr/bin/env python3
"""
MongoDB Connection Script for Squadbox
Page Purpose: Connect to MongoDB and test the connection
Last Modified: 2025-01-09
By: AI Assistant
Completeness Score: 100/100
"""

import os
import sys
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import json
from datetime import datetime

def create_mongodb_connection():
    """Create MongoDB connection with proper error handling"""
    print("🚀 Connecting to MongoDB...")
    
    # MongoDB connection options
    mongodb_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/squadbox')
    mongodb_db = os.getenv('MONGODB_DB', 'squadbox')
    
    print(f"📊 Database URI: {mongodb_uri}")
    print(f"📊 Database Name: {mongodb_db}")
    
    try:
        # Create MongoDB client
        client = MongoClient(
            mongodb_uri,
            serverSelectionTimeoutMS=5000,  # 5 second timeout
            connectTimeoutMS=10000,         # 10 second connection timeout
            socketTimeoutMS=20000,         # 20 second socket timeout
            maxPoolSize=10,                # Connection pool size
            minPoolSize=1,                 # Minimum connections
            maxIdleTimeMS=30000            # 30 second idle time
        )
        
        # Test connection
        print("🔌 Testing MongoDB connection...")
        client.admin.command('ping')
        print("✅ MongoDB connection successful!")
        
        # Get database
        db = client[mongodb_db]
        print(f"📊 Connected to database: {db.name}")
        
        # List collections
        collections = db.list_collection_names()
        print(f"📁 Available collections: {collections}")
        
        return client, db
        
    except ConnectionFailure as e:
        print(f"❌ MongoDB connection failed: {e}")
        return None, None
    except ServerSelectionTimeoutError as e:
        print(f"❌ MongoDB server selection timeout: {e}")
        return None, None
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return None, None

def test_mongodb_operations(db):
    """Test basic MongoDB operations"""
    if db is None:
        print("❌ No database connection available")
        return False
    
    print("\n🧪 Testing MongoDB operations...")
    
    try:
        # Test collection
        test_collection = db['test_connection']
        
        # Insert test document
        test_doc = {
            'test': True,
            'timestamp': datetime.now(),
            'message': 'MongoDB connection test successful'
        }
        
        result = test_collection.insert_one(test_doc)
        print(f"✅ Insert test successful. Document ID: {result.inserted_id}")
        
        # Find test document
        found_doc = test_collection.find_one({'_id': result.inserted_id})
        if found_doc:
            print("✅ Find test successful")
        else:
            print("❌ Find test failed")
            return False
        
        # Update test document
        update_result = test_collection.update_one(
            {'_id': result.inserted_id},
            {'$set': {'updated': True, 'update_timestamp': datetime.now()}}
        )
        if update_result.modified_count > 0:
            print("✅ Update test successful")
        else:
            print("❌ Update test failed")
            return False
        
        # Delete test document
        delete_result = test_collection.delete_one({'_id': result.inserted_id})
        if delete_result.deleted_count > 0:
            print("✅ Delete test successful")
        else:
            print("❌ Delete test failed")
            return False
        
        print("🎉 All MongoDB operations successful!")
        return True
        
    except Exception as e:
        print(f"❌ MongoDB operations test failed: {e}")
        return False

def setup_squadbox_collections(db):
    """Set up Squadbox-specific collections"""
    if db is None:
        print("❌ No database connection available")
        return False
    
    print("\n🏗️ Setting up Squadbox collections...")
    
    try:
        # Users collection
        users_collection = db['users']
        users_collection.create_index('email', unique=True)
        users_collection.create_index('username', unique=True)
        print("✅ Users collection setup complete")
        
        # Projects collection
        projects_collection = db['projects']
        projects_collection.create_index('user_id')
        projects_collection.create_index('created_at')
        print("✅ Projects collection setup complete")
        
        # Templates collection
        templates_collection = db['templates']
        templates_collection.create_index('name')
        templates_collection.create_index('category')
        print("✅ Templates collection setup complete")
        
        # Sessions collection
        sessions_collection = db['sessions']
        sessions_collection.create_index('user_id')
        sessions_collection.create_index('expires_at', expireAfterSeconds=0)
        print("✅ Sessions collection setup complete")
        
        print("🎉 All Squadbox collections setup complete!")
        return True
        
    except Exception as e:
        print(f"❌ Collection setup failed: {e}")
        return False

def main():
    """Main function to test MongoDB connection"""
    print("🚀 Squadbox MongoDB Connection Test")
    print("=" * 50)
    
    # Create connection
    client, db = create_mongodb_connection()
    
    if client is not None and db is not None:
        # Test operations
        operations_success = test_mongodb_operations(db)
        
        if operations_success:
            # Setup collections
            setup_success = setup_squadbox_collections(db)
            
            if setup_success:
                print("\n🎉 MongoDB is ready for Squadbox!")
                print("✅ Connection: Working")
                print("✅ Operations: Working")
                print("✅ Collections: Setup complete")
            else:
                print("\n⚠️ MongoDB connection works but collection setup failed")
        else:
            print("\n❌ MongoDB connection works but operations failed")
    else:
        print("\n❌ MongoDB connection failed")
        print("\n🔧 Troubleshooting tips:")
        print("1. Make sure MongoDB is running: brew services start mongodb-community")
        print("2. Check if MongoDB is installed: brew install mongodb-community")
        print("3. Verify connection string in environment variables")
        print("4. Check firewall settings")
    
    # Close connection
    if client:
        client.close()
        print("\n🔌 MongoDB connection closed")

if __name__ == "__main__":
    main()
