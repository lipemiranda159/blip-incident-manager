import { HttpClient } from './httpClient';
import type { 
  IncidentDto, 
  IncidentDtoPagedResult, 
  IncidentSummaryDto,
  CreateIncidentRequest, 
  UpdateIncidentRequest,
  CreateCommentRequest,
  CommentDto,
  PaginationParams,
  ApiResponse 
} from './types';

export class IncidentsService {
  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  /**
   * Get paginated list of incidents
   * @param params - Pagination parameters
   * @returns Promise with paginated incidents
   */
  public async getIncidents(params?: PaginationParams): Promise<ApiResponse<IncidentDtoPagedResult>> {
    try {
      const queryParams = {
        pageNumber: params?.pageNumber || 1,
        pageSize: params?.pageSize || 10,
      };
      
      return await this.httpClient.get<IncidentDtoPagedResult>('/api/Incidents', queryParams);
    } catch (error) {
      throw new Error(`Failed to fetch incidents: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get a specific incident by ID
   * @param id - Incident UUID
   * @returns Promise with incident details
   */
  public async getIncidentById(id: string): Promise<ApiResponse<IncidentDto>> {
    try {
      return await this.httpClient.get<IncidentDto>(`/api/Incidents/${id}`);
    } catch (error) {
      throw new Error(`Failed to fetch incident: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new incident
   * @param incidentData - Incident creation data
   * @returns Promise with created incident
   */
  public async createIncident(incidentData: CreateIncidentRequest): Promise<ApiResponse<IncidentDto>> {
    try {
      return await this.httpClient.post<IncidentDto>('/api/Incidents', incidentData);
    } catch (error) {
      throw new Error(`Failed to create incident: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update an existing incident
   * @param id - Incident UUID
   * @param updateData - Incident update data
   * @returns Promise with updated incident
   */
  public async updateIncident(id: string, updateData: UpdateIncidentRequest): Promise<ApiResponse<IncidentDto>> {
    try {
      return await this.httpClient.patch<IncidentDto>(`/api/Incidents/${id}`, updateData);
    } catch (error) {
      throw new Error(`Failed to update incident: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete an incident
   * @param id - Incident UUID
   * @returns Promise with deletion response
   */
  public async deleteIncident(id: string): Promise<ApiResponse<any>> {
    try {
      return await this.httpClient.delete<any>(`/api/Incidents/${id}`);
    } catch (error) {
      throw new Error(`Failed to delete incident: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get incident summary
   * @param id - Incident UUID
   * @returns Promise with incident summary
   */
  public async getIncidentSummary(id: string): Promise<ApiResponse<IncidentSummaryDto>> {
    try {
      return await this.httpClient.get<IncidentSummaryDto>(`/api/Incidents/${id}/summary`);
    } catch (error) {
      throw new Error(`Failed to fetch incident summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Add a comment to an incident
   * @param incidentId - Incident UUID
   * @param commentData - Comment creation data
   * @returns Promise with created comment
   */
  public async addComment(incidentId: string, commentData: CreateCommentRequest): Promise<ApiResponse<CommentDto>> {
    try {
      return await this.httpClient.post<CommentDto>(`/api/Incidents/${incidentId}/comments`, commentData);
    } catch (error) {
      throw new Error(`Failed to add comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Delete a comment
   * @param commentId - Comment UUID
   * @returns Promise with deletion response
   */
  public async deleteComment(commentId: string): Promise<ApiResponse<CommentDto>> {
    try {
      return await this.httpClient.delete<CommentDto>(`/api/Incidents/${commentId}/comments`);
    } catch (error) {
      throw new Error(`Failed to delete comment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
