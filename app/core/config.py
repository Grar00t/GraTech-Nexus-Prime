from pydantic_settings import BaseSettings
from typing import Dict

class Settings(BaseSettings):
    PROJECT_NAME: str = "GraTech Nexus Prime"
    VERSION: str = "2.0.0 (Unified)"
    API_PREFIX: str = "/api/v1"
    
    # --- Resource 1: Anthropic (Claude) ---
    CLAUDE_ENDPOINT: str = "https://admin-1533-resource.openai.azure.com/anthropic"
    CLAUDE_KEY: str = "YOUR_API_KEY_HEREYOUR_API_KEY_HEREHv6XJ3w3AAAAACOGIgUf"
    
    # --- Resource 2: GrAgent (GPT-4o) ---
    GRAGENT_ENDPOINT: str = "https://gratech-openai.services.ai.azure.com/api/projects/gratech-openai-project"
    GRAGENT_KEY: str = "YOUR_API_KEY_HEREYOUR_API_KEY_HEREBjFXJ3w3AAABACOGFL56"
    GRAGENT_NAME: str = "GrAgent"

    # --- Resource 3: Llama-4 Maverick ---
    LLAMA_ENDPOINT: str = "https://admin-0242-resource.openai.azure.com/openai/v1/"
    LLAMA_KEY: str = "YOUR_API_KEY_HEREYOUR_API_KEY_HERE3NaXJ3w3AAAAACOGFAni"

    # --- Resource 4: GrAOPS (DeepSeek & Minis) ---
    GRAOPS_PROJECT_ENDPOINT: str = "https://gratechagent-1-resource.services.ai.azure.com/api/projects/gratechagent-1"
    GRAOPS_OPENAI_ENDPOINT: str = "https://gratechagent-1-resource.cognitiveservices.azure.com/"
    GRAOPS_KEY: str = "YOUR_API_KEY_HEREYOUR_API_KEY_HEREHv6XJ3w3AAAAACOGpE2D"
    GRAOPS_AGENT_NAME: str = "GrAOPS"

    # --- Model Mapping ---
    # Maps internal ModelType to (Endpoint_Config_Prefix, Deployment_Name)
    MODEL_MAP: Dict[str, Dict[str, str]] = {
        "claude-3-5-sonnet": {"source": "CLAUDE", "deployment": "claude-sonnet-4-5"},
        "gpt-4o": {"source": "GRAGENT", "deployment": "gpt-4o"}, # Via Agent
        "llama-4-maverick": {"source": "LLAMA", "deployment": "Llama-4-Maverick-17B-128E-Instruct-FP8"},
        "deepseek-r1": {"source": "GRAOPS_OPENAI", "deployment": "DeepSeek-R1"},
        "gpt-4.1-mini": {"source": "GRAOPS_OPENAI", "deployment": "gpt-4.1-mini"},
        "o4-mini": {"source": "GRAOPS_OPENAI", "deployment": "o4-mini"},
    }

    class Config:
        env_file = ".env"

settings = Settings()

