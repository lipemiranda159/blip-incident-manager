// API Types for Incident Manager
export interface UserDto {
  id: string;
  name: string | null;
  email: string | null;
  type: string | null;
  avatar: string | null;
}

export interface CommentDto {
  id: string;
  content: string | null;
  createdAt: string;
  authorId: string;
  author: UserDto;
  incidentId: string;
}

export interface IncidentDto {
  id: string;
  title: string | null;
  description: string | null;
  status: string | null;
  priority: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: UserDto;
  assignedTo: UserDto;
  comments: CommentDto[] | null;
}

export interface IncidentSummaryDto {
  id: string;
  title: string | null;
  summary: string | null;
}

export interface IncidentDtoPagedResult {
  currentPage: number;
  totalPages: number;
  items: IncidentDto[] | null;
}

// Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterUserRequest {
  name: string | null;
  email: string | null;
  type: string | null;
  avatar: string | null;
  password: string | null;
}

export interface CreateIncidentRequest {
  title: string | null;
  description: string | null;
  priority: string | null;
  category: string | null;
  createdBy: string;
}

export interface UpdateIncidentRequest {
  title?: string | null;
  description?: string | null;
  status?: string | null;
  priority?: string | null;
  assignedUserId?: string | null;
}

export interface CreateCommentRequest {
  content: string | null;
}

// API Response wrapper
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

// Pagination parameters
export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
}
