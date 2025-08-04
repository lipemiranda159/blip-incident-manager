# Guia de Testes - Blip Incident Manager Backend

Este documento descreve a estrutura de testes implementada para o backend do sistema de gerenciamento de incidentes.

## 📋 Visão Geral

O projeto implementa uma suíte abrangente de testes cobrindo todas as camadas da arquitetura:

- **Testes Unitários**: Testam componentes isolados (Domain, Application)
- **Testes de Integração**: Testam interações entre componentes (Database, API)
- **Cobertura de Código**: Relatórios detalhados de cobertura

## 🏗️ Estrutura dos Testes

```
Blip.IncidentManager.Tests/
├── Helpers/                          # Utilitários para testes
│   ├── TestBase.cs                   # Classe base para testes
│   ├── TestDataBuilder.cs            # Builder para dados de teste
│   └── DatabaseTestHelper.cs         # Helper para banco de dados
├── UnitTests/                        # Testes unitários
│   ├── Domain/
│   │   └── Entities/                 # Testes das entidades
│   │       ├── UserTests.cs
│   │       ├── IncidentTests.cs
│   │       └── CommentsTests.cs
│   └── Application/                  # Testes da camada de aplicação
│       ├── Auth/Commands/
│       │   └── LoginCommandHandlerTests.cs
│       └── Incidents/Commands/
│           └── CreateIncidentCommandHandlerTests.cs
└── IntegrationTests/                 # Testes de integração
    ├── Database/                     # Testes de repositório
    │   └── IncidentRepositoryIntegrationTests.cs
    └── API/                          # Testes de API
        ├── IncidentsControllerIntegrationTests.cs
        └── AuthControllerIntegrationTests.cs
```

## 🛠️ Tecnologias Utilizadas

- **xUnit**: Framework de testes principal
- **Moq**: Biblioteca para mocking
- **AutoFixture**: Geração automática de dados de teste
- **FluentAssertions**: Assertions mais legíveis
- **Entity Framework InMemory**: Banco de dados em memória para testes
- **ASP.NET Core Testing**: Testes de integração de API

## 🚀 Executando os Testes

### Opção 1: Script PowerShell (Recomendado)

```powershell
# Executar todos os testes
.\run-tests.ps1

# Executar com cobertura de código
.\run-tests.ps1 -Coverage

# Executar em modo watch (re-executa automaticamente)
.\run-tests.ps1 -Watch

# Executar testes filtrados
.\run-tests.ps1 -Filter "User*"

# Executar com saída detalhada
.\run-tests.ps1 -Verbose
```

### Opção 2: Comandos .NET CLI

```bash
# Executar todos os testes
dotnet test src/Blip.IncidentManager.Tests/

# Executar com cobertura
dotnet test src/Blip.IncidentManager.Tests/ --collect:"XPlat Code Coverage"

# Executar testes específicos
dotnet test src/Blip.IncidentManager.Tests/ --filter "UserTests"
```

## 📊 Cobertura de Código

### Gerando Relatórios

1. Execute os testes com cobertura:
```powershell
.\run-tests.ps1 -Coverage
```

2. Instale o ReportGenerator (se não tiver):
```bash
dotnet tool install -g dotnet-reportgenerator-globaltool
```

3. Gere o relatório HTML:
```bash
reportgenerator -reports:"TestResults/Coverage/**/coverage.cobertura.xml" -targetdir:"TestResults/Coverage/html"
```

### Visualizando Relatórios

- Abra `TestResults/Coverage/html/index.html` no navegador
- O relatório mostra cobertura por linha, branch e método
- Identifica áreas que precisam de mais testes

## 🧪 Tipos de Testes

### Testes Unitários

**Domain Entities**
- Validação de propriedades
- Comportamento de construtores
- Regras de negócio

**Application Handlers**
- Lógica de comandos e queries
- Validações de entrada
- Tratamento de erros

### Testes de Integração

**Database**
- Operações CRUD
- Relacionamentos entre entidades
- Transações e consistência

**API**
- Endpoints HTTP
- Serialização/Deserialização
- Autenticação e autorização

## 📝 Convenções de Nomenclatura

### Classes de Teste
- `{ClasseTestada}Tests.cs`
- Exemplo: `UserTests.cs`, `LoginCommandHandlerTests.cs`

### Métodos de Teste
- `{Método}_{Cenário}_{ResultadoEsperado}`
- Exemplo: `Handle_WithValidCredentials_ShouldReturnToken`

### Estrutura AAA
```csharp
[Fact]
public async Task Handle_WithValidData_ShouldCreateUser()
{
    // Arrange - Preparar dados e mocks
    var command = new CreateUserCommand { ... };
    
    // Act - Executar a ação
    var result = await handler.Handle(command);
    
    // Assert - Verificar resultado
    result.Should().NotBeNull();
}
```

## 🔧 Configuração de Ambiente

### Pré-requisitos
- .NET 9.0 SDK
- Visual Studio 2022 ou VS Code
- PowerShell (para scripts)

### Configuração do IDE

**Visual Studio**
- Test Explorer para visualizar testes
- Live Unit Testing para execução contínua
- Code Coverage integrado

**VS Code**
- Extensão .NET Test Explorer
- Extensão Coverage Gutters

## 🐛 Debugging de Testes

### Executar Teste Individual
```bash
dotnet test --filter "FullyQualifiedName~UserTests.User_WhenCreated_ShouldHaveValidProperties"
```

### Debug no Visual Studio
1. Coloque breakpoints no teste
2. Clique com botão direito → "Debug Test"
3. Use F10/F11 para navegar

### Logs de Teste
- Testes de integração incluem logging
- Use `ITestOutputHelper` para logs customizados

## 📈 Métricas e Qualidade

### Objetivos de Cobertura
- **Mínimo**: 80% de cobertura de código
- **Ideal**: 90%+ para lógica crítica
- **Branches**: 85%+ de cobertura de branches

### Indicadores de Qualidade
- Todos os testes devem passar
- Tempo de execução < 30 segundos
- Zero warnings de análise estática

## 🔄 CI/CD Integration

### GitHub Actions (Exemplo)
```yaml
- name: Run Tests
  run: dotnet test --configuration Release --collect:"XPlat Code Coverage"
  
- name: Generate Coverage Report
  run: reportgenerator -reports:"**/coverage.cobertura.xml" -targetdir:"coverage"
```

## 📚 Recursos Adicionais

- [xUnit Documentation](https://xunit.net/)
- [Moq Documentation](https://github.com/moq/moq)
- [FluentAssertions Documentation](https://fluentassertions.com/)
- [ASP.NET Core Testing](https://docs.microsoft.com/en-us/aspnet/core/test/)

## 🤝 Contribuindo

### Adicionando Novos Testes
1. Identifique a camada (Unit/Integration)
2. Crie na estrutura apropriada
3. Siga as convenções de nomenclatura
4. Inclua cenários positivos e negativos
5. Verifique cobertura de código

### Code Review
- Todos os testes devem passar
- Cobertura não deve diminuir
- Testes devem ser legíveis e maintíveis
- Mocks devem ser apropriados
