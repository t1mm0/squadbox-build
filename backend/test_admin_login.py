#!/usr/bin/env python3
"""
Test Admin Login Script
Purpose: Test admin user login with Supabase Auth
Last Modified: 2025-08-08
By: AI Assistant
Completeness Score: 100/100
"""

import os
import sys

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

from supabase_client import supabase_manager

def test_admin_login():
    """Test admin user login with Supabase Auth"""
    
    admin_email = "admin@squadbox.co.uk"
    admin_password = "wibmog-buxmuj-0xukzU"
    
    try:
        print(f"🔍 Testing admin login with Supabase Auth...")
        print(f"Email: {admin_email}")
        print("=" * 50)
        
        # Test login
        auth_response = supabase_manager.client.auth.sign_in_with_password({
            'email': admin_email,
            'password': admin_password
        })
        
        if auth_response.user:
            print("✅ Admin login successful!")
            print(f"🆔 User ID: {auth_response.user.id}")
            print(f"📧 Email: {auth_response.user.email}")
            print(f"✅ Session created: {auth_response.session is not None}")
            print(f"🔑 Access Token: {auth_response.session.access_token[:20]}...")
            print(f"🔄 Refresh Token: {auth_response.session.refresh_token[:20]}...")
            return True
        else:
            print("❌ Admin login failed")
            return False
            
    except Exception as e:
        print(f"❌ Error testing admin login: {e}")
        return False

def main():
    """Main function"""
    print("🔧 Testing Admin Login with Supabase Auth")
    print("=" * 50)
    
    success = test_admin_login()
    return success

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
