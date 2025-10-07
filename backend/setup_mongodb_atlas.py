#!/usr/bin/env python3
"""
MongoDB Atlas Setup Script
Page Purpose: Setup and configure MongoDB Atlas environment
Last Modified: 2024-12-19
By: AI Assistant
Completeness Score: 100/100
"""

import os
import sys
import secrets
import string
from pathlib import Path

def generate_jwt_secret(length: int = 64) -> str:
    """Generate a secure JWT secret"""
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(secrets.choice(alphabet) for _ in range(length))

def generate_jwt_128_key() -> str:
    """Generate a 128-character JWT key"""
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(secrets.choice(alphabet) for _ in range(128))

def create_env_file() -> bool:
    """Create .env file with MongoDB Atlas configuration"""
    try:
        env_content = """# MongoDB Atlas Configuration
# Database Configuration
DB_PROVIDER=mongodb

# MongoDB Atlas Connection String
# Replace with your actual MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/squadbox

# JWT Configuration
JWT_SECRET={jwt_secret}
JWT_128_KEY={jwt_128_key}
JWT_EXPIRE_DAYS=7

# Optional MongoDB Settings
MONGODB_MAX_POOL_SIZE=100
MONGODB_MIN_POOL_SIZE=5
MONGODB_MAX_IDLE_TIME_MS=30000
MONGODB_CONNECT_TIMEOUT_MS=10000
MONGODB_SOCKET_TIMEOUT_MS=45000
MONGODB_SSL=true
MONGODB_SSL_VERIFY_CERT=true

# OpenAI Configuration (if using)
OPENAI_API_KEY=your-openai-api-key-here

# Other Configuration
ENVIRONMENT=development
LOG_LEVEL=INFO
""".format(jwt_secret=generate_jwt_secret(), jwt_128_key=generate_jwt_128_key())

        # Write to .env file
        env_path = Path('.env')
        with open(env_path, 'w') as f:
            f.write(env_content)
        
        print(f"✅ Created .env file at {env_path.absolute()}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to create .env file: {e}")
        return False

def create_env_example() -> bool:
    """Create .env.example file"""
    try:
        example_content = """# MongoDB Atlas Configuration
# Database Configuration
DB_PROVIDER=mongodb

# MongoDB Atlas Connection String
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/squadbox

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_128_KEY=your-128-character-jwt-key-here
JWT_EXPIRE_DAYS=7

# Optional MongoDB Settings
MONGODB_MAX_POOL_SIZE=100
MONGODB_MIN_POOL_SIZE=5
MONGODB_MAX_IDLE_TIME_MS=30000
MONGODB_CONNECT_TIMEOUT_MS=10000
MONGODB_SOCKET_TIMEOUT_MS=45000
MONGODB_SSL=true
MONGODB_SSL_VERIFY_CERT=true

# OpenAI Configuration (if using)
OPENAI_API_KEY=your-openai-api-key-here

# Other Configuration
ENVIRONMENT=development
LOG_LEVEL=INFO
"""

        # Write to .env.example file
        example_path = Path('.env.example')
        with open(example_path, 'w') as f:
            f.write(example_content)
        
        print(f"✅ Created .env.example file at {example_path.absolute()}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to create .env.example file: {e}")
        return False

def print_setup_instructions():
    """Print MongoDB Atlas setup instructions"""
    print("\n" + "="*60)
    print("📋 MONGODB ATLAS SETUP INSTRUCTIONS")
    print("="*60)
    
    print("\n1. 🗄️ Create MongoDB Atlas Cluster:")
    print("   • Go to https://cloud.mongodb.com")
    print("   • Create a new project")
    print("   • Build a new cluster (M0 Free tier recommended)")
    print("   • Choose cloud provider and region")
    
    print("\n2. 👤 Configure Database Access:")
    print("   • Go to Database Access")
    print("   • Create a new database user")
    print("   • Set username and password")
    print("   • Choose 'Read and write to any database' permissions")
    
    print("\n3. 🌐 Configure Network Access:")
    print("   • Go to Network Access")
    print("   • Add IP Address: 0.0.0.0/0 (for development)")
    print("   • For production, add specific IP addresses")
    
    print("\n4. 🔗 Get Connection String:")
    print("   • Go to Clusters")
    print("   • Click 'Connect'")
    print("   • Choose 'Connect your application'")
    print("   • Copy the connection string")
    print("   • Replace <password> with your actual password")
    print("   • Replace <dbname> with 'squadbox'")
    
    print("\n5. ⚙️ Update Environment Variables:")
    print("   • Edit the .env file created by this script")
    print("   • Replace MONGODB_URI with your actual connection string")
    print("   • Update JWT_SECRET if needed")
    
    print("\n6. 🚀 Run Migration:")
    print("   • python3 backend/mongodb_atlas_migration.py")
    
    print("\n7. ✅ Test Connection:")
    print("   • python3 backend/test_mongodb_env.py")

def main():
    """Main setup function"""
    print("🚀 MongoDB Atlas Setup")
    print("="*50)
    
    # Check if .env file already exists
    if Path('.env').exists():
        print("⚠️ .env file already exists")
        response = input("Do you want to overwrite it? (y/N): ")
        if response.lower() != 'y':
            print("Setup cancelled")
            return
    
    # Create environment files
    if not create_env_file():
        sys.exit(1)
    
    if not create_env_example():
        sys.exit(1)
    
    # Print setup instructions
    print_setup_instructions()
    
    print("\n🎉 MongoDB Atlas setup files created successfully!")
    print("📝 Please follow the instructions above to complete the setup")

if __name__ == "__main__":
    main()
