# GraTech Nexus Prime 🚀

**The Sovereign AI Platform Core**

Built on the principles of **Cognitive Sovereignty** and **Three-Lobe Architecture**. This platform orchestrates a fleet of Azure AI models to deliver the perfect response for every task.

## 🧠 Architecture

### 1. Executive Lobe (The Orchestrator)
- Manages the flow of information.
- Coordinates between Sensory and Cognitive lobes.
- Ensures the system goal is met.

### 2. Sensory Lobe (The Filter)
- Sanitizes inputs.
- Protects PII (Privacy).
- Prepares context.

### 3. Cognitive Lobe (The Cortex)
- Interfaces with **Azure AI Foundry**.
- **Smart Router**: Dynamically selects the best model:
    - 🇸🇦 **Arabic** -> **Claude 3.5 Sonnet**
    - 💻 **Code** -> **GPT-4o**
    - 🔬 **Analysis** -> **DeepSeek R1**
    - ⚡ **General** -> **Gemini 1.5 Pro**

## 🛠️ Setup

1.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

2.  **Configure Azure:**
    Edit `app/core/config.py` or create a `.env` file with your Azure Endpoint and Keys.
    *Note: This system assumes you have deployments for the models listed in `MODEL_MAP`.*

3.  **Run the Nexus:**
    ```bash
    python -m app.main
    ```

4.  **Access API:**
    Open `http://localhost:8000/docs` to test the Smart Router.

## 🌟 Vision
"Data never leaves your infrastructure. Complete ownership and compliance."
- *Sulaiman Alshammari*

---
*Built by GraTech AI*
