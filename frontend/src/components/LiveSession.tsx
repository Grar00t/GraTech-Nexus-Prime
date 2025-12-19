import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Zap, Loader2, AlertTriangle, Shield } from 'lucide-react';
import { connectLive } from '../services/geminiService';
import { audioService } from '../services/audioService';
import { LiveServerMessage } from '@google/genai';

type SessionStatus = 'DISCONNECTED' | 'CONNECTING' | 'LISTENING' | 'SPEAKING' | 'ERROR';

export const LiveSession: React.FC = () => {
    const [status, setStatus] = useState<SessionStatus>('DISCONNECTED');
    const [transcript, setTranscript] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    // Fix: Use number for setTimeout return type in browser environment
    const speakingTimeoutRef = useRef<number | null>(null);

    const handleMessage = (message: LiveServerMessage) => {
        if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
            setStatus('SPEAKING');
            if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
            speakingTimeoutRef.current = window.setTimeout(() => setStatus('LISTENING'), 3000); // Revert to listening after a pause
            audioService.playAudio(message.serverContent.modelTurn.parts[0].inlineData.data);
        }
        if (message.serverContent?.interrupted) {
            audioService.interruptPlayback();
        }
    };

    const handleToggleSession = async () => {
        if (status === 'DISCONNECTED' || status === 'ERROR') {
            setStatus('CONNECTING');
            setErrorMessage('');
            
            const sessionPromise = connectLive({
                onOpen: () => {
                    setStatus('LISTENING');
                    audioService.startMicrophone(blob => {
                        sessionPromiseRef.current?.then(session => {
                            session.sendRealtimeInput({ media: blob });
                        });
                    });
                },
                onMessage: handleMessage,
                onError: (e) => {
                    console.error('Live session error:', e);
                    setStatus('ERROR');
                    setErrorMessage('Connection failed. Please check console.');
                    audioService.stopMicrophone();
                },
                onClose: () => {
                    setStatus('DISCONNECTED');
                    audioService.stopMicrophone();
                }
            });
            sessionPromiseRef.current = sessionPromise;

        } else {
            sessionPromiseRef.current?.then(session => session.close());
            sessionPromiseRef.current = null;
            audioService.stopMicrophone();
            setStatus('DISCONNECTED');
        }
    };

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            sessionPromiseRef.current?.then(session => session.close());
            audioService.stopMicrophone();
        };
    }, []);

    const getStatusInfo = () => {
        switch (status) {
            case 'CONNECTING': return { text: 'Initializing Neural Link...', color: 'text-amber-400', icon: <Loader2 className="animate-spin" /> };
            case 'LISTENING': return { text: 'Listening...', color: 'text-emerald-400', icon: <Mic /> };
            case 'SPEAKING': return { text: 'Nexus Speaking...', color: 'text-indigo-400', icon: <Zap className="animate-pulse" /> };
            case 'ERROR': return { text: errorMessage, color: 'text-red-400', icon: <AlertTriangle /> };
            default: return { text: 'Ready to Connect', color: 'text-slate-400', icon: <MicOff /> };
        }
    };
    const statusInfo = getStatusInfo();

    return (
        <div className="flex flex-col h-full items-center justify-center bg-slate-950 p-8 text-white">
            <div className={`w-48 h-48 rounded-full border-8 flex items-center justify-center transition-all duration-300 ${
                status === 'LISTENING' ? 'border-emerald-500/50 scale-105' :
                status === 'SPEAKING' ? 'border-indigo-500/50 scale-110' :
                'border-slate-800'
            }`}>
                 <button
                    onClick={handleToggleSession}
                    className={`w-36 h-36 rounded-full flex items-center justify-center transition-all duration-300 ${
                        status === 'DISCONNECTED' || status === 'ERROR' ? 'bg-indigo-600 hover:bg-indigo-500' :
                        'bg-rose-600 hover:bg-rose-500'
                    }`}
                 >
                    {status === 'DISCONNECTED' || status === 'ERROR' ? <Mic size={48} /> : <MicOff size={48} />}
                </button>
            </div>

            <div className="mt-8 text-center">
                <div className={`flex items-center justify-center gap-2 text-xl font-bold ${statusInfo.color}`}>
                    {statusInfo.icon}
                    <h2>{statusInfo.text}</h2>
                </div>
                <p className="text-sm text-slate-500 mt-2">
                    {status !== 'DISCONNECTED' ? 'Click the icon to end the session.' : 'Click the icon to start a real-time conversation.'}
                </p>
            </div>
            
            <div className="absolute bottom-6 text-xs text-slate-600 font-mono flex items-center gap-2">
                <Shield size={12} /> Live Audio via Gemini 2.5 Flash Native
            </div>
        </div>
    );
};
