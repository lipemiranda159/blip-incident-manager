export interface User {
  id: string;
  name: string;
  email: string;
  type: 'solicitante' | 'atendente';
  avatar?: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  status: 'Aberto' | 'Em andamento' | 'Resolvido' | 'Cancelado';
  priority: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  createdAt: Date;
  updatedAt: Date;
  category: string;
  comments: Comment[];
  createdBy: User;
  assignedTo?: User;
}

export interface Comment {
  id: string;
  incidentId: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface Filter {
  status?: string;
  priority?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}