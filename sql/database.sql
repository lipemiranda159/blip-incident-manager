-- Tabela de usuários
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('solicitante', 'atendente')),
    avatar TEXT,
    password_hash TEXT NOT NULL  -- Armazena o hash da senha do usuário
);

-- Tabela de incidentes
CREATE TABLE incidents (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL CHECK (
        status IN ('Aberto', 'Em andamento', 'Resolvido', 'Cancelado', 'Pendente')
    ),
    priority VARCHAR(10) NOT NULL CHECK (
        priority IN ('Baixa', 'Média', 'Alta', 'Crítica')
    ),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    category TEXT,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Tabela de comentários
CREATE TABLE comments (
    id UUID PRIMARY KEY,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para otimizar filtros
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_priority ON incidents(priority);
CREATE INDEX idx_incidents_created_at ON incidents(created_at);