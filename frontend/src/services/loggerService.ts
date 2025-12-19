export const logger = {
  info: (message: string, context?: string, data?: any) => {
    console.log(`[INFO] [${context || 'App'}] ${message}`, data || '');
  },
  warn: (message: string, context?: string, data?: any) => {
    console.warn(`[WARN] [${context || 'App'}] ${message}`, data || '');
  },
  error: (message: string, context?: string, error?: any) => {
    console.error(`[ERROR] [${context || 'App'}] ${message}`, error || '');
  }
};
