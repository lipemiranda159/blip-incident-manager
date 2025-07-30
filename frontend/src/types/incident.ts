export interface Incident {
    id: string;
    title: string;
    description: string;
    status: 'Aberto' | 'Em andamento' | 'Resolvido' | 'Cancelado';
    priority: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
    createdAt: Date;
    updatedAt: Date;
    assignedTo?: string;
    category: string;
  }
  
  export interface Comment {
    id: string;
    incidentId: string;
    author: string;
    content: string;
    createdAt: Date;
  }
  
  export interface Filter {
    status?: string;
    priority?: string;
    dateRange?: {
      start: Date;
      end: Date;
    };
    search?: string;
  }