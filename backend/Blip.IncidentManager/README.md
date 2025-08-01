# Blip.IncidentManager

Este projeto segue a arquitetura Onion com suporte a CQRS.

- **Blip.IncidentManager.API**: API Gateway
- **Blip.IncidentManager.Application**: Camada de aplicação (CQRS, interfaces, DTOs, use cases)
- **Blip.IncidentManager.Domain**: Camada de domínio (entidades, enums, interfaces)
- **Blip.IncidentManager.Infrastructure**: Infraestrutura (Repositórios, serviços externos)
- **Blip.IncidentManager.Persistence**: Persistência (DbContext, Migrations)
- **Blip.IncidentManager.Tests**: Testes unitários
