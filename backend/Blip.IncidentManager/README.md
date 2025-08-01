# Blip.IncidentManager

Este projeto segue a arquitetura Onion com suporte a CQRS.

- **Blip.IncidentManager.API**: API Gateway
- **Blip.IncidentManager.Application**: Camada de aplica��o (CQRS, interfaces, DTOs, use cases)
- **Blip.IncidentManager.Domain**: Camada de dom�nio (entidades, enums, interfaces)
- **Blip.IncidentManager.Infrastructure**: Infraestrutura (Reposit�rios, servi�os externos)
- **Blip.IncidentManager.Persistence**: Persist�ncia (DbContext, Migrations)
- **Blip.IncidentManager.Tests**: Testes unit�rios
