"""
Backend Configuration Manager for Squadbox
Purpose: Load and manage BE_* environment variables
Last modified: 2025-01-30
By: AI Assistant
Completeness: 95/100
"""

import os
import logging
from typing import Dict, Any, Optional
from pathlib import Path

class BackendConfig:
    """Backend configuration manager for BE_* environment variables"""
    
    def __init__(self, env_file: Optional[str] = None):
        self.logger = logging.getLogger(__name__)
        self.config = {}
        
        # Load environment file if provided
        if env_file and os.path.exists(env_file):
            self.load_env_file(env_file)
        
        # Load all BE_* environment variables
        self.load_backend_env()
    
    def load_env_file(self, env_file: str):
        """Load environment variables from file"""
        try:
            with open(env_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        os.environ[key] = value
            self.logger.info(f"Loaded environment file: {env_file}")
        except Exception as e:
            self.logger.error(f"Failed to load environment file {env_file}: {e}")
    
    def load_backend_env(self):
        """Load all BE_* environment variables"""
        be_vars = {k: v for k, v in os.environ.items() if k.startswith('BE_')}
        self.config.update(be_vars)
        self.logger.info(f"Loaded {len(be_vars)} BE_* environment variables")
    
    def get(self, key: str, default: Any = None) -> Any:
        """Get configuration value"""
        return self.config.get(key, os.environ.get(key, default))
    
    def get_bool(self, key: str, default: bool = False) -> bool:
        """Get boolean configuration value"""
        value = self.get(key, str(default)).lower()
        return value in ('true', '1', 'yes', 'on')
    
    def get_int(self, key: str, default: int = 0) -> int:
        """Get integer configuration value"""
        try:
            return int(self.get(key, str(default)))
        except ValueError:
            return default
    
    def get_float(self, key: str, default: float = 0.0) -> float:
        """Get float configuration value"""
        try:
            return float(self.get(key, str(default)))
        except ValueError:
            return default
    
    def get_list(self, key: str, separator: str = ',', default: list = None) -> list:
        """Get list configuration value"""
        if default is None:
            default = []
        value = self.get(key, '')
        if not value:
            return default
        return [item.strip() for item in value.split(separator) if item.strip()]
    
    # Core Backend Configuration
    @property
    def host(self) -> str:
        return self.get('BE_HOST', '0.0.0.0')
    
    @property
    def port(self) -> int:
        return self.get_int('BE_PORT', 8000)
    
    @property
    def workers(self) -> int:
        return self.get_int('BE_WORKERS', 4)
    
    @property
    def reload(self) -> bool:
        return self.get_bool('BE_RELOAD', True)
    
    @property
    def log_level(self) -> str:
        return self.get('BE_LOG_LEVEL', 'INFO')
    
    @property
    def debug(self) -> bool:
        return self.get_bool('BE_DEBUG', False)
    
    # Database Configuration
    @property
    def db_provider(self) -> str:
        return self.get('BE_DB_PROVIDER', 'postgresql')
    
    @property
    def db_host(self) -> str:
        return self.get('BE_DB_HOST', 'postgres')
    
    @property
    def db_port(self) -> int:
        return self.get_int('BE_DB_PORT', 5432)
    
    @property
    def db_name(self) -> str:
        return self.get('BE_DB_NAME', 'gdiba2_squadbox')
    
    @property
    def db_user(self) -> str:
        return self.get('BE_DB_USER', 'gdiba-2tb-hostingcom')
    
    @property
    def db_password(self) -> str:
        return self.get('BE_DB_PASSWORD', 'xuPxu7-buwxaq-kemryf')
    
    @property
    def db_url(self) -> str:
        return self.get('BE_DB_URL', f'postgresql://{self.db_user}:{self.db_password}@{self.db_host}:{self.db_port}/{self.db_name}')
    
    # Authentication Configuration
    @property
    def jwt_secret(self) -> str:
        return self.get('BE_AUTH_JWT_SECRET', 'your-super-secret-jwt-key-here-64-chars-long')
    
    @property
    def jwt_128_key(self) -> str:
        return self.get('BE_AUTH_JWT_128_KEY', 'your-super-secret-jwt-128-key-here-128-chars-long-for-enhanced-security')
    
    @property
    def jwt_expire_days(self) -> int:
        return self.get_int('BE_AUTH_JWT_EXPIRE_DAYS', 7)
    
    # LLM Configuration
    @property
    def llm_provider(self) -> str:
        return self.get('BE_LLM_PROVIDER', 'ollama')
    
    @property
    def llm_host(self) -> str:
        return self.get('BE_LLM_HOST', 'localhost')
    
    @property
    def llm_port(self) -> int:
        return self.get_int('BE_LLM_PORT', 11434)
    
    @property
    def llm_model(self) -> str:
        return self.get('BE_LLM_MODEL', 'tinyllama:latest')
    
    @property
    def llm_timeout(self) -> int:
        return self.get_int('BE_LLM_TIMEOUT', 30)
    
    # Project Configuration
    @property
    def project_storage_path(self) -> str:
        return self.get('BE_PROJECT_STORAGE_PATH', '/app/generated_projects')
    
    @property
    def project_max_size_mb(self) -> int:
        return self.get_int('BE_PROJECT_MAX_SIZE_MB', 100)
    
    @property
    def project_max_files(self) -> int:
        return self.get_int('BE_PROJECT_MAX_FILES', 1000)
    
    @property
    def project_generation_timeout(self) -> int:
        return self.get_int('BE_PROJECT_GENERATION_TIMEOUT', 300)
    
    # Security Configuration
    @property
    def cors_origins(self) -> list:
        return self.get_list('BE_SECURITY_CORS_ORIGINS', default=[
            'https://squadbox.gdiba2.ssh.tb-hosting.com',
            'https://www.squadbox.gdiba2.ssh.tb-hosting.com'
        ])
    
    @property
    def cors_methods(self) -> list:
        return self.get_list('BE_SECURITY_CORS_METHODS', default=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    
    @property
    def cors_headers(self) -> list:
        return self.get_list('BE_SECURITY_CORS_HEADERS', default=['*'])
    
    @property
    def cors_credentials(self) -> bool:
        return self.get_bool('BE_SECURITY_CORS_CREDENTIALS', True)
    
    # Logging Configuration
    @property
    def log_file(self) -> str:
        return self.get('BE_LOG_FILE', '/app/logs/backend.log')
    
    @property
    def log_max_size(self) -> int:
        return self.get_int('BE_LOG_MAX_SIZE', 10485760)  # 10MB
    
    @property
    def log_backup_count(self) -> int:
        return self.get_int('BE_LOG_BACKUP_COUNT', 5)
    
    # Monitoring Configuration
    @property
    def monitor_health_enabled(self) -> bool:
        return self.get_bool('BE_MONITOR_HEALTH_ENABLED', True)
    
    @property
    def monitor_metrics_enabled(self) -> bool:
        return self.get_bool('BE_MONITOR_METRICS_ENABLED', True)
    
    @property
    def monitor_metrics_port(self) -> int:
        return self.get_int('BE_MONITOR_METRICS_PORT', 9090)
    
    # Development Configuration
    @property
    def dev_mode(self) -> bool:
        return self.get_bool('BE_DEV_MODE', False)
    
    @property
    def test_mode(self) -> bool:
        return self.get_bool('BE_TEST_MODE', False)
    
    def get_database_config(self) -> Dict[str, Any]:
        """Get database configuration dictionary"""
        return {
            'provider': self.db_provider,
            'host': self.db_host,
            'port': self.db_port,
            'name': self.db_name,
            'user': self.db_user,
            'password': self.db_password,
            'url': self.db_url,
            'pool_size': self.get_int('BE_DB_POOL_SIZE', 10),
            'max_overflow': self.get_int('BE_DB_MAX_OVERFLOW', 20),
            'pool_timeout': self.get_int('BE_DB_POOL_TIMEOUT', 30),
            'pool_recycle': self.get_int('BE_DB_POOL_RECYCLE', 3600)
        }
    
    def get_llm_config(self) -> Dict[str, Any]:
        """Get LLM configuration dictionary"""
        return {
            'provider': self.llm_provider,
            'host': self.llm_host,
            'port': self.llm_port,
            'model': self.llm_model,
            'timeout': self.llm_timeout,
            'max_tokens': self.get_int('BE_LLM_MAX_TOKENS', 4000),
            'temperature': self.get_float('BE_LLM_TEMPERATURE', 0.2)
        }
    
    def get_security_config(self) -> Dict[str, Any]:
        """Get security configuration dictionary"""
        return {
            'cors_origins': self.cors_origins,
            'cors_methods': self.cors_methods,
            'cors_headers': self.cors_headers,
            'cors_credentials': self.cors_credentials,
            'rate_limit_requests': self.get_int('BE_SECURITY_RATE_LIMIT_REQUESTS', 100),
            'rate_limit_window': self.get_int('BE_SECURITY_RATE_LIMIT_WINDOW', 60),
            'rate_limit_burst': self.get_int('BE_SECURITY_RATE_LIMIT_BURST', 10),
            'headers_enabled': self.get_bool('BE_SECURITY_HEADERS_ENABLED', True),
            'https_redirect': self.get_bool('BE_SECURITY_HTTPS_REDIRECT', True),
            'hsts_enabled': self.get_bool('BE_SECURITY_HSTS_ENABLED', True),
            'xss_protection': self.get_bool('BE_SECURITY_XSS_PROTECTION', True)
        }
    
    def get_project_config(self) -> Dict[str, Any]:
        """Get project configuration dictionary"""
        return {
            'storage_path': self.project_storage_path,
            'max_size_mb': self.project_max_size_mb,
            'max_files': self.project_max_files,
            'generation_timeout': self.project_generation_timeout,
            'max_concurrent': self.get_int('BE_PROJECT_MAX_CONCURRENT', 5),
            'retry_attempts': self.get_int('BE_PROJECT_RETRY_ATTEMPTS', 3),
            'fallback_enabled': self.get_bool('BE_PROJECT_FALLBACK_ENABLED', True),
            'cleanup_days': self.get_int('BE_PROJECT_CLEANUP_DAYS', 30)
        }
    
    def setup_logging(self):
        """Setup logging configuration"""
        log_level = getattr(logging, self.log_level.upper(), logging.INFO)
        
        # Create logs directory if it doesn't exist
        log_file_path = Path(self.log_file)
        log_file_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Configure logging
        logging.basicConfig(
            level=log_level,
            format=self.get('BE_LOG_FORMAT', '%(asctime)s - %(name)s - %(levelname)s - %(message)s'),
            handlers=[
                logging.FileHandler(self.log_file),
                logging.StreamHandler()
            ]
        )
        
        self.logger.info(f"Logging configured - Level: {self.log_level}, File: {self.log_file}")
    
    def validate_config(self) -> bool:
        """Validate configuration"""
        errors = []
        
        # Validate database configuration
        if not self.db_name:
            errors.append("Database name is required")
        
        if not self.db_user:
            errors.append("Database user is required")
        
        if not self.db_password:
            errors.append("Database password is required")
        
        # Validate JWT configuration
        if not self.jwt_secret or len(self.jwt_secret) < 32:
            errors.append("JWT secret must be at least 32 characters")
        
        # Validate project storage path
        if not self.project_storage_path:
            errors.append("Project storage path is required")
        
        if errors:
            for error in errors:
                self.logger.error(f"Configuration error: {error}")
            return False
        
        self.logger.info("Configuration validation passed")
        return True
    
    def print_config_summary(self):
        """Print configuration summary"""
        print("🔧 BACKEND CONFIGURATION SUMMARY")
        print("=" * 50)
        print(f"Host: {self.host}:{self.port}")
        print(f"Workers: {self.workers}")
        print(f"Debug: {self.debug}")
        print(f"Log Level: {self.log_level}")
        print(f"Database: {self.db_provider}://{self.db_user}@{self.db_host}:{self.db_port}/{self.db_name}")
        print(f"LLM Provider: {self.llm_provider} ({self.llm_model})")
        print(f"Project Storage: {self.project_storage_path}")
        print(f"CORS Origins: {', '.join(self.cors_origins)}")
        print(f"Health Monitoring: {self.monitor_health_enabled}")
        print(f"Metrics: {self.monitor_metrics_enabled}")
        print("=" * 50)

# Global configuration instance
config = BackendConfig()

# Convenience functions
def get_config() -> BackendConfig:
    """Get global configuration instance"""
    return config

def reload_config():
    """Reload configuration"""
    global config
    config = BackendConfig()
    return config
