"""
Authentication API for Squadbox
This module provides FastAPI routes for user authentication with MongoDB
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
import jwt
import os
import sys
import subprocess
from datetime import datetime, timedelta
import json
from dotenv import load_dotenv
import logging

# Load environment variables from both project root and backend folder for flexibility
BASE_DIR = os.path.dirname(__file__)
load_dotenv(os.path.join(BASE_DIR, '..', '.env'))
load_dotenv(os.path.join(BASE_DIR, '.env'))

# Add the current directory to the path for module imports
sys.path.insert(0, os.path.dirname(__file__))

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Try to use the MongoDB connection via Node.js script
MONGODB_URI = os.getenv('MONGODB_URI')
JWT_SECRET = os.getenv('JWT_SECRET', 'your-secret-key')
JWT_128_KEY = os.getenv('JWT_128_KEY', 'your-128-character-jwt-key-here')
JWT_EXPIRE_DAYS = int(os.getenv('JWT_EXPIRE_DAYS', '7'))

# Force lowercase database name to avoid case sensitivity issues
if MONGODB_URI and 'sbox' in MONGODB_URI.lower():
    MONGODB_URI = MONGODB_URI.replace('sbox', 'sbox').replace('SBOX', 'sbox')

if not MONGODB_URI:
    logger.warning("MONGODB_URI is not set; auth endpoints will return 503 until configured.")

if not JWT_128_KEY or len(JWT_128_KEY) != 128:
    logger.warning("JWT_128_KEY is not set or invalid (must be 128 characters) - using fallback")
    JWT_128_KEY = "fallback_jwt_128_key_for_development_only_" * 4  # 128 characters

router = APIRouter(
    prefix="/auth",
    tags=["authentication"],
    responses={404: {"description": "Not found"}},
)

# Define the OAuth2 scheme for token handling
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

# Pydantic models for request and response data
class UserBase(BaseModel):
    username: str
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    role: str
    subscription: str
    projectCount: int = 0

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class SubscriptionUpdate(BaseModel):
    subscription: str = Field(..., pattern="^(free|basic|unlimited)$")

# Helper function to execute Node.js scripts
def execute_node_script(script_name, args=None):
    try:
        if not MONGODB_URI:
            raise Exception("MongoDB not configured (MONGODB_URI missing)")
        base = os.path.join(os.path.dirname(__file__), "js_scripts", script_name)
        script_path_cjs = base + ".cjs"
        script_path_js = base + ".js"
        script_path = script_path_cjs if os.path.exists(script_path_cjs) else script_path_js
        
        # Create the script directory if it doesn't exist
        os.makedirs(os.path.dirname(script_path), exist_ok=True)
        
        # Construct the command
        cmd = ["node", script_path]
        
        if args:
            # Add arguments as JSON string
            cmd.append(json.dumps(args))
        
        # Execute the script
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode != 0:
            logger.error(f"Error executing Node.js script: {result.stderr}")
            raise Exception(f"Node.js script failed: {result.stderr}")
        
        # Check if stdout is empty or invalid JSON
        if not result.stdout.strip():
            logger.error("Node.js script returned empty output")
            raise Exception("Script returned empty response")
        
        # Debug: log the raw output
        logger.info(f"Node.js stdout: {repr(result.stdout)}")
        logger.info(f"Node.js stderr: {repr(result.stderr)}")
        
        try:
            return json.loads(result.stdout)
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON from Node.js script: {result.stdout}")
            raise Exception(f"Invalid JSON response: {str(e)}")
    except Exception as e:
        logger.error(f"Error executing Node.js script: {str(e)}")
        raise e

# Helper function to verify token
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        user_id = payload.get("id")
        
        if user_id is None:
            raise credentials_exception
        
        # Get user from database
        user_data = execute_node_script("get_user", {"userId": user_id})
        
        if not user_data or "success" not in user_data or not user_data["success"]:
            raise credentials_exception
        
        return user_data["user"]
    except jwt.PyJWTError:
        raise credentials_exception

@router.post("/register", response_model=Token)
async def register_user(user_data: UserCreate):
    """Register a new user"""
    try:
        if not MONGODB_URI:
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Auth temporarily unavailable: configure MONGODB_URI")
        # Call Node.js script to register user
        result = execute_node_script("register_user", {
            "username": user_data.username,
            "email": user_data.email,
            "password": user_data.password,
            "name": user_data.name
        })
        
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("message", "Registration failed")
            )
        
        return {
            "access_token": result["token"],
            "token_type": "bearer",
            "user": result["user"]
        }
    except Exception as e:
        logger.error(f"Error registering user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login and get access token"""
    try:
        if not MONGODB_URI:
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Auth temporarily unavailable: configure MONGODB_URI")
        # Call Node.js script to login
        result = execute_node_script("login_user", {
            "email": form_data.username,  # OAuth2 uses 'username' field for identifier
            "password": form_data.password
        })
        
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return {
            "access_token": result["token"],
            "token_type": "bearer",
            "user": result["user"]
        }
    except Exception as e:
        logger.error(f"Error logging in: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information"""
    return current_user

@router.put("/subscription", response_model=UserResponse)
async def update_user_subscription(
    subscription_data: SubscriptionUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update user subscription"""
    try:
        # Call Node.js script to update subscription
        result = execute_node_script("update_subscription", {
            "userId": current_user["id"],
            "subscription": subscription_data.subscription
        })
        
        if not result["success"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=result.get("message", "Failed to update subscription")
            )
        
        return result["user"]
    except Exception as e:
        logger.error(f"Error updating subscription: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )