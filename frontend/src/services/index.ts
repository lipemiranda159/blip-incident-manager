// Main exports for the API client
export { apiClient, ApiClient } from './apiClient';
export { AuthService } from './authService';
export { IncidentsService } from './incidentsService';
export { HttpClient } from './httpClient';

// Export all types
export * from './types';

// Usage examples:
/*
// Basic usage with default instance
import { apiClient } from '@/services';

// Login
const loginResponse = await apiClient.auth.login({
  email: 'user@example.com',
  password: 'password123'
});

// Get incidents with pagination
const incidents = await apiClient.incidents.getIncidents({
  pageNumber: 1,
  pageSize: 10
});

// Create a new incident
const newIncident = await apiClient.incidents.createIncident({
  title: 'System Down',
  description: 'The main system is not responding',
  priority: 'High',
  category: 'Technical',
  createdBy: 'user-uuid'
});

// Update an incident
const updatedIncident = await apiClient.incidents.updateIncident('incident-uuid', {
  status: 'In Progress',
  assignedUserId: 'assignee-uuid'
});

// Add a comment
const comment = await apiClient.incidents.addComment('incident-uuid', {
  content: 'Working on this issue now'
});

// Custom instance with different base URL
import { ApiClient } from '@/services';
const customApiClient = new ApiClient('https://api.example.com');
*/
