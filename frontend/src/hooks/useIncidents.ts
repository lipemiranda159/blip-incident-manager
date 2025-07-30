import { useState, useEffect, useMemo } from 'react';
import type { Incident, Filter, User } from '../types';

const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@empresa.com',
    type: 'solicitante',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@empresa.com',
    type: 'atendente',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
  }
];

const generateMockIncidents = (): Incident[] => {
  const statuses: Incident['status'][] = ['Aberto', 'Em andamento', 'Resolvido', 'Cancelado'];
  const priorities: Incident['priority'][] = ['Baixa', 'Média', 'Alta', 'Crítica'];
  const titles = [
    'Sistema fora do ar',
    'Erro ao fazer login',
    'Problema na impressora',
    'Lentidão na rede',
    'Falha no backup',
    'Email não funciona',
    'Computador travando',
    'Software não abre',
    'Erro na integração',
    'Base de dados corrompida'
  ];

  return Array.from({ length: 50 }, (_, i) => ({
    id: `INC-${String(i + 1).padStart(4, '0')}`,
    title: titles[i % titles.length],
    description: `Descrição detalhada do incidente ${i + 1}. Este é um problema que precisa ser resolvido com urgência e requer atenção especializada.`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: mockUsers[Math.floor(Math.random() * mockUsers.length)],
    assignedTo: Math.random() > 0.3 ? mockUsers[1] : undefined,
    comments: []
  }));
};

export const useIncidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<IncidentFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadIncidents = async () => {
      setLoading(true);
      // Simular delay de carregamento
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockIncidents = generateMockIncidents();
      setIncidents(mockIncidents);
      setLoading(false);
    };

    loadIncidents();
  }, []);

  const filteredIncidents = useMemo(() => {
    return incidents.filter(incident => {
      if (filters.status && incident.status !== filters.status) return false;
      if (filters.priority && incident.priority !== filters.priority) return false;
      if (filters.search && !incident.title.toLowerCase().includes(filters.search.toLowerCase()) && 
          !incident.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.dateFrom && new Date(incident.createdAt) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(incident.createdAt) > new Date(filters.dateTo)) return false;
      return true;
    });
  }, [incidents, filters]);

  const paginatedIncidents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredIncidents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredIncidents, currentPage]);

  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage);

  const createIncident = async (data: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newIncident: Incident = {
      ...data,
      id: `INC-${String(incidents.length + 1).padStart(4, '0')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };
    
    setIncidents(prev => [newIncident, ...prev]);
    setLoading(false);
    return newIncident;
  };

  const updateIncident = async (id: string, updates: Partial<Incident>) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setIncidents(prev => prev.map(incident => 
      incident.id === id 
        ? { ...incident, ...updates, updatedAt: new Date().toISOString() }
        : incident
    ));
    setLoading(false);
  };

  const addComment = async (incidentId: string, content: string, author: User) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      content,
      createdAt: new Date().toISOString(),
      author
    };

    setIncidents(prev => prev.map(incident => 
      incident.id === incidentId 
        ? { 
            ...incident, 
            comments: [...incident.comments, newComment],
            updatedAt: new Date().toISOString()
          }
        : incident
    ));
  };

  const getIncidentById = (id: string) => {
    return incidents.find(incident => incident.id === id);
  };

  return {
    incidents: paginatedIncidents,
    allIncidents: filteredIncidents,
    loading,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    totalPages,
    totalItems: filteredIncidents.length,
    createIncident,
    updateIncident,
    addComment,
    getIncidentById
  };
};