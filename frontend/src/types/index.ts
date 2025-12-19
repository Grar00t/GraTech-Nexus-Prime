export interface GeminiConfig {
  temperature?: number;
  maxTokens?: number;
  systemInstruction?: string;
  thinkingBudget?: number;
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  CODE = 'code'
}

export enum AppMode {
  CHAT_FAST = 'fast',
  CHAT_SMART = 'smart'
}

export interface Message {
  id: string;
  createdAt: Date;
  timestamp: Date;
  sender: 'user' | 'agent';
  role: 'user' | 'assistant';
  text: string;
  content: { text: string };
  status: 'delivered' | 'error' | 'sending';
  context?: { model: string; tokens: { prompt: number; completion: number; total: number } };
  type: MessageType;
}
