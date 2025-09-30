// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://two52-rastrevix-backend.onrender.com/api',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
} as const;

// Environment variables
export const ENV = {
  NODE_ENV: import.meta.env.MODE,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
} as const;
