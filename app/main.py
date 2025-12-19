from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from app.lobes.executive import executive_lobe
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="The Sovereign AI Platform Core - Orchestrating Azure AI Models."
)

class QueryRequest(BaseModel):
    prompt: str

class QueryResponse(BaseModel):
    response: str
    meta: dict

@app.get("/")
async def root():
    return {
        "system": "GraTech Nexus Prime",
        "status": "Operational",
        "architecture": "Three-Lobe (Executive, Sensory, Cognitive)",
        "models_available": list(settings.MODEL_MAP.keys())
    }

@app.post("/nexus/chat", response_model=QueryResponse)
async def chat(request: QueryRequest):
    """
    The main entry point for the Nexus.
    Routes the prompt to the best Azure AI model based on intent and language.
    """
    try:
        result = await executive_lobe.handle_request(request.prompt)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
