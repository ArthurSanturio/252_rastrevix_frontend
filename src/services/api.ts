const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  company?: string;
  position?: string;
  department?: string;
}

export interface AuthResponse {
  message: string;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      status: string;
      phone?: string;
      company?: string;
      position?: string;
      department?: string;
      createdAt: string;
      updatedAt: string;
    };
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export interface ApiError {
  error: string;
  code: string;
  details?: any;
}

// Debug logging for development
const DEBUG = import.meta.env.DEV;

const log = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`[API Service] ${message}`, data || '');
  }
};

class ApiService {
  private baseURL: string;
  private retryAttempts: number = 3;
  private retryDelay: number = 1000; // 1 second

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    log('API Service initialized', { baseURL });
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if token exists
    const token = localStorage.getItem('accessToken');
    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    log(`Making request to ${endpoint}`, {
      method: options.method || 'GET',
      retryCount,
      hasToken: !!token
    });

    try {
      const response = await fetch(url, config);

      log(`Response received`, {
        status: response.status,
        ok: response.ok,
        endpoint
      });

      if (!response.ok) {
        let errorData: ApiError;
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            error: `HTTP ${response.status}: ${response.statusText}`,
            code: response.status.toString()
          };
        }

        // Retry on server errors (5xx) or network issues
        if (retryCount < this.retryAttempts &&
          (response.status >= 500 || response.status === 0)) {
          log(`Retrying request (${retryCount + 1}/${this.retryAttempts})`, {
            endpoint,
            status: response.status
          });

          await this.delay(this.retryDelay * (retryCount + 1));
          return this.request<T>(endpoint, options, retryCount + 1);
        }

        throw new Error(errorData.error || `Erro na requisição: ${response.status}`);
      }

      const data = await response.json();
      log(`Request successful`, { endpoint });
      return data;
    } catch (error) {
      log(`Request failed`, { endpoint, error: error instanceof Error ? error.message : 'Unknown error' });

      // Retry on network errors
      if (retryCount < this.retryAttempts &&
        error instanceof Error &&
        (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
        log(`Retrying request due to network error (${retryCount + 1}/${this.retryAttempts})`, { endpoint });

        await this.delay(this.retryDelay * (retryCount + 1));
        return this.request<T>(endpoint, options, retryCount + 1);
      }

      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de conexão com o servidor');
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async logout(refreshToken?: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async getCurrentUser(): Promise<{ message: string; data: { user: any } }> {
    return this.request<{ message: string; data: { user: any } }>('/auth/me');
  }

  // Token management
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Check if token is expired (basic check)
  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }

  // Test connection to backend
  async testConnection(): Promise<boolean> {
    try {
      log('Testing connection to backend');
      // Remove /api from baseURL for health check
      const healthUrl = this.baseURL.replace('/api', '') + '/health';
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const isConnected = response.ok;
      log('Connection test result', { isConnected, status: response.status, healthUrl });
      return isConnected;
    } catch (error) {
      log('Connection test failed', { error: error instanceof Error ? error.message : 'Unknown error' });
      return false;
    }
  }

  // Get API status
  getApiStatus() {
    return {
      baseURL: this.baseURL,
      hasAccessToken: !!this.getAccessToken(),
      hasRefreshToken: !!this.getRefreshToken(),
    };
  }
}

export const apiService = new ApiService();
export default apiService;
