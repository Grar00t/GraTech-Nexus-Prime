import os
from app.core.config import settings
from app.core.router import ModelType
from openai import AsyncOpenAI, AsyncAzureOpenAI
from azure.ai.projects import AIProjectClient
from azure.identity import AzureKeyCredential
try:
    from anthropic import AnthropicFoundry
except ImportError:
    AnthropicFoundry = None

class CognitiveLobe:
    """
    The 'Cortex' of GraTech Nexus.
    Unified interface for ALL your Azure AI Resources.
    """
    
    def __init__(self):
        print("🧠 Initializing Cognitive Lobe Connections...")
        
        # 1. Claude Client (admin-1533)
        if AnthropicFoundry:
            self.claude_client = AnthropicFoundry(
                api_key=settings.CLAUDE_KEY,
                base_url=settings.CLAUDE_ENDPOINT
            )
        else:
            self.claude_client = None

        # 2. GrAgent Client (gratech-openai-project)
        self.gragent_client = AIProjectClient(
            endpoint=settings.GRAGENT_ENDPOINT,
            credential=AzureKeyCredential(settings.GRAGENT_KEY)
        )
        
        # 3. Llama Client (admin-0242)
        self.llama_client = AsyncOpenAI(
            base_url=settings.LLAMA_ENDPOINT,
            api_key=settings.LLAMA_KEY
        )
        
        # 4. GrAOPS/DeepSeek Client (gratechagent-1)
        self.graops_client = AsyncAzureOpenAI(
            azure_endpoint=settings.GRAOPS_OPENAI_ENDPOINT,
            api_key=settings.GRAOPS_KEY,
            api_version="2024-05-01-preview"
        )

    async def process(self, prompt: str, model: ModelType) -> str:
        config = settings.MODEL_MAP.get(model.value)
        source = config["source"]
        deployment = config["deployment"]
        
        print(f"�� Routing to {model.value} via {source}...")

        try:
            if source == "CLAUDE":
                return await self._call_claude(prompt, deployment)
            elif source == "GRAGENT":
                return await self._call_agent(prompt, self.gragent_client, settings.GRAGENT_NAME)
            elif source == "LLAMA":
                return await self._call_openai_compat(prompt, deployment, self.llama_client)
            elif source == "GRAOPS_OPENAI":
                return await self._call_azure_standard(prompt, deployment, self.graops_client)
            else:
                return "⚠️ Unknown Model Source"
        except Exception as e:
            return f"⚠️ Cognitive Error ({source}): {str(e)}"

    async def _call_claude(self, prompt: str, deployment: str) -> str:
        if not self.claude_client: return "Anthropic SDK missing."
        # Assuming sync for now as per snippet
        msg = self.claude_client.messages.create(
            model=deployment,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1024
        )
        return msg.content[0].text

    async def _call_agent(self, prompt: str, client: AIProjectClient, agent_name: str) -> str:
        # Using the Agent SDK
        agent = client.agents.get(agent_name=agent_name)
        openai_client = client.get_openai_client()
        response = openai_client.responses.create(
            input=[{"role": "user", "content": prompt}],
            extra_body={"agent": {"name": agent.name, "type": "agent_reference"}},
        )
        return response.output_text

    async def _call_openai_compat(self, prompt: str, deployment: str, client: AsyncOpenAI) -> str:
        response = await client.chat.completions.create(
            model=deployment,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        return response.choices[0].message.content

    async def _call_azure_standard(self, prompt: str, deployment: str, client: AsyncAzureOpenAI) -> str:
        response = await client.chat.completions.create(
            model=deployment,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7
        )
        return response.choices[0].message.content

cognitive_lobe = CognitiveLobe()
