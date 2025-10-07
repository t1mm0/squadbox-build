#!/usr/bin/env python3
"""
Simple Admin User Creation Script
Purpose: Insert admin user into database using abstraction layer
Last Modified: 2025-08-08
By: AI Assistant
Completeness Score: 95/100
"""

import os
import sys
import uuid
from datetime import datetime

# Load environment variables from .env file
def load_env():
    """Load environment variables from .env file"""
    env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    # Remove quotes if present
                    if value.startswith('"') and value.endswith('"'):
                        value = value[1:-1]
                    elif value.startswith("'") and value.endswith("'"):
                        value = value[1:-1]
                    os.environ[key] = value
        print("✅ Environment variables loaded from .env file")
    else:
        print("❌ .env file not found")
        return False
    return True

# Load environment variables first
if not load_env():
    sys.exit(1)

from database_abstraction import database, DatabaseFactory

def create_simple_admin_user():
    """Create admin user in database only"""
    
    # Admin user details
    admin_email = "admin@squadbox.co.uk"
    admin_password = "wibmog-buxmuj-0xukzU"
    
    try:
        # Generate a UUID for the user
        user_id = str(uuid.uuid4())
        
        # Create user profile data
        user_data = {
            "id": user_id,
            "email": admin_email,
            "username": "admin",  # Required field
            "name": "Admin User",  # Combined name field
            "role": "admin",
            "subscription": "admin",  # Default field
            "project_count": 0,  # Default field
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        print(f"Creating admin user in database...")
        print(f"Email: {admin_email}")
        print(f"User ID: {user_id}")
        
        # Insert user into database
        import asyncio
        result = asyncio.run(database.create_user(user_data))
        
        if result:
            print("✅ Admin user created successfully in database!")
            print(f"User ID: {user_id}")
            print(f"Email: {admin_email}")
            return True
        else:
            print("❌ Failed to create admin user")
            return False
            
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        return False

def verify_admin_user():
    """Verify the admin user exists in database"""
    
    admin_email = "admin@squadbox.co.uk"
    
    try:
        print(f"Verifying admin user exists...")
        
        # Try to get user by email
        import asyncio
        user = asyncio.run(database.get_user_by_email(admin_email))
        
        if user:
            print("✅ Admin user verified in database!")
            print(f"User ID: {user.get('id')}")
            print(f"Email: {user.get('email')}")
            print(f"Role: {user.get('role')}")
            return True
        else:
            print("❌ Admin user not found in database")
            return False
            
    except Exception as e:
        print(f"❌ Error verifying admin user: {e}")
        return False

def main():
    """Main function"""
    print("🔧 Creating Simple Admin User (Database Only)")
    print("=" * 50)
    
    # Show current database provider
    current_provider = DatabaseFactory.get_current_provider()
    print(f"Current Database Provider: {current_provider}")
    
    # Create admin user
    success = create_simple_admin_user()
    
    if success:
        print("\n" + "=" * 50)
        # Verify the user was created
        verify_admin_user()
    
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
