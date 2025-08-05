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

      // Converter data do incidente para formato de data (sem horário)
      const incidentDate = new Date(incident.createdAt);
      const incidentDateOnly = new Date(incidentDate.getFullYear(), incidentDate.getMonth(), incidentDate.getDate());
      
      // Processar data de início do filtro
      if (filters.dateFrom && typeof filters.dateFrom === 'string') {
        let fromDate: Date;
        // Verificar se a data está no formato DD/MM/YYYY (brasileiro)
        if (filters.dateFrom.includes('/')) {
          const [day, month, year] = filters.dateFrom.split('/');
          fromDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
          fromDate = new Date(filters.dateFrom);
        }
        
        if (incidentDateOnly < fromDate) return false;
      }
      
      // Processar data final do filtro
      if (filters.dateTo && typeof filters.dateTo === 'string') {
        let toDate: Date;
        // Verificar se a data está no formato DD/MM/YYYY (brasileiro)
        if (filters.dateTo.includes('/')) {
          const [day, month, year] = filters.dateTo.split('/');
          toDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
          toDate = new Date(filters.dateTo);
        }
        
        if (incidentDateOnly > toDate) return false;
      }

      return true;
    });
  }, [incidents, filters]);

  return filteredIncidents;
};
