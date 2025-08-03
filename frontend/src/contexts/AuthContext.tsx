import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { apiClient } from '../services';

// Types
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

// Actions
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_SESSION'; payload: User }
  | { type: 'CLEAR_ERROR' };

// Helper function to map API user data to local User type
const mapApiUserToUser = (apiUser: any): User => {
  return {
    id: apiUser.id || apiUser.userId || '1',
    name: apiUser.unique_name || apiUser.userName || 'Usuário',
    email: apiUser.email || '',
    type: apiUser.type || 'solicitante',
    avatar: apiUser.avatar || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  };
};

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'RESTORE_SESSION':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore session on app load
  useEffect(() => {
    const restoreSession = () => {
      const authToken = localStorage.getItem('authToken');
      const savedUser = localStorage.getItem('user');
      
      if (authToken && savedUser) {
        try {
          const user = JSON.parse(savedUser);
          
          // Set token in API client for subsequent requests
          apiClient.setAuthToken(authToken);
          
          dispatch({ type: 'RESTORE_SESSION', payload: user });
        } catch (error) {
          // Clear corrupted data
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          apiClient.clearAuthToken();
          console.error('Failed to restore session:', error);
        }
      }
    };

    restoreSession();
  }, []);

  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
  
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('Token inválido', e);
      return null;
    }
  }

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await apiClient.auth.login({ email, password });
      
      if (response.status === 200 && response.data) {
        // Extract token from response (should be in response.data.token based on new Swagger)
        const token = response.data.token || response.data.accessToken;
        
        if (!token) {
          console.warn('No token received from login response:', response.data);
          dispatch({ type: 'LOGIN_FAILURE', payload: 'Token de autenticação não recebido' });
          return false;
        }

        // Map API response to User type
        const jwtData = parseJwt(token);
        const user = mapApiUserToUser(jwtData);
        
        // Store user data and token in localStorage for session persistence
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('authToken', token);
        
        // Set token in API client for subsequent requests
        apiClient.setAuthToken(token);
        
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
        return true;
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: 'Credenciais inválidas' });
        return false;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return false;
    }
  };

  // Logout function
  const logout = () => {
    // Clear all authentication data
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    apiClient.clearAuthToken();
    
    dispatch({ type: 'LOGOUT' });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
};

// Export context for testing purposes
export { AuthContext };
