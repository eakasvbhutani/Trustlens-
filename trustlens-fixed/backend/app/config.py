import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Resolve .env relative to the backend/ package root, not the process CWD,
# so `uvicorn app.main:app` works from any directory.
BACKEND_ROOT = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "TrustLens API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment & Feature Flags
    DEMO_MODE: bool = True
    GEMINI_API_KEY: str = ""
    HUGGINGFACE_API_KEY: str = ""
    DEEPFAKE_PROVIDER: str = "mock"  # Options: mock, huggingface
    CONTEXT_PROVIDER: str = "mock"   # Options: mock, google, tavily
    
    # Trust Engine Weights (Total should equal 1.0)
    WEIGHT_DEEPFAKE: float = 0.40
    WEIGHT_GEMINI: float = 0.20
    WEIGHT_METADATA: float = 0.15
    WEIGHT_CONTEXT: float = 0.25
    
    # File limits
    MAX_IMAGE_SIZE_MB: int = 15
    MAX_VIDEO_SIZE_MB: int = 50
    ALLOWED_IMAGE_EXTENSIONS: list[str] = ["jpg", "jpeg", "png", "webp"]
    ALLOWED_VIDEO_EXTENSIONS: list[str] = ["mp4", "mov", "webm"]
    # "image/jpg" is not an official type but is emitted by some browsers and clients.
    ALLOWED_IMAGE_MIME_TYPES: list[str] = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    ALLOWED_VIDEO_MIME_TYPES: list[str] = ["video/mp4", "video/quicktime", "video/webm"]

    # CORS: explicit allowlist. Wildcard origins are invalid alongside credentials.
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    model_config = SettingsConfigDict(
        env_file=str(BACKEND_ROOT / ".env"),
        case_sensitive=True,
        extra="ignore",
    )

settings = Settings()
