from app.core.router import smart_router
from app.lobes.cognitive import cognitive_lobe
from app.lobes.sensory import sensory_lobe
import time

class ExecutiveLobe:
    """
    The 'Frontal Lobe' of GraTech Nexus.
    Orchestrates the flow of information between Sensory and Cognitive lobes.
    """
    
    async def handle_request(self, raw_input: str):
        start_time = time.time()
        
        # 1. Sensory Processing
        clean_input = sensory_lobe.process_input(raw_input)
        
        # 2. Decision Making (Routing)
        selected_model, reason = smart_router.route(clean_input)
        
        # 3. Cognitive Execution
        response = await cognitive_lobe.process(clean_input, selected_model)
        
        execution_time = time.time() - start_time
        
        return {
            "response": response,
            "meta": {
                "model": selected_model.value,
                "routing_reason": reason,
                "execution_time": f"{execution_time:.4f}s",
                "architecture": "Three-Lobe System"
            }
        }

executive_lobe = ExecutiveLobe()
