# Environment Setup Guide

## 🚀 Configuração de Ambiente

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto frontend baseado no `.env.example`:

```bash
cp .env.example .env
```

Configure as seguintes variáveis:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000
VITE_API_TIMEOUT=10000

# Environment
VITE_NODE_ENV=development
```

### 2. Configuração do Backend (CORS)

Para que o frontend funcione corretamente, o backend precisa ter CORS configurado.

#### .NET Core/ASP.NET Core

Adicione no `Program.cs`:

```csharp
var builder = WebApplication.CreateBuilder(args);

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173", // Vite dev server
            "http://localhost:3000", // React dev server
            "http://localhost:4173"  // Vite preview
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

var app = builder.Build();

// Use CORS (IMPORTANTE: antes de UseAuthentication/UseAuthorization)
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();
```

### 3. Configurações por Ambiente

#### Desenvolvimento
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_NODE_ENV=development
```

#### Produção
```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_NODE_ENV=production
```

### 4. Funcionalidades Implementadas

✅ **Configuração automática de ambiente**
- Carregamento automático de variáveis de ambiente
- Fallbacks para valores padrão
- Validação de variáveis obrigatórias

✅ **CORS configurado**
- Headers CORS apropriados
- Mode 'cors' habilitado
- Credentials configurados

✅ **Timeout e retry**
- Timeout configurável via ambiente
- Tratamento de erros de rede
- Mensagens de erro em português

✅ **Logs de desenvolvimento**
- Logs de requisições HTTP
- Logs de respostas da API
- Logs de erros detalhados

### 5. Troubleshooting

#### Erro de CORS
```
Access to fetch at 'http://localhost:5000/api/Auth/login' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solução**: Verifique se o backend tem CORS configurado corretamente.

#### Erro 401 - Unauthorized
```
Sessão expirada. Faça login novamente.
```

**Solução**: Token JWT expirou. Faça login novamente.

#### Timeout Error
```
Tempo limite da requisição excedido
```

**Solução**: Aumente o valor de `VITE_API_TIMEOUT` no `.env`.

#### Network Error
```
Erro de conexão com o servidor
```

**Solução**: Verifique se:
1. O backend está rodando
2. A URL da API está correta no `.env`
3. Não há firewall bloqueando a conexão

### 6. Comandos Úteis

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build de produção
npm run preview

# Verificar variáveis de ambiente
echo $VITE_API_BASE_URL
```

### 7. Estrutura de Configuração

```
src/
├── config/
│   ├── env.ts              # Configuração de ambiente
│   ├── development.ts      # Configurações de desenvolvimento
│   └── cors.md            # Guia de CORS
├── services/
│   ├── httpClient.ts      # Cliente HTTP com CORS
│   └── apiClient.ts       # Cliente principal da API
```

### 8. Exemplo de Uso

```typescript
import { apiClient } from '@/services';

// Login
const response = await apiClient.auth.login({
  email: 'user@example.com',
  password: 'password123'
});

// Buscar incidentes
const incidents = await apiClient.incidents.getIncidents({
  pageNumber: 1,
  pageSize: 10
});
```
