import { HttpClient } from './httpClient';
import { AuthService } from './authService';
import { IncidentsService } from './incidentsService';

/**
 * Main API Client for Incident Manager
 * Provides a centralized interface for all API operations
 */
export class ApiClient {
  private httpClient: HttpClient;
  public auth: AuthService;
  public incidents: IncidentsService;

  constructor(baseURL?: string) {
    this.httpClient = new HttpClient(baseURL);
    this.auth = new AuthService(this.httpClient);
    this.incidents = new IncidentsService(this.httpClient);
  }

  /**
   * Set the base URL for API requests
   * @param baseURL - The base URL for the API
   */
  public setBaseURL(baseURL: string): void {
    this.httpClient = new HttpClient(baseURL);
    this.auth = new AuthService(this.httpClient);
    this.incidents = new IncidentsService(this.httpClient);
  }

  /**
   * Set authentication token
   * @param token - JWT token for authentication
   */
  public setAuthToken(token: string): void {
    this.httpClient.setToken(token);
  }

  /**
   * Clear authentication token
   */
  public clearAuthToken(): void {
    this.httpClient.clearToken();
  }

  /**
   * Check if user is authenticated
   * @returns boolean indicating authentication status
   */
  public isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }
}

// Create and export a default instance
export const apiClient = new ApiClient();

// Export individual services for direct use if needed
export { AuthService } from './authService';
export { IncidentsService } from './incidentsService';
export { HttpClient } from './httpClient';

// Export all types
export * from './types';
