from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .settings import get_settings
from .llm_clients import LLMClientManager

app = FastAPI(title="GraTech Nexus API")
settings = get_settings()
llm_manager = LLMClientManager(settings)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    messages: list
    model: str = "gpt-4o"
    temperature: float = 0.7

@app.get("/")
def read_root():
    return {"status": "System Online", "foundry": "Active"}

@app.post("/api/v1/chat")
async def chat_endpoint(request: ChatRequest):
    response = await llm_manager.chat(request.messages, request.model, request.temperature)
    return {"content": response, "model": request.model}
