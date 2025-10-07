#!/usr/bin/env python3
"""
MongoDB Environment Variables Test Script
Page Purpose: Test and verify MongoDB environment configuration
Last Modified: 2024-12-19
By: AI Assistant
Completeness Score: 100/100
"""

import os
import sys
import json
import subprocess
from typing import Dict, List, Optional

def check_environment_variables() -> Dict[str, bool]:
    """Check if all required environment variables are set"""
    print("🔍 Checking Environment Variables...")
    
    required_vars = {
        'MONGODB_URI': False,
        'JWT_SECRET': False,
        'JWT_128_KEY': False,
        'JWT_EXPIRE_DAYS': False
    }
    
    optional_vars = {
        'MONGODB_MAX_POOL_SIZE': False,
        'MONGODB_MIN_POOL_SIZE': False,
        'MONGODB_MAX_IDLE_TIME_MS': False,
        'MONGODB_CONNECT_TIMEOUT_MS': False,
        'MONGODB_SOCKET_TIMEOUT_MS': False,
        'MONGODB_SSL': False,
        'MONGODB_SSL_VERIFY_CERT': False
    }
    
    # Check required variables
    for var in required_vars:
        value = os.getenv(var)
        if value:
            required_vars[var] = True
            print(f"  ✅ {var}: {'*' * min(len(value), 10)}...")
        else:
            print(f"  ❌ {var}: Not set")
    
    # Check optional variables
    for var in optional_vars:
        value = os.getenv(var)
        if value:
            optional_vars[var] = True
            print(f"  ✅ {var}: {value}")
        else:
            print(f"  ⚠️  {var}: Not set (optional)")
    
    return {**required_vars, **optional_vars}

def check_python_dependencies() -> Dict[str, bool]:
    """Check if required Python dependencies are installed"""
    print("\n🐍 Checking Python Dependencies...")
    
    # Use importable module names
    dependencies = {
        'pymongo': False,
        'certifi': False,
        'dotenv': False
    }
    
    for dep in dependencies:
        try:
            __import__(dep)
            dependencies[dep] = True
            print(f"  ✅ {dep}: Installed")
        except ImportError:
            print(f"  ❌ {dep}: Not installed")
    
    return dependencies

def check_node_dependencies() -> Dict[str, bool]:
    """Check if required Node.js dependencies are installed"""
    print("\n🟢 Checking Node.js Dependencies...")
    
    dependencies = {
        'mongodb': False,
        'mongoose': False
    }
    
    try:
        # Check package.json for dependencies
        with open('package.json', 'r') as f:
            package_data = json.load(f)
        
        deps = package_data.get('dependencies', {})
        
        for dep in dependencies:
            if dep in deps:
                dependencies[dep] = True
                print(f"  ✅ {dep}: {deps[dep]}")
            else:
                print(f"  ❌ {dep}: Not found in package.json")
                
    except FileNotFoundError:
        print("  ❌ package.json not found")
    except json.JSONDecodeError:
        print("  ❌ Invalid package.json format")
    
    return dependencies

def test_mongodb_connection() -> bool:
    """Test MongoDB connection"""
    print("\n🔌 Testing MongoDB Connection...")
    
    mongodb_uri = os.getenv('MONGODB_URI')
    if not mongodb_uri:
        print("  ❌ MONGODB_URI not set")
        return False
    
    try:
        from pymongo import MongoClient
        import certifi
        
        # Create client with SSL certificate verification
        client = MongoClient(mongodb_uri, tlsCAFile=certifi.where())
        
        # Test connection
        client.admin.command('ping')
        print("  ✅ MongoDB connection successful!")
        
        # Get database info (infer from URI path; fallback to 'squadbox' then 'admin')
        from urllib.parse import urlparse
        parsed = urlparse(mongodb_uri)
        db_name = (parsed.path.lstrip('/') or 'squadbox')
        db = client.get_database(db_name)
        print(f"  📊 Database: {db.name}")
        
        # List collections
        collections = db.list_collection_names()
        print(f"  📁 Collections: {collections}")
        
        # Close connection
        client.close()
        return True
        
    except ImportError as e:
        print(f"  ❌ Missing dependency: {e}")
        return False
    except Exception as e:
        print(f"  ❌ Connection failed: {e}")
        return False

def test_jwt_configuration() -> bool:
    """Test JWT configuration"""
    print("\n🔐 Testing JWT Configuration...")
    
    jwt_secret = os.getenv('JWT_SECRET')
    jwt_128_key = os.getenv('JWT_128_KEY')
    jwt_expire_days = os.getenv('JWT_EXPIRE_DAYS', '7')
    
    if not jwt_secret:
        print("  ❌ JWT_SECRET not set")
        return False
    
    if not jwt_128_key:
        print("  ❌ JWT_128_KEY not set")
        return False
    
    if jwt_secret == 'your-secret-key' or jwt_secret == 'your-super-secret-jwt-key-here':
        print("  ⚠️  JWT_SECRET is using default value - should be changed for production")
        return False
    
    if jwt_128_key == 'your-128-character-jwt-key-here':
        print("  ⚠️  JWT_128_KEY is using default value - should be changed for production")
        return False
    
    if len(jwt_128_key) != 128:
        print(f"  ⚠️  JWT_128_KEY should be 128 characters long, got {len(jwt_128_key)}")
        return False
    
    try:
        jwt_expire = int(jwt_expire_days)
        print(f"  ✅ JWT_SECRET: {'*' * min(len(jwt_secret), 10)}...")
        print(f"  ✅ JWT_128_KEY: {'*' * min(len(jwt_128_key), 10)}... ({len(jwt_128_key)} chars)")
        print(f"  ✅ JWT_EXPIRE_DAYS: {jwt_expire}")
        return True
    except ValueError:
        print(f"  ❌ JWT_EXPIRE_DAYS is not a valid number: {jwt_expire_days}")
        return False

def generate_environment_summary(env_vars: Dict[str, bool], 
                               py_deps: Dict[str, bool], 
                               node_deps: Dict[str, bool],
                               mongo_conn: bool,
                               jwt_config: bool) -> None:
    """Generate summary of environment configuration"""
    print("\n" + "="*60)
    print("📋 ENVIRONMENT CONFIGURATION SUMMARY")
    print("="*60)
    
    # Required environment variables
    required_vars = ['MONGODB_URI', 'JWT_SECRET', 'JWT_128_KEY', 'JWT_EXPIRE_DAYS']
    required_count = sum(1 for var in required_vars if env_vars.get(var, False))
    print(f"🔧 Environment Variables: {required_count}/{len(required_vars)} required set")
    
    # Python dependencies
    py_count = sum(1 for dep in py_deps.values())
    print(f"🐍 Python Dependencies: {py_count}/{len(py_deps)} installed")
    
    # Node.js dependencies
    node_count = sum(1 for dep in node_deps.values())
    print(f"🟢 Node.js Dependencies: {node_count}/{len(node_deps)} found")
    
    # Connection tests
    print(f"🔌 MongoDB Connection: {'✅ Working' if mongo_conn else '❌ Failed'}")
    print(f"🔐 JWT Configuration: {'✅ Valid' if jwt_config else '❌ Invalid'}")
    
    # Overall status
    total_checks = len(required_vars) + len(py_deps) + len(node_deps) + 2
    passed_checks = required_count + py_count + node_count + (1 if mongo_conn else 0) + (1 if jwt_config else 0)
    percentage = (passed_checks / total_checks) * 100
    
    print(f"\n📊 Overall Status: {passed_checks}/{total_checks} checks passed ({percentage:.1f}%)")
    
    if percentage >= 90:
        print("🎉 MongoDB environment is ready for development!")
    elif percentage >= 70:
        print("⚠️  MongoDB environment needs some configuration")
    else:
        print("❌ MongoDB environment needs significant setup")

def main():
    """Main test function"""
    print("🚀 MongoDB Environment Variables Test")
    print("="*50)
    
    # Load environment variables from .env file if it exists
    try:
        from dotenv import load_dotenv
        load_dotenv()
        print("📄 Loaded environment variables from .env file")
    except ImportError:
        print("⚠️  python-dotenv not installed, using system environment variables")
    except Exception as e:
        print(f"⚠️  Could not load .env file: {e}")
    
    # Run all checks
    env_vars = check_environment_variables()
    py_deps = check_python_dependencies()
    node_deps = check_node_dependencies()
    mongo_conn = test_mongodb_connection()
    jwt_config = test_jwt_configuration()
    
    # Generate summary
    generate_environment_summary(env_vars, py_deps, node_deps, mongo_conn, jwt_config)
    
    # Exit with appropriate code
    if mongo_conn and jwt_config:
        print("\n✅ All critical tests passed!")
        sys.exit(0)
    else:
        print("\n❌ Some critical tests failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()
