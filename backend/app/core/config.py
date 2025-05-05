from pydantic_settings import BaseSettings
from typing import Optional
import os
from pathlib import Path

class Settings(BaseSettings):
    PROJECT_NAME: str = "Atech Training System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "sqlite:///./ai_training.db"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # File storage
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    UPLOAD_FOLDER: str = str(BASE_DIR / "uploads")
    FEATURE_EXTRACTION_MODEL_PATH: str = str(BASE_DIR / "models" / "feature_extraction_model")
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

# Create required directories
os.makedirs(settings.UPLOAD_FOLDER, exist_ok=True)
os.makedirs(settings.FEATURE_EXTRACTION_MODEL_PATH, exist_ok=True)
os.makedirs(os.path.dirname(settings.DATABASE_URL.split("///")[1]), exist_ok=True) 