#!/usr/bin/env python3
"""
MongoDB Atlas Setup Script for Squadbox
Page Purpose: Interactive setup for MongoDB Atlas connection
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

def setup_mongodb_atlas():
    """Interactive setup for MongoDB Atlas connection"""
    print("🚀 MongoDB Atlas Setup for Squadbox")
    print("=" * 50)
    
    print("📝 To connect to MongoDB Atlas, you need:")
    print("1. MongoDB Atlas username")
    print("2. MongoDB Atlas password")
    print("3. IP address whitelisted in MongoDB Atlas")
    print("4. SSL/TLS enabled")
    print()
    
    # Get credentials from user
    username = input("Enter your MongoDB Atlas username: ").strip()
    password = input("Enter your MongoDB Atlas password: ").strip()
    
    if not username or not password:
        print("❌ Username and password are required!")
        return False
    
    # Build connection string
    atlas_uri = f"mongodb://{username}:{password}@atlas-sql-68e252c0deb4b70ed3ec1da7-o4dxc6.a.query.mongodb.net/squadbox?ssl=true&authSource=admin"
    
    print(f"\n🔌 Testing connection to MongoDB Atlas...")
    
    try:
        # Create client with SSL configuration
        client = MongoClient(
            atlas_uri,
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
            'message': 'MongoDB Atlas setup test successful',
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
        
        # Clean up test document
        test_collection.delete_one({'_id': result.inserted_id})
        print("✅ Test document cleaned up")
        
        print("\n🎉 MongoDB Atlas setup successful!")
        print("✅ Connection: Working")
        print("✅ Operations: Working")
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

def create_env_file(username: str, password: str):
    """Create environment file with MongoDB Atlas credentials"""
    env_content = f"""# Squadbox MongoDB Atlas Environment Configuration
# Page Purpose: MongoDB Atlas connection settings for Squadbox backend
# Last Modified: 2025-01-09
# By: AI Assistant
# Completeness Score: 100/100

# MongoDB Atlas Configuration
MONGODB_URI=mongodb://{username}:{password}@atlas-sql-68e252c0deb4b70ed3ec1da7-o4dxc6.a.query.mongodb.net/squadbox?ssl=true&authSource=admin
MONGODB_DB=squadbox
MONGODB_COLLECTION=users

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-64-chars-long-for-squadbox-production
JWT_128_KEY=your-super-secret-jwt-128-key-here-128-chars-long-for-enhanced-security-in-squadbox-production-environment
JWT_EXPIRE_DAYS=7

# MongoDB Connection Pool Settings
MONGODB_MAX_POOL_SIZE=10
MONGODB_MIN_POOL_SIZE=1
MONGODB_MAX_IDLE_TIME_MS=30000
MONGODB_CONNECT_TIMEOUT_MS=10000
MONGODB_SOCKET_TIMEOUT_MS=20000

# MongoDB SSL Settings
MONGODB_SSL=true
MONGODB_SSL_VERIFY_CERT=true

# Production Settings
ENVIRONMENT=production
DEBUG=false
"""
    
    try:
        with open('.env', 'w') as f:
            f.write(env_content)
        print("✅ Environment file created: .env")
        return True
    except Exception as e:
        print(f"❌ Failed to create environment file: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 Squadbox MongoDB Atlas Setup")
    print("=" * 50)
    
    # Run setup
    if setup_mongodb_atlas():
        print("\n🎉 MongoDB Atlas setup completed successfully!")
        print("Your Squadbox backend is now ready to use MongoDB Atlas!")
        
        # Ask if user wants to create environment file
        create_env = input("\nWould you like to create a .env file with your credentials? (y/n): ").strip().lower()
        if create_env == 'y':
            username = input("Enter your MongoDB Atlas username: ").strip()
            password = input("Enter your MongoDB Atlas password: ").strip()
            if username and password:
                create_env_file(username, password)
            else:
                print("❌ Username and password are required for .env file")
    else:
        print("\n❌ MongoDB Atlas setup failed!")
        print("Please check your credentials and try again.")
        sys.exit(1)

if __name__ == "__main__":
    main()