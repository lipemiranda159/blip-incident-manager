import { type Incident, type User } from '../types';

export const mockUsers: User[] = [
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

const incidentTitles = [
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

const statuses: Incident['status'][] = ['Aberto', 'Em andamento', 'Resolvido', 'Cancelado'];
const priorities: Incident['priority'][] = ['Baixa', 'Média', 'Alta', 'Crítica'];

export const generateMockIncidents = (count: number = 50): Incident[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `INC-${String(i + 1).padStart(4, '0')}`,
    title: incidentTitles[i % incidentTitles.length],
    description: `Descrição detalhada do incidente ${i + 1}. Este é um problema que precisa ser resolvido com urgência e requer atenção especializada.`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    createdBy: mockUsers[Math.floor(Math.random() * mockUsers.length)],
    assignedTo: Math.random() > 0.3 ? mockUsers[1] : undefined,
    comments: generateMockComments(),
    category: 'Tecnologia',
    tags: ['Tecnologia', 'Sistema', 'Incidente']
  }));
};

const generateMockComments = () => {
  const commentCount = Math.floor(Math.random() * 4); // 0-3 comments
  return Array.from({ length: commentCount }, (_, i) => ({
    id: `comment-${Date.now()}-${i}`,
    content: `Comentário ${i + 1} sobre o incidente. Este é um comentário de acompanhamento.`,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    author: mockUsers[Math.floor(Math.random() * mockUsers.length)]
  }));
};

export const createNewIncidentId = (existingIncidents: Incident[]): string => {
  return `INC-${String(existingIncidents.length + 1).padStart(4, '0')}`;
};
