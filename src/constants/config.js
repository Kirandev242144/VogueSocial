// Application Configuration & Mode Switcher
export const APP_CONFIG = {
  // 'mock': 100% standalone frontend with LocalStorage persistence and seed constants
  // 'api': Connects to client's future real backend via REST API
  DATA_SOURCE: import.meta.env.VITE_DATA_SOURCE || 'mock',
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  SIMULATED_NETWORK_DELAY_MS: 120, // realistic smooth feedback for loading states
};

export const IS_MOCK_MODE = APP_CONFIG.DATA_SOURCE === 'mock';
