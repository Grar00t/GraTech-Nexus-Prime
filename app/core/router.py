from enum import Enum
from typing import Tuple
import re

class ModelType(Enum):
    CLAUDE = "claude-3-5-sonnet"
    GPT_4O = "gpt-4o"
    LLAMA_MAVERICK = "llama-4-maverick"
    DEEPSEEK_R1 = "deepseek-r1"
    GPT_4_1_MINI = "gpt-4.1-mini"
    O4_MINI = "o4-mini"

class SmartRouter:
    """
    The 'Cerebellum' of GraTech Nexus.
    Routes tasks to the specific Azure AI resource best suited for the job.
    """
    
    @staticmethod
    def detect_language(text: str) -> str:
        arabic_pattern = re.compile(r'[\u0600-\u06FF]')
        if len(arabic_pattern.findall(text)) / len(text) > 0.2:
            return "ar"
        return "en"

    @staticmethod
    def detect_intent(text: str) -> str:
        text_lower = text.lower()
        
        if any(k in text_lower for k in ['function', 'class', 'def', 'import', 'api', 'bug', 'fix']):
            return "code"
        if any(k in text_lower for k in ['analyze', 'reason', 'why', 'compare', 'study']):
            return "analysis"
        if any(k in text_lower for k in ['quick', 'summary', 'short']):
            return "fast"
        return "general"

    @classmethod
    def route(cls, prompt: str) -> Tuple[ModelType, str]:
        lang = cls.detect_language(prompt)
        intent = cls.detect_intent(prompt)
        
        # 1. Arabic -> Claude (admin-1533)
        if lang == "ar":
            return ModelType.CLAUDE, "Arabic content detected. Routing to Claude 3.5 Sonnet."
            
        # 2. Deep Analysis -> DeepSeek R1 (gratechagent-1)
        if intent == "analysis":
            return ModelType.DEEPSEEK_R1, "Deep reasoning required. Routing to DeepSeek R1."
            
        # 3. Coding -> GPT-4o (via GrAgent)
        if intent == "code":
            return ModelType.GPT_4O, "Coding task. Routing to GrAgent (GPT-4o)."
            
        # 4. Fast/Simple -> o4-mini (gratechagent-1)
        if intent == "fast":
            return ModelType.O4_MINI, "Speed requested. Routing to o4-mini."
            
        # 5. General/Creative -> Llama-4 Maverick (admin-0242)
        return ModelType.LLAMA_MAVERICK, "General query. Routing to Llama-4 Maverick."

smart_router = SmartRouter()
