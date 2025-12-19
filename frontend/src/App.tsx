import React, { useState } from 'react';
import { Settings } from './components/Settings';
import { LiveSession } from './components/LiveSession';
import { Settings as SettingsIcon, Mic } from 'lucide-react';

function App() {
  const [view, setView] = useState<'settings' | 'live'>('settings');

  return (
    <div className="h-screen w-screen bg-slate-950 text-white flex flex-col">
      <nav className="p-4 border-b border-slate-800 flex gap-4 bg-slate-900 items-center">
        <h1 className="text-xl font-bold mr-4 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">GraTech Nexus</h1>
        <button 
          onClick={() => setView('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${view === 'settings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
        >
          <SettingsIcon size={18} /> Settings
        </button>
        <button 
          onClick={() => setView('live')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${view === 'live' ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
        >
          <Mic size={18} /> Live Session
        </button>
      </nav>
      <main className="flex-1 overflow-hidden relative">
        {view === 'settings' ? <Settings /> : <LiveSession />}
      </main>
    </div>
  );
}

export default App;
