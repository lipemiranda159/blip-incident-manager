import { useState, useEffect, useMemo } from 'react';
import { type Incident, type Filter, type User } from '../types';

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
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    createdBy: mockUsers[Math.floor(Math.random() * mockUsers.length)],
    assignedTo: Math.random() > 0.3 ? mockUsers[1] : undefined,
    comments: [
      {
        id: `comment-${Date.now()}`,
        content: 'Descrição detalhada do incidente 1. Este é um problema que precisa ser resolvido com urgência e requer atenção especializada.',
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        author: mockUsers[Math.floor(Math.random() * mockUsers.length)]
      },
      {
        id: `comment-${Date.now()}`,
        content: 'Descrição detalhada do incidente 1. Este é um problema que precisa ser resolvido com urgência e requer atenção especializada.',
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        author: mockUsers[Math.floor(Math.random() * mockUsers.length)]
      },
      {
        id: `comment-${Date.now()}`,
        content: 'Descrição detalhada do incidente 1. Este é um problema que precisa ser resolvido com urgência e requer atenção especializada.',
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        author: mockUsers[Math.floor(Math.random() * mockUsers.length)]
      }
    ],
    category: 'Tecnologia',
    tags: ['Tecnologia', 'Sistema', 'Incidente']
  }));
};



export const useIncidents = () => {
  const [allIncidents, setAllIncidents] = useState<Incident[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filters, setFilters] = useState<Filter>({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  // Carrega tudo no início
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await new Promise(res => setTimeout(res, 800));
      setAllIncidents(generateMockIncidents());
      setLoading(false);
    };
    loadAll();
  }, []);

  // Filtra com base em allIncidents
  const filteredAll = useMemo(() => {
    return allIncidents.filter((incident) => {
      if (filters.status && incident.status !== filters.status) return false;
      if (filters.priority && incident.priority !== filters.priority) return false;
      if (
        filters.search &&
        !incident.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !incident.description.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      if (filters.dateFrom && new Date(incident.createdAt) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(incident.createdAt) > new Date(filters.dateTo)) return false;
      return true;
    });
  }, [allIncidents, filters]);

  // Reseta incidentes e paginação ao mudar filtro
  useEffect(() => {
    setIncidents([]);
    setPage(1);
    setHasMore(true);
  }, [filters]);

  // Paginação real baseada no array filtrado
  useEffect(() => {
    let cancelled = false;
    const loadMore = async () => {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 500));
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const newItems = filteredAll.slice(start, end);

      if (!cancelled) {
        setIncidents((prev) => [...prev, ...newItems]);
        setHasMore(end < filteredAll.length);
        setLoading(false);
      }
    };

    loadMore();
    return () => {
      cancelled = true;
    };
  }, [page, filteredAll]);

  const loadMoreIncidents = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const createIncident = async (data: Omit<Incident, 'id' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 500));
    const newIncident: Incident = {
      ...data,
      id: `INC-${String(allIncidents.length + 1).padStart(4, '0')}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: []
    };
    setAllIncidents((prev) => [newIncident, ...prev]);
    setLoading(false);
    return newIncident;
  };

  const updateIncident = async (id: string, updates: Partial<Incident>) => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 500));
    setAllIncidents(prev =>
      prev.map(incident =>
        incident.id === id
          ? { ...incident, ...updates, updatedAt: new Date() }
          : incident
      )
    );
    setLoading(false);
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

  const getIncidentById = (id: string) => {
    return allIncidents.find((i) => i.id === id) ?? null;
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
