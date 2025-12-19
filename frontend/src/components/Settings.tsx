import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Trash2, Database, Cloud, Key, Globe, Server, Mic, Languages, Brain, Sparkles, Cpu, Github, Download, Lock, Check, Loader2, Monitor, Twitter, UserCheck, Share2, LayoutGrid, ShieldAlert, GitBranch, Activity, Network } from 'lucide-react';
import { memoryService, memorySystem } from '../utils/MemorySystem';

export const Settings: React.FC = () => {
  const [ghToken, setGhToken] = useState('');
  const [ghRepo, setGhRepo] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');
  
  // GitHub Security Settings
  const [enableDependabot, setEnableDependabot] = useState(true);
  const [enableVulnerabilityAlerts, setEnableVulnerabilityAlerts] = useState(true);

  // Key Vault States
  const [vaultName, setVaultName] = useState('gratechkvprod'); // Pre-filled for Honest Work
  const [tenantId, setTenantId] = useState('a1cc28df-8965-4e03-96cb-5d6172ff55a5'); // Pre-filled for Honest Work
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isFetchingSecrets, setIsFetchingSecrets] = useState(false);
  const [secretStatus, setSecretStatus] = useState('');
  const [keysLoaded, setKeysLoaded] = useState(false);

  // Integrations States
  const [twitterHandle, setTwitterHandle] = useState('@Grar00t');
  const [isTwitterConnected, setIsTwitterConnected] = useState(true);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [azureConnected, setAzureConnected] = useState(true);

  // Resource Endpoints
  const [gptEndpoint, setGptEndpoint] = useState('https://gratech-openai.cognitiveservices.azure.com/');
  const [deepseekEndpoint, setDeepseekEndpoint] = useState('https://gratechagent-1-resource.cognitiveservices.azure.com/');
  const [claudeEndpoint, setClaudeEndpoint] = useState('https://admin-1533-resource.cognitiveservices.azure.com/');
  
  // Real Keys (Added for "Honest Work")
  const [openaiKey, setOpenaiKey] = useState('YOUR_API_KEY_HEREYOUR_API_KEY_HEREBjFXJ3w3AAABACOGFL56');
  const [deepseekKey, setDeepseekKey] = useState('');
  const [claudeKey, setClaudeKey] = useState('');
  const [azureDeployment, setAzureDeployment] = useState('gpt-4');
  const [geminiApiKey, setGeminiApiKey] = useState(''); 

  // Local LLM & Backend Proxy
  const [localLlmEndpoint, setLocalLlmEndpoint] = useState('http://localhost:8000/api/v1/chat');
  const [localLlmModel, setLocalLlmModel] = useState('gpt-4o');
  const [isTestingLocal, setIsTestingLocal] = useState(false);
  const [localTestStatus, setLocalTestStatus] = useState('');
  const [useBackendProxy, setUseBackendProxy] = useState(false);

  // Load settings on mount
  useEffect(() => {
    setGhToken(localStorage.getItem('gratech_gh_token') || '');
    setGhRepo(localStorage.getItem('gratech_gh_repo') || '');
    
    // Check if user overwrote default pre-fills
    const savedVault = localStorage.getItem('gratech_vault_name');
    if (savedVault) setVaultName(savedVault);
    const savedTenant = localStorage.getItem('gratech_tenant_id');
    if (savedTenant) setTenantId(savedTenant);

    setClientId(localStorage.getItem('gratech_client_id') || '');
    setClientSecret(localStorage.getItem('gratech_client_secret') || '');
    
    const savedGpt = localStorage.getItem('gratech_gpt_endpoint');
    if (savedGpt) setGptEndpoint(savedGpt);
    
    const savedDeep = localStorage.getItem('gratech_deepseek_endpoint');
    if (savedDeep) setDeepseekEndpoint(savedDeep);

    const savedClaude = localStorage.getItem('gratech_claude_endpoint');
    if (savedClaude) setClaudeEndpoint(savedClaude);

    const savedOpenaiKey = localStorage.getItem('gratech_openai_key');
    if (savedOpenaiKey) setOpenaiKey(savedOpenaiKey);

    setDeepseekKey(localStorage.getItem('gratech_deepseek_key') || '');
    setClaudeKey(localStorage.getItem('gratech_claude_key') || '');
    setAzureDeployment(localStorage.getItem('gratech_azure_deployment') || 'gpt-4');
    setGeminiApiKey(localStorage.getItem('gratech_gemini_api_key') || ''); 
    
    setLocalLlmEndpoint(localStorage.getItem('gratech_local_llm_endpoint') || 'http://localhost:8000/api/v1/chat');
    setLocalLlmModel(localStorage.getItem('gratech_local_llm_model') || 'gpt-4o');
    setUseBackendProxy(localStorage.getItem('gratech_use_backend_proxy') === 'true');

    if (memorySystem.isNeuralCoreActive()) {
        setKeysLoaded(true);
        setSecretStatus('Secrets injected via Secure Environment (Vault Active)');
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('gratech_gh_token', ghToken);
    localStorage.setItem('gratech_gh_repo', ghRepo);
    localStorage.setItem('gratech_vault_name', vaultName);
    localStorage.setItem('gratech_tenant_id', tenantId);
    localStorage.setItem('gratech_client_id', clientId);
    localStorage.setItem('gratech_client_secret', clientSecret);
    localStorage.setItem('gratech_gpt_endpoint', gptEndpoint);
    localStorage.setItem('gratech_deepseek_endpoint', deepseekEndpoint);
    localStorage.setItem('gratech_claude_endpoint', claudeEndpoint);
    
    localStorage.setItem('gratech_openai_key', openaiKey);
    localStorage.setItem('gratech_deepseek_key', deepseekKey);
    localStorage.setItem('gratech_claude_key', claudeKey);
    localStorage.setItem('gratech_azure_deployment', azureDeployment);
    localStorage.setItem('gratech_gemini_api_key', geminiApiKey); 

    localStorage.setItem('gratech_local_llm_endpoint', localLlmEndpoint);
    localStorage.setItem('gratech_local_llm_model', localLlmModel);
    localStorage.setItem('gratech_use_backend_proxy', useBackendProxy.toString());
    
    alert('System Configuration & Keys Saved to Local Secure Storage.');
  };

  const handleWipeMemory = () => {
    if(window.confirm('WARNING: This will permanently erase the simulated Azure Vector Store and Knowledge Graph. Continue?')) {
        memorySystem.clearMemory();
        alert('System reset complete.');
    }
  };

  const handleGithubSync = async () => {
    if (!ghToken || !ghRepo) {
        alert('Please provide both GitHub Token and Repository (owner/repo).');
        return;
    }
    const [owner, repo] = ghRepo.split('/');
    if (!owner || !repo) {
        alert('Invalid repository format. Use owner/repo.');
        return;
    }

    setIsSyncing(true);
    setSyncStatus('Connecting to GitHub API...');
    try {
        const result = await memoryService.syncGitHub(ghToken, owner, repo);
        if (result.success) {
            setSyncStatus(`Success: Indexed ${result.count} issues/PRs into Memory Graph.`);
        } else {
            setSyncStatus(`Sync Failed: ${result.error}`);
        }
    } catch (e) {
        setSyncStatus('Critical Error occurred during sync.');
    } finally {
        setIsSyncing(false);
    }
  };

  const handleTestLocalConnection = async () => {
    if (!localLlmEndpoint) return;
    setIsTestingLocal(true);
    setLocalTestStatus('Connecting...');
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const isPythonBackend = localLlmEndpoint.includes(':8000');
        
        let bodyPayload;
        if (isPythonBackend) {
             bodyPayload = {
                messages: [{ role: "user", content: "ping" }],
                model: localLlmModel,
                temperature: 0.7
            };
        } else {
             bodyPayload = {
                model: localLlmModel,
                prompt: "ping",
                stream: false
            };
        }

        const response = await fetch(localLlmEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyPayload),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            setLocalTestStatus('Connection Successful');
        } else {
            setLocalTestStatus(`Error: ${response.status}`);
        }
    } catch (e) {
        console.error(e);
        setLocalTestStatus('Unreachable (Check CORS/Port)');
    } finally {
        setIsTestingLocal(false);
    }
  };

  return (
    <div className="p-4 md:p-8 h-full overflow-y-auto bg-[#020617]">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">System Configuration</h1>
                <p className="text-slate-400 mt-1">Manage external connections, security vaults, and memory banks.</p>
            </div>
            <div className="flex gap-2">
                 <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
                 >
                    <Save size={16} /> Save Changes
                </button>
            </div>
        </div>

        {/* --- SOVEREIGN INTEGRATIONS --- */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-pink-500/20 rounded-lg">
                    <Share2 className="text-pink-400" size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Sovereign Integrations</h2>
                    <p className="text-sm text-slate-400">Connect external identity providers and social graphs.</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* X / Twitter */}
                <div className={`p-4 rounded-xl border transition-all ${isTwitterConnected ? 'bg-slate-950/50 border-indigo-500/30' : 'bg-slate-950 border-slate-800'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-black rounded-lg border border-slate-700">
                                <Twitter size={18} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">X (Twitter)</h3>
                                <p className="text-xs text-slate-500">Auto-Promotion & Auth</p>
                            </div>
                        </div>
                        {isTwitterConnected ? (
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded border border-emerald-500/20">CONNECTED</span>
                        ) : (
                            <button className="text-xs text-indigo-400 hover:text-white transition-colors">Connect</button>
                        )}
                    </div>
                    
                    {isTwitterConnected && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs bg-black/40 p-2 rounded border border-white/5">
                                <span className="text-slate-400">Linked Account</span>
                                <span className="text-white font-mono flex items-center gap-1">
                                    {twitterHandle} <UserCheck size={10} className="text-blue-400" />
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs bg-black/40 p-2 rounded border border-white/5">
                                <span className="text-slate-400">Corporate Account</span>
                                <span className="text-white font-mono flex items-center gap-1">
                                    @GraTechSA <UserCheck size={10} className="text-amber-400" />
                                </span>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-800 text-indigo-600" />
                                <label className="text-xs text-slate-400">Auto-post major release notes</label>
                            </div>
                        </div>
                    )}
                </div>

                {/* Microsoft Graph */}
                <div className={`p-4 rounded-xl border transition-all ${azureConnected ? 'bg-slate-950/50 border-blue-500/30' : 'bg-slate-950 border-slate-800'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#0078D4]/10 rounded-lg border border-[#0078D4]/30">
                                <LayoutGrid size={18} className="text-[#0078D4]" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">Microsoft Azure</h3>
                                <p className="text-xs text-slate-500">Identity & Graph API</p>
                            </div>
                        </div>
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded border border-blue-500/20">ACTIVE</span>
                    </div>
                     <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs bg-black/40 p-2 rounded border border-white/5">
                            <span className="text-slate-400">Tenant ID</span>
                            <span className="text-white font-mono truncate max-w-[120px]">dde8416c...</span>
                        </div>
                         <div className="flex items-center justify-between text-xs bg-black/40 p-2 rounded border border-white/5">
                            <span className="text-slate-400">Permissions</span>
                            <span className="text-white font-mono">Mail.Read, User.Read</span>
                        </div>
                     </div>
                </div>

                {/* Google Workspace */}
                <div className={`p-4 rounded-xl border transition-all ${googleConnected ? 'bg-slate-950/50 border-red-500/30' : 'bg-slate-950 border-slate-800'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                                <Globe size={18} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm">Google Workspace</h3>
                                <p className="text-xs text-slate-500">Drive & Analytics</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setGoogleConnected(!googleConnected)}
                            className={`text-xs px-3 py-1 rounded transition-colors ${googleConnected ? 'text-red-400 bg-red-500/10' : 'text-indigo-400 bg-indigo-500/10'}`}
                        >
                            {googleConnected ? 'Disconnect' : 'Connect'}
                        </button>
                    </div>
                </div>

             </div>
        </section>

        {/* GitHub Integration & Security */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
           <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gray-700/20 rounded-lg">
                    <Github className="text-gray-300" size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">GitHub CI/CD & Security</h2>
                    <p className="text-sm text-slate-400">Sync repository issues, automate deployments, and manage vulnerability alerts.</p>
                </div>
           </div>
           
           <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-medium text-slate-400 mb-1 block">Personal Access Token</label>
                        <input 
                            type="password"
                            value={ghToken}
                            onChange={(e) => setGhToken(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white font-mono focus:border-white/50 outline-none"
                            placeholder="ghp_..."
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-400 mb-1 block">Repository (owner/repo)</label>
                        <input 
                            type="text"
                            value={ghRepo}
                            onChange={(e) => setGhRepo(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white font-mono focus:border-white/50 outline-none"
                            placeholder="GrAxOS/gratech-truth-engine"
                        />
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <button 
                        onClick={handleGithubSync}
                        disabled={isSyncing}
                        className={`flex items-center gap-2 px-4 py-2 bg-white text-gray-900 text-sm font-bold rounded-lg transition-colors shadow-lg hover:bg-gray-100 ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSyncing ? <Loader2 className="animate-spin" size={16}/> : <Download size={16} />}
                        {isSyncing ? 'Syncing...' : 'Sync Repository Data'}
                    </button>
                    <div className="flex-1 text-right">
                         <span className={`text-xs font-mono font-medium ${syncStatus.includes('Failed') ? 'text-red-400' : 'text-emerald-400'}`}>
                             {syncStatus}
                         </span>
                    </div>
                </div>
           </div>
        </section>

        {/* Neural Routing & Backend */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative">
           <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Network className="text-orange-400" size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Neural Routing & Backend</h2>
                    <p className="text-sm text-slate-400">Configure connection to local inference engine or Python Backend.</p>
                </div>
           </div>
           
           <div className="mb-6 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            Route via Sovereign Backend
                            {useBackendProxy && <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded border border-emerald-500/20 uppercase">Active</span>}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">Proxy all LLM requests through the local Python FastAPI service (port 8000) instead of direct browser calls.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={useBackendProxy} 
                            onChange={(e) => setUseBackendProxy(e.target.checked)} 
                            className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                    </label>
                </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">Local API Endpoint</label>
                    <input 
                        type="text"
                        value={localLlmEndpoint}
                        onChange={(e) => setLocalLlmEndpoint(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white font-mono focus:border-orange-500/50 outline-none"
                        placeholder="http://localhost:8000/api/v1/chat"
                    />
                </div>
                <div>
                    <label className="text-xs font-medium text-slate-400 mb-1 block">Default Model</label>
                    <input 
                        type="text"
                        value={localLlmModel}
                        onChange={(e) => setLocalLlmModel(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white font-mono focus:border-orange-500/50 outline-none"
                        placeholder="gpt-4o"
                    />
                </div>
           </div>
           
           <div className="mt-4 flex items-center gap-4">
                <button 
                    onClick={handleTestLocalConnection}
                    disabled={isTestingLocal || !localLlmEndpoint}
                    className={`flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors border border-slate-700 ${isTestingLocal ? 'opacity-50 cursor-wait' : ''}`}
                >
                    {isTestingLocal ? <Loader2 size={14} className="animate-spin"/> : <Activity size={14} />}
                    Test Connection
                </button>
                {localTestStatus && (
                    <span className={`text-xs font-mono ${localTestStatus.includes('Success') ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {localTestStatus}
                    </span>
                )}
           </div>
        </section>

        {/* Azure Connection Settings (Specific to User) */}
        <section className={`bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden transition-opacity ${useBackendProxy ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
             <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-violet-500"></div>
             {useBackendProxy && (
                 <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center backdrop-blur-[1px]">
                     <div className="bg-slate-900 border border-orange-500/30 px-4 py-2 rounded-lg text-orange-400 text-xs font-bold shadow-lg">
                         Managed via Sovereign Backend Proxy
                     </div>
                 </div>
             )}
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                    <Cloud className="text-indigo-400" size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Direct Cloud Resources</h2>
                    <p className="text-sm text-slate-400">Configure direct browser connection to AI Arsenal resources (Disabled when Proxy Active).</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* GPT-4.1 Resource */}
                <div className="space-y-2 md:col-span-2 border-b border-slate-800 pb-6 mb-2">
                    <div className="flex items-center gap-2 mb-2">
                        <Cpu size={14} className="text-emerald-400" />
                        <h3 className="text-sm font-bold text-emerald-400">Primary Core: gratech-openai (Azure)</h3>
                    </div>
                    <label className="text-xs font-medium text-slate-400">Endpoint (GPT-4.1 / GPT-4o)</label>
                    <input 
                        type="text" 
                        value={gptEndpoint}
                        onChange={(e) => setGptEndpoint(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-indigo-300 font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                         <div>
                            <label className="text-xs font-medium text-slate-400 block mb-1">OpenAI / Azure API Key</label>
                            <input 
                                type="password" 
                                value={openaiKey}
                                onChange={(e) => setOpenaiKey(e.target.value)}
                                placeholder="sk-..."
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-emerald-400 font-mono focus:border-emerald-500 outline-none transition-colors"
                            />
                         </div>
                         <div>
                            <label className="text-xs font-medium text-slate-400 block mb-1">Azure Deployment Name</label>
                            <input 
                                type="text" 
                                value={azureDeployment}
                                onChange={(e) => setAzureDeployment(e.target.value)}
                                placeholder="gpt-4"
                                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-emerald-400 font-mono focus:border-emerald-500 outline-none transition-colors"
                            />
                         </div>
                    </div>
                </div>

                {/* Google Gemini API Key */}
                <div className="space-y-2 md:col-span-2 border-b border-slate-800 pb-6 mb-2">
                    <div className="flex items-center gap-2 mb-2">
                        <Key size={14} className="text-yellow-400" />
                        <h3 className="text-sm font-bold text-yellow-400">Google Gemini API Key</h3>
                    </div>
                    <label className="text-xs font-medium text-slate-400">API Key for Gemini Models</label>
                    <input 
                        type="password" 
                        value={geminiApiKey}
                        onChange={(e) => setGeminiApiKey(e.target.value)}
                        placeholder="AIza..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-yellow-400 font-mono focus:ring-1 focus:ring-yellow-500 outline-none"
                    />
                </div>


                {/* DeepSeek Resource */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                        <Brain size={14} className="text-rose-400" />
                        <h3 className="text-sm font-bold text-rose-400">Reasoning: gratechagent-1 (Azure)</h3>
                    </div>
                    <label className="text-xs font-medium text-slate-400">Endpoint</label>
                    <input 
                        type="text" 
                        value={deepseekEndpoint}
                        onChange={(e) => setDeepseekEndpoint(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-indigo-300 font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                     <label className="text-xs font-medium text-slate-400 mt-2 block">DeepSeek API Key</label>
                    <input 
                        type="password" 
                        value={deepseekKey}
                        onChange={(e) => setDeepseekKey(e.target.value)}
                        placeholder="sk-..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-rose-400 font-mono focus:border-rose-500 outline-none transition-colors"
                    />
                </div>

                {/* Claude Resource */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className="text-fuchsia-400" />
                        <h3 className="text-sm font-bold text-fuchsia-400">Creative: admin-1533 (Azure)</h3>
                    </div>
                    <label className="text-xs font-medium text-slate-400">Endpoint</label>
                    <input 
                        type="text" 
                        value={claudeEndpoint}
                        onChange={(e) => setClaudeEndpoint(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-indigo-300 font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                     <label className="text-xs font-medium text-slate-400 mt-2 block">Claude API Key</label>
                    <input 
                        type="password" 
                        value={claudeKey}
                        onChange={(e) => setClaudeKey(e.target.value)}
                        placeholder="sk-..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-fuchsia-400 font-mono focus:border-fuchsia-500 outline-none transition-colors"
                    />
                </div>
             </div>
        </section>
      </div>
    </div>
  );
};

