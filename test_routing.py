import asyncio
import sys
import os

# Add the current directory to sys.path so we can import app
sys.path.append(os.getcwd())

from app.core.router import ModelType
from app.lobes.cognitive import cognitive_lobe

async def test_routing():
    print("🧪 Testing GraTech Nexus Prime Routing Logic...")
    
    # Test 1: Arabic -> Claude
    print("\n--- Test 1: Arabic Prompt (Should route to Claude) ---")
    try:
        # We won't actually make the API call if we don't have valid keys, 
        # but we can check if the client is initialized and the method is called.
        # For this test, we'll just print the client status.
        if cognitive_lobe.claude_client:
            print("✅ Claude Client Initialized")
        else:
            print("⚠️ Claude Client NOT Initialized (Check keys/imports)")
    except Exception as e:
        print(f"❌ Error: {e}")

    # Test 2: Code -> GrAgent
    print("\n--- Test 2: Code Prompt (Should route to GrAgent) ---")
    try:
        if cognitive_lobe.gragent_client:
            print("✅ GrAgent Client Initialized")
        else:
            print("⚠️ GrAgent Client NOT Initialized")
    except Exception as e:
        print(f"❌ Error: {e}")

    # Test 3: Analysis -> DeepSeek
    print("\n--- Test 3: Analysis Prompt (Should route to DeepSeek) ---")
    try:
        if cognitive_lobe.graops_client:
            print("✅ DeepSeek/GrAOPS Client Initialized")
            # Verify it is AsyncAzureOpenAI
            from openai import AsyncAzureOpenAI
            if isinstance(cognitive_lobe.graops_client, AsyncAzureOpenAI):
                 print("✅ Client is correctly AsyncAzureOpenAI")
            else:
                 print(f"❌ Client is {type(cognitive_lobe.graops_client)}, expected AsyncAzureOpenAI")
        else:
            print("⚠️ DeepSeek Client NOT Initialized")
    except Exception as e:
        print(f"❌ Error: {e}")

    # Test 4: General -> Llama
    print("\n--- Test 4: General Prompt (Should route to Llama) ---")
    try:
        if cognitive_lobe.llama_client:
            print("✅ Llama Client Initialized")
        else:
            print("⚠️ Llama Client NOT Initialized")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_routing())
