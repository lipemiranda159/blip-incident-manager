import { useState, useEffect } from 'react';
import { type Incident, type Filter } from '../types';
import { apiClient, type IncidentDto, type CreateIncidentRequest, type UpdateIncidentRequest } from '../services';
import { useIncidentFiltering } from './useIncidentFiltering';



// Helper function to map API incident to local Incident type
const mapApiIncidentToIncident = (apiIncident: IncidentDto): Incident => {
  return {
    id: apiIncident.id,
    title: apiIncident.title || '',
    description: apiIncident.description || '',
    status: (apiIncident.status as Incident['status']) || 'open',
    priority: (apiIncident.priority as Incident['priority']) || 'medium',
    category: 'General', // Default category since API doesn't return this field
    createdAt: new Date(apiIncident.createdAt),
    updatedAt: new Date(apiIncident.updatedAt),
    createdBy: {
      id: apiIncident.createdBy.id,
      name: apiIncident.createdBy.name || 'Usuário',
      email: apiIncident.createdBy.email || '',
      type: (apiIncident.createdBy.type as 'solicitante' | 'atendente') || 'solicitante',
      avatar: apiIncident.createdBy.avatar || ''
    },
    assignedTo: apiIncident.assignedTo ? {
      id: apiIncident.assignedTo.id,
      name: apiIncident.assignedTo.name || 'Usuário',
      email: apiIncident.assignedTo.email || '',
      type: (apiIncident.assignedTo.type as 'solicitante' | 'atendente') || 'atendente',
      avatar: apiIncident.assignedTo.avatar || ''
    } : undefined,
    comments: apiIncident.comments?.map(comment => ({
      id: comment.id,
      content: comment.content || '',
      createdAt: comment.createdAt,
      author: {
        id: comment.author.id,
        name: comment.author.name || 'Usuário',
        email: comment.author.email || '',
        type: (comment.author.type as 'solicitante' | 'atendente') || 'solicitante',
        avatar: comment.author.avatar || ''
      }
    })) || []
  };
};

export const useIncidents = () => {
  const [allIncidents, setAllIncidents] = useState<Incident[]>([]);
  const [filters, setFilters] = useState<Filter>({});
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const itemsPerPage = 10;

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setInitialLoading(true);
      try {
        const response = await apiClient.incidents.getIncidents({
          pageNumber: 1,
          pageSize: itemsPerPage
        });
        
        if (response.data && response.data.items) {
          const mappedIncidents = response.data.items.map(mapApiIncidentToIncident);
          setAllIncidents(mappedIncidents);
          setCurrentPage(response.data.currentPage);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error('Failed to load incidents:', error);
        setAllIncidents([]);
      } finally {
        setInitialLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Filter incidents based on current filters
  const filteredIncidents = useIncidentFiltering(allIncidents, filters);

  // Load specific page from API
  const loadPage = async (page: number, pageSize: number = itemsPerPage) => {
    setInitialLoading(true);
    try {
      const response = await apiClient.incidents.getIncidents({
        pageNumber: page,
        pageSize: pageSize
      });
      
      if (response.data && response.data.items) {
        const incidents = response.data.items.map(mapApiIncidentToIncident);
        setAllIncidents(incidents); // Replace all incidents with current page
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
        // Note: itemsPerPage is updated via the pageSize parameter
      }
    } catch (error) {
      console.error('Failed to load page:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      loadPage(page);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    if (newItemsPerPage !== itemsPerPage) {
      loadPage(1, newItemsPerPage); // Reset to first page with new page size
    }
  };
  
  // Note: loading state is now returned directly as initialLoading

  const createIncident = async (data: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    setInitialLoading(true);
    try {
      const createRequest: CreateIncidentRequest = {
        title: data.title,
        description: data.description,
        priority: data.priority,
        category: 'General', // Default category
      };
      
      const response = await apiClient.incidents.createIncident(createRequest);
      
      if (response.data) {
        const newIncident = mapApiIncidentToIncident(response.data);
        setAllIncidents((prev) => [newIncident, ...prev]);
        return newIncident;
      }
      throw new Error('No data received from API');
    } catch (error) {
      console.error('Failed to create incident:', error);
      throw error;
    } finally {
      setInitialLoading(false);
    }
  };

  const updateIncident = async (id: string, updates: Partial<Incident>) => {
    setInitialLoading(true);
    try {
      const updateRequest: UpdateIncidentRequest = {
        title: updates.title,
        description: updates.description,
        status: updates.status,
        priority: updates.priority,
        assignedUserId: updates.assignedTo?.id
      };
      
      const response = await apiClient.incidents.updateIncident(id, updateRequest);
      
      if (response.data) {
        const updatedIncident = mapApiIncidentToIncident(response.data);
        setAllIncidents(prev =>
          prev.map(incident =>
            incident.id === id ? updatedIncident : incident
          )
        );
      }
    } catch (error) {
      console.error('Failed to update incident:', error);
      throw error;
    } finally {
      setInitialLoading(false);
    }
  };

  const addComment = async (incidentId: string, content: string) => {
    try {
      const response = await apiClient.incidents.addComment(incidentId, { content });
      
      if (response.data) {
        const newComment = {
          id: response.data.id,
          content: response.data.content || '',
          createdAt: response.data.createdAt,
          author: {
            id: response.data.author.id,
            name: response.data.author.name || 'Usuário',
            email: response.data.author.email || '',
            type: (response.data.author.type as 'solicitante' | 'atendente') || 'solicitante',
            avatar: response.data.author.avatar || ''
          }
        };

        setAllIncidents(prev =>
          prev.map(incident =>
            incident.id === incidentId
              ? {
                  ...incident,
                  comments: [...incident.comments, newComment],
                  updatedAt: new Date()
                }
              : incident
          )
        );
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
      throw error;
    }
  };

  const getIncidentById = async (id: string): Promise<IncidentDto | null> => {
    const response = await apiClient.incidents.getIncidentById(id);
    return response.data;
  };

  const refreshIncidents = async () => {
    try {
      const response = await apiClient.incidents.getIncidents({
        pageNumber: 1,
        pageSize: itemsPerPage
      });
      
      if (response.data && response.data.items) {
        const mappedIncidents = response.data.items.map(mapApiIncidentToIncident);
        setAllIncidents(mappedIncidents);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Failed to refresh incidents:', error);
    }
  };

  return {
    incidents: filteredIncidents,
    loading: initialLoading,
    filters,
    setFilters,
    createIncident,
    updateIncident,
    addComment,
    getIncidentById,
    currentPage,
    totalPages,
    totalItems: filteredIncidents.length, // Note: This should ideally come from API response
    itemsPerPage,
    onPageChange: handlePageChange,
    onItemsPerPageChange: handleItemsPerPageChange,
    refreshIncidents
  };
};
