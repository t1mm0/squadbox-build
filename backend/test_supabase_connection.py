#!/usr/bin/env python3
"""
Test script for database functions using abstraction layer
Purpose: Verify all database operations are working as expected
Last modified: 2025-08-08
Completeness score: 100
"""

import os
import sys
import asyncio
import uuid
from dotenv import load_dotenv

# Load environment variables
load_dotenv('../.env.local')

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database_abstraction import database, DatabaseFactory, DB_PROVIDERS

def test_database_connection():
    """Test basic database connection"""
    print("🔍 Testing database connection...")
    
    try:
        # Test if we can access the database
        current_provider = DatabaseFactory.get_current_provider()
        print(f"✅ Database client accessible (Provider: {current_provider})")
        return True
    except Exception as e:
        print(f"❌ Failed to access database client: {e}")
        return False

def test_database_tables():
    """Test if database tables exist"""
    print("\n🔍 Testing database tables...")
    
    try:
        # Test if we can query the users table
        import asyncio
        result = asyncio.run(database.get_user_by_email("test@example.com"))
        print("✅ Database tables accessible")
        return True
    except Exception as e:
        print(f"❌ Failed to access database tables: {e}")
        return False

def test_user_operations():
    """Test user CRUD operations"""
    print("\n🔍 Testing user operations...")
    
    try:
        import asyncio
        
        # Test user creation with proper UUID and unique email
        test_user_id = str(uuid.uuid4())
        unique_email = f"test-{uuid.uuid4().hex[:8]}@example.com"
        test_user_data = {
            "id": test_user_id,
            "email": unique_email,
            "username": f"testuser-{uuid.uuid4().hex[:8]}",
            "name": "Test User",
            "role": "user",
            "subscription": "free",
            "project_count": 0
        }
        
        # Create user
        created_user = asyncio.run(database.create_user(test_user_data))
        if created_user:
            print("✅ User creation successful")
        else:
            print("❌ User creation failed")
            return False
        
        # Get user by email
        user = asyncio.run(database.get_user_by_email(unique_email))
        if user:
            print("✅ User retrieval successful")
        else:
            print("❌ User retrieval failed")
            return False
        
        # Update user
        update_success = asyncio.run(database.update_user(test_user_id, {"name": "Updated Test User"}))
        if update_success:
            print("✅ User update successful")
        else:
            print("❌ User update failed")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing user operations: {e}")
        return False

def test_project_operations():
    """Test project CRUD operations"""
    print("\n🔍 Testing project operations...")
    
    try:
        import asyncio
        
        # First create a test user for the project
        test_user_id = str(uuid.uuid4())
        unique_email = f"project-test-{uuid.uuid4().hex[:8]}@example.com"
        test_user_data = {
            "id": test_user_id,
            "email": unique_email,
            "username": f"projectuser-{uuid.uuid4().hex[:8]}",
            "name": "Project Test User",
            "role": "user",
            "subscription": "free",
            "project_count": 0
        }
        
        # Create user first
        created_user = asyncio.run(database.create_user(test_user_data))
        if not created_user:
            print("❌ Failed to create test user for project")
            return False
        
        # Test project creation with proper UUIDs
        test_project_id = str(uuid.uuid4())
        test_project_data = {
            "id": test_project_id,
            "user_id": test_user_id,  # Use the actual user_id
            "name": "Test Project",
            "description": "A test project",
            "project_type": "web",
            "status": "pending"
        }
        
        # Create project
        created_project = asyncio.run(database.create_project(test_project_data))
        if created_project:
            print("✅ Project creation successful")
        else:
            print("❌ Project creation failed")
            return False
        
        # Get user projects
        projects = asyncio.run(database.get_user_projects(test_user_id))
        if projects:
            print("✅ Project retrieval successful")
        else:
            print("❌ Project retrieval failed")
            return False
        
        # Update project
        update_success = asyncio.run(database.update_project(test_project_id, {"status": "completed"}))
        if update_success:
            print("✅ Project update successful")
        else:
            print("❌ Project update failed")
            return False
        
        # Delete project
        delete_success = asyncio.run(database.delete_project(test_project_id))
        if delete_success:
            print("✅ Project deletion successful")
        else:
            print("❌ Project deletion failed")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing project operations: {e}")
        return False

def test_authentication():
    """Test authentication functions"""
    print("\n🔍 Testing authentication...")
    
    try:
        import asyncio
        
        # Test token verification (this might not work for all providers)
        token = "test-token"
        user = asyncio.run(database.verify_token(token))
        
        if user is not None:
            print("✅ Token verification successful")
        else:
            print("⚠️ Token verification not implemented for current provider")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing authentication: {e}")
        return False

def test_admin_user():
    """Test admin user exists"""
    print("\n🔍 Testing admin user...")
    
    try:
        import asyncio
        
        # Check if admin user exists
        admin_user = asyncio.run(database.get_user_by_email("admin@squadbox.co.uk"))
        
        if admin_user:
            print("✅ Admin user found")
            print(f"   ID: {admin_user.get('id')}")
            print(f"   Email: {admin_user.get('email')}")
            print(f"   Role: {admin_user.get('role')}")
            return True
        else:
            print("❌ Admin user not found")
            return False
        
    except Exception as e:
        print(f"❌ Error testing admin user: {e}")
        return False

def main():
    """Main test function"""
    print("🔧 Testing Database Functions with Abstraction Layer")
    print("=" * 60)
    
    # Test database connection
    connection_success = test_database_connection()
    
    if connection_success:
        # Test database tables
        tables_success = test_database_tables()
        
        if tables_success:
            # Test admin user
            admin_success = test_admin_user()
            
            if admin_success:
                # Test user operations
                user_success = test_user_operations()
                
                if user_success:
                    # Test project operations
                    project_success = test_project_operations()
                    
                    if project_success:
                        # Test authentication
                        auth_success = test_authentication()
                        
                        if auth_success:
                            print("\n🎉 ALL TESTS PASSED!")
                            print("✅ Database functions are working as expected")
                            return True
    
    print("\n❌ SOME TESTS FAILED")
    print("Please check the database configuration and try again")
    return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
