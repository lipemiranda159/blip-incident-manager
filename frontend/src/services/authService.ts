import { HttpClient } from './httpClient';
import { LoginRequest, RegisterUserRequest, ApiResponse } from './types';

export class AuthService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Authenticate user with email and password
   * @param loginData - User login credentials
   * @returns Promise with authentication response
   */
  public async login(loginData: LoginRequest): Promise<ApiResponse<any>> {
    try {
      const response = await this.httpClient.post<any>('/api/Auth/login', loginData);
      
      // If login is successful and returns a token, store it
      if (response.data && response.data.token) {
        this.httpClient.setToken(response.data.token);
      }
      
      return response;
    } catch (error) {
      throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Register a new user
   * @param registerData - User registration data
   * @returns Promise with registration response
   */
  public async register(registerData: RegisterUserRequest): Promise<ApiResponse<any>> {
    try {
      const response = await this.httpClient.post<any>('/api/Auth/register', registerData);
      return response;
    } catch (error) {
      throw new Error(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Logout user by clearing stored token
   */
  public logout(): void {
    this.httpClient.clearToken();
  }

  /**
   * Check if user is currently authenticated
   * @returns boolean indicating authentication status
   */
  public isAuthenticated(): boolean {
    return localStorage.getItem('authToken') !== null;
  }
}
