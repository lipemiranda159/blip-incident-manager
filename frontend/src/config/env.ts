// Environment configuration
interface EnvConfig {
  API_BASE_URL: string;
  API_TIMEOUT: number;
  NODE_ENV: string;
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
}

// Get environment variable with fallback
const getEnvVar = (key: string, defaultValue: string): string => {
  return import.meta.env[key] || defaultValue;
};

// Environment configuration object
export const env: EnvConfig = {
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL', 'http://localhost:5000'),
  API_TIMEOUT: parseInt(getEnvVar('VITE_API_TIMEOUT', '10000'), 10),
  NODE_ENV: getEnvVar('VITE_NODE_ENV', 'development'),
  IS_DEVELOPMENT: getEnvVar('VITE_NODE_ENV', 'development') === 'development',
  IS_PRODUCTION: getEnvVar('VITE_NODE_ENV', 'development') === 'production',
};

// Validate required environment variables
const validateEnv = () => {
  const requiredVars = ['API_BASE_URL'];
  const missing = requiredVars.filter(key => !env[key as keyof EnvConfig]);
  
  if (missing.length > 0) {
    console.warn(`Missing environment variables: ${missing.join(', ')}`);
    console.warn('Using default values. Please check your .env file.');
  }
};

// Run validation
validateEnv();

// Export individual values for convenience
export const {
  API_BASE_URL,
  API_TIMEOUT,
  NODE_ENV,
  IS_DEVELOPMENT,
  IS_PRODUCTION
} = env;

export default env;
