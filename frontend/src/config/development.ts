// Development-specific configuration
import { env } from './env';

export const developmentConfig = {
  // API Configuration
  apiBaseUrl: env.API_BASE_URL,
  apiTimeout: env.API_TIMEOUT,
  
  // Debug settings
  enableDebugLogs: env.IS_DEVELOPMENT,
  enableNetworkLogs: env.IS_DEVELOPMENT,
  
  // CORS settings for development
  corsEnabled: true,
  allowedOrigins: [
    'http://localhost:5173', // Vite default
    'http://localhost:3000', // React default
    'http://localhost:4173', // Vite preview
  ],
  
  // Mock data fallback (if API is not available)
  useMockDataFallback: false,
  
  // Authentication settings
  tokenStorageKey: 'authToken',
  userStorageKey: 'user',
  
  // Default test credentials (for development only)
  testCredentials: {
    solicitante: {
      email: 'joao@empresa.com',
      password: '123456'
    },
    atendente: {
      email: 'maria@empresa.com', 
      password: '123456'
    }
  }
};

// Development utilities
export const devUtils = {
  log: (message: string, data?: any) => {
    if (developmentConfig.enableDebugLogs) {
      console.log(`[DEV] ${message}`, data || '');
    }
  },
  
  logNetworkRequest: (method: string, url: string, data?: any) => {
    if (developmentConfig.enableNetworkLogs) {
      console.log(`[NETWORK] ${method} ${url}`, data || '');
    }
  },
  
  logNetworkResponse: (method: string, url: string, status: number, data?: any) => {
    if (developmentConfig.enableNetworkLogs) {
      console.log(`[NETWORK] ${method} ${url} - ${status}`, data || '');
    }
  }
};

export default developmentConfig;
