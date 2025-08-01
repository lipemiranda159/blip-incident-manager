import { useMemo } from 'react';
import { type Incident, type Filter } from '../types';

export const useIncidentFiltering = (incidents: Incident[], filters: Filter) => {
  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) => {
      if (filters.status && incident.status !== filters.status) return false;
      if (filters.priority && incident.priority !== filters.priority) return false;
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = incident.title.toLowerCase().includes(searchLower);
        const matchesDescription = incident.description.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesDescription) return false;
      }
      
      if (filters.dateFrom && new Date(incident.createdAt) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(incident.createdAt) > new Date(filters.dateTo)) return false;
      
      return true;
    });
  }, [incidents, filters]);

  return filteredIncidents;
};
