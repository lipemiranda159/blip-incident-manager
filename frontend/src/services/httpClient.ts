import type { ApiResponse } from './types';
import { API_BASE_URL, API_TIMEOUT } from '../config/env';
import { devUtils } from '../config/development';

export class HttpClient {
  private baseURL: string;
  private token: string | null = null;
  private timeout: number;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || API_BASE_URL;
    this.timeout = API_TIMEOUT;
    this.loadTokenFromStorage();
  }

  private loadTokenFromStorage(): void {
    this.token = localStorage.getItem('authToken');
  }

  public setToken(token: string): void {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  public clearToken(): void {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // CORS headers
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const status = response.status;
    
    if (!response.ok) {
      let errorMessage = `HTTP Error: ${status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorData.title || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }
      
      // Handle specific HTTP status codes
      if (status === 401) {
        this.clearToken();
        errorMessage = 'Sessão expirada. Faça login novamente.';
      } else if (status === 403) {
        errorMessage = 'Acesso negado.';
      } else if (status === 404) {
        errorMessage = 'Recurso não encontrado.';
      } else if (status >= 500) {
        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
      }
      
      throw new Error(errorMessage);
    }

    let data: T;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text() as unknown as T;
    }

    return {
      data,
      status,
    };
  }

  private async makeRequest<T>(url: string, options: RequestInit): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    // Log request in development
    devUtils.logNetworkRequest(options.method || 'GET', url, options.body);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        mode: 'cors', // Enable CORS
        credentials: 'omit', // Don't send cookies
      });
      
      clearTimeout(timeoutId);
      const result = await this.handleResponse<T>(response);
      
      // Log response in development
      devUtils.logNetworkResponse(options.method || 'GET', url, response.status, result.data);
      
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Log error in development
      devUtils.log('Network request failed', { url, error: error instanceof Error ? error.message : error });
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Tempo limite da requisição excedido');
        }
        throw error;
      }
      
      throw new Error('Erro de conexão com o servidor');
    }
  }

  public async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = `${this.baseURL}${endpoint}`;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
      if (searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
    }

    return this.makeRequest<T>(url, {
      method: 'GET',
      headers: this.getHeaders(),
    });
  }

  public async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
  }
}
