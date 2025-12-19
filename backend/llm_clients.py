from openai import AzureOpenAI
import httpx
from .settings import Settings

class LLMClientManager:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.azure_client = AzureOpenAI(
            azure_endpoint=settings.AZURE_OPENAI_ENDPOINT,
            api_key=settings.AZURE_OPENAI_KEY,
            api_version=settings.AZURE_OPENAI_API_VERSION
        )

    async def chat(self, messages: list, model: str, temperature: float):
        # Routing Logic
        if "gpt" in model.lower():
            response = self.azure_client.chat.completions.create(
                model=self.settings.AZURE_OPENAI_DEPLOYMENT,
                messages=messages,
                temperature=temperature
            )
            return response.choices[0].message.content
            
        elif "claude" in model.lower():
            # Direct HTTP call for Azure Claude (simulated SDK)
            url = f"{self.settings.AZURE_CLAUDE_ENDPOINT}/openai/deployments/{model}/chat/completions?api-version=2024-02-15-preview"
            headers = {"api-key": self.settings.AZURE_CLAUDE_KEY, "Content-Type": "application/json"}
            payload = {"messages": messages, "temperature": temperature, "max_tokens": 4000}
            async with httpx.AsyncClient() as client:
                res = await client.post(url, headers=headers, json=payload)
                if res.status_code != 200: return f"Error from Claude: {res.text}"
                return res.json()['choices'][0]['message']['content']

        elif "deepseek" in model.lower():
             # Direct HTTP call for Azure DeepSeek
            url = f"{self.settings.AZURE_DEEPSEEK_ENDPOINT}/openai/deployments/{model}/chat/completions?api-version=2024-02-15-preview"
            headers = {"api-key": self.settings.AZURE_DEEPSEEK_KEY, "Content-Type": "application/json"}
            payload = {"messages": messages, "temperature": temperature, "max_tokens": 4000}
            async with httpx.AsyncClient() as client:
                res = await client.post(url, headers=headers, json=payload)
                if res.status_code != 200: return f"Error from DeepSeek: {res.text}"
                return res.json()['choices'][0]['message']['content']
        
        return "Model not supported in Backend."
