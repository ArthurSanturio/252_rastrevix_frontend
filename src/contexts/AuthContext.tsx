import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { apiService, type LoginCredentials, type RegisterData } from '../services/api';

interface User {
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
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = async () => {
      const accessToken = apiService.getAccessToken();
      const refreshToken = apiService.getRefreshToken();
      
      if (accessToken && !apiService.isTokenExpired(accessToken)) {
        try {
          const response = await apiService.getCurrentUser();
          setIsAuthenticated(true);
          setUser(response.data.user);
        } catch (error) {
          console.error('Error validating token:', error);
          // Try to refresh token if we have one
          if (refreshToken) {
            try {
              const refreshResponse = await apiService.refreshToken(refreshToken);
              apiService.setTokens(refreshResponse.data.accessToken, refreshResponse.data.refreshToken);
              setIsAuthenticated(true);
              setUser(refreshResponse.data.user);
            } catch (refreshError) {
              console.error('Error refreshing token:', refreshError);
              apiService.clearTokens();
              setIsAuthenticated(false);
              setUser(null);
            }
          } else {
            apiService.clearTokens();
            setIsAuthenticated(false);
            setUser(null);
          }
        }
      } else if (refreshToken) {
        // Access token expired but we have refresh token
        try {
          const refreshResponse = await apiService.refreshToken(refreshToken);
          apiService.setTokens(refreshResponse.data.accessToken, refreshResponse.data.refreshToken);
          setIsAuthenticated(true);
          setUser(refreshResponse.data.user);
        } catch (error) {
          console.error('Error refreshing token:', error);
          apiService.clearTokens();
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        // No tokens available
        apiService.clearTokens();
        setIsAuthenticated(false);
        setUser(null);
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.login(credentials);
      
      // Store tokens
      apiService.setTokens(response.data.accessToken, response.data.refreshToken);
      
      // Update state
      setIsAuthenticated(true);
      setUser(response.data.user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no login';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.register(data);
      
      // Store tokens
      apiService.setTokens(response.data.accessToken, response.data.refreshToken);
      
      // Update state
      setIsAuthenticated(true);
      setUser(response.data.user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no registro';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = apiService.getRefreshToken();
      if (refreshToken) {
        await apiService.logout(refreshToken);
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Clear tokens and state regardless of API call success
      apiService.clearTokens();
      setIsAuthenticated(false);
      setUser(null);
      setError(null);
    }
  };

  const value = {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
