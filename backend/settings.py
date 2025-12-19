from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import List

class Settings(BaseSettings):
    AZURE_OPENAI_ENDPOINT: str = "https://gratech-openai.cognitiveservices.azure.com/"
    AZURE_OPENAI_KEY: str = "YOUR_API_KEY_HEREYOUR_API_KEY_HEREBjFXJ3w3AAABACOGFL56"
    AZURE_OPENAI_DEPLOYMENT: str = "gpt-4o"
    AZURE_OPENAI_API_VERSION: str = "2024-02-15-preview"
    
    AZURE_CLAUDE_ENDPOINT: str = "https://admin-1533-resource.cognitiveservices.azure.com/"
    AZURE_CLAUDE_KEY: str = "YOUR_API_KEY_HEREYOUR_API_KEY_HEREHv6XJ3w3AAAAACOGIgUf"
    
    AZURE_DEEPSEEK_ENDPOINT: str = "https://gratechagent-1-resource.cognitiveservices.azure.com/"
    AZURE_DEEPSEEK_KEY: str = "YOUR_API_KEY_HEREYOUR_API_KEY_HEREHv6XJ3w3AAAAACOGpE2D"
    
    GEMINI_API_KEY: str = "" # User will provide this via UI or Env
    
    APP_NAME: str = "GraTech AI Nexus"
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

