#!/usr/bin/env python3
"""
MongoDB Atlas Environment Test Script
Page Purpose: Test MongoDB Atlas connection using environment variables
Last Modified: 2025-01-09
By: AI Assistant
Completeness Score: 100/100
"""

import os
import sys
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
import certifi
from datetime import datetime

def load_env_file():
    """Load environment variables from .env file"""
    try:
        # Try to load from .env file
        if os.path.exists('.env'):
            with open('.env', 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        os.environ[key] = value
            print("✅ Loaded environment variables from .env file")
            return True
        else:
            print("⚠️ .env file not found, using system environment variables")
            return False
    except Exception as e:
        print(f"⚠️ Could not load .env file: {e}")
        return False

def test_mongodb_atlas_connection():
    """Test MongoDB Atlas connection using environment variables"""
    print("🚀 Testing MongoDB Atlas Connection with Environment Variables")
    print("=" * 70)
    
    # Load environment variables
    load_env_file()
    
    # Get MongoDB URI from environment
    mongodb_uri = os.getenv('MONGODB_URI') or os.getenv('MONGODB_ATLAS_URI')
    if not mongodb_uri:
        print("❌ MONGODB_URI or MONGODB_ATLAS_URI not found in environment variables")
        print("Please set MONGODB_URI in your .env file or environment")
        return False
    
    print(f"📊 MongoDB URI: {mongodb_uri}")
    
    try:
        # Create MongoDB client with SSL configuration
        client = MongoClient(
            mongodb_uri,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=10000,
            socketTimeoutMS=20000,
            maxPoolSize=10,
            minPoolSize=1,
            maxIdleTimeMS=30000,
            retryWrites=True,
            retryReads=True
        )
        
        # Test connection
        print("🔌 Testing MongoDB Atlas connection...")
        client.admin.command('ping')
        print("✅ MongoDB Atlas connection successful!")
        
        # Get database
        db = client['squadbox']
        print(f"📊 Connected to database: {db.name}")
        
        # List collections
        collections = db.list_collection_names()
        print(f"📁 Available collections: {collections}")
        
        # Test basic operations
        print("\n🧪 Testing basic operations...")
        test_collection = db['test_connection']
        
        # Insert test document
        test_doc = {
            'test': True,
            'timestamp': datetime.now(),
            'message': 'MongoDB Atlas environment test successful',
            'source': 'squadbox-backend'
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
        
        # Clean up test document
        delete_result = test_collection.delete_one({'_id': result.inserted_id})
        if delete_result.deleted_count > 0:
            print("✅ Delete test successful")
        else:
            print("❌ Delete test failed")
            return False
        
        print("\n🎉 All MongoDB Atlas operations successful!")
        print("✅ Connection: Working")
        print("✅ Operations: Working")
        print("✅ Environment: Configured")
        print("✅ Ready for Squadbox!")
        
        # Close connection
        client.close()
        print("\n🔌 MongoDB Atlas connection closed")
        
        return True
        
    except ConnectionFailure as e:
        print(f"❌ MongoDB Atlas connection failed: {e}")
        return False
    except ServerSelectionTimeoutError as e:
        print(f"❌ MongoDB Atlas server selection timeout: {e}")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def main():
    """Main test function"""
    if test_mongodb_atlas_connection():
        print("\n🎉 MongoDB Atlas is ready for Squadbox!")
        sys.exit(0)
    else:
        print("\n❌ MongoDB Atlas connection failed!")
        print("\n🔧 Troubleshooting tips:")
        print("1. Check your .env file has MONGODB_URI with correct credentials")
        print("2. Verify your IP address is whitelisted in MongoDB Atlas")
        print("3. Check your MongoDB Atlas username and password")
        print("4. Verify SSL/TLS settings")
        print("5. Check network connectivity")
        sys.exit(1)

if __name__ == "__main__":
    main()
