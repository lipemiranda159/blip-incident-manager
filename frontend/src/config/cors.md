# CORS Configuration Guide

## Frontend Configuration

O frontend já está configurado para lidar com CORS através do `HttpClient`:

- **Mode**: `cors` habilitado
- **Credentials**: `omit` (não envia cookies)
- **Headers**: Headers CORS apropriados incluídos
- **Timeout**: Configurável via variável de ambiente

## Backend Configuration (C# .NET)

Para o backend funcionar corretamente com o frontend, adicione a seguinte configuração no `Program.cs` ou `Startup.cs`:

```csharp
// Program.cs (.NET 6+)
var builder = WebApplication.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000") // Vite e outras portas
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // Se precisar de cookies/auth
    });
});

var app = builder.Build();

// Use CORS
app.UseCors("AllowFrontend");

// Outros middlewares...
app.UseAuthentication();
app.UseAuthorization();
```

## Environment Variables

Certifique-se de criar um arquivo `.env` na raiz do projeto frontend com:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_API_TIMEOUT=10000
VITE_NODE_ENV=development
```

## Production Configuration

Para produção, ajuste as origens permitidas no backend:

```csharp
policy.WithOrigins("https://your-frontend-domain.com")
```

E no frontend, configure a variável de ambiente:

```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_NODE_ENV=production
```

## Troubleshooting

1. **Erro de CORS**: Verifique se o backend tem a política CORS configurada
2. **401 Unauthorized**: Token JWT pode estar expirado ou inválido
3. **Timeout**: Aumente o valor de `VITE_API_TIMEOUT`
4. **Network Error**: Verifique se a URL da API está correta
