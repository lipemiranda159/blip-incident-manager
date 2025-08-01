import { useState, useEffect } from 'react';
import { type Incident, type Filter, type User } from '../types';
import { generateMockIncidents, createNewIncidentId } from '../utils/mockData';
import { useIncidentFiltering } from './useIncidentFiltering';
import { usePagination } from './usePagination';



export const useIncidents = () => {
  const [allIncidents, setAllIncidents] = useState<Incident[]>([]);
  const [filters, setFilters] = useState<Filter>({});
  const [initialLoading, setInitialLoading] = useState(true);
  
  const itemsPerPage = 10;

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setInitialLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setAllIncidents(generateMockIncidents());
      setInitialLoading(false);
    };
    loadInitialData();
  }, []);

  // Filter incidents based on current filters
  const filteredIncidents = useIncidentFiltering(allIncidents, filters);

  // Handle pagination of filtered incidents
  const {
    paginatedItems: incidents,
    hasMore,
    loading: paginationLoading,
    loadMore: loadMoreIncidents
  } = usePagination({
    items: filteredIncidents,
    itemsPerPage,
    resetTrigger: filters
  });

  const loading = initialLoading || paginationLoading;

  const createIncident = async (data: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    setInitialLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newIncident: Incident = {
      ...data,
      id: createNewIncidentId(allIncidents),
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: []
    };
    
    setAllIncidents((prev) => [newIncident, ...prev]);
    setInitialLoading(false);
    return newIncident;
  };

  const updateIncident = async (id: string, updates: Partial<Incident>) => {
    setInitialLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setAllIncidents(prev =>
      prev.map(incident =>
        incident.id === id
          ? { ...incident, ...updates, updatedAt: new Date() }
          : incident
      )
    );
    
    setInitialLoading(false);
  };

  const addComment = async (incidentId: string, content: string, author: User) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      author
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
  };

  const getIncidentById = (id: string): Incident | null => {
    return allIncidents.find((incident) => incident.id === id) ?? null;
  };

  return {
    incidents,
    loading,
    filters,
    setFilters,
    createIncident,
    updateIncident,
    addComment,
    getIncidentById,
    hasMore,
    loadMoreIncidents
  };
};
