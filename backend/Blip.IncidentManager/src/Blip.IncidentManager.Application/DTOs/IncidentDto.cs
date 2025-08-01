namespace Blip.IncidentManager.Application.DTOs;

public record IncidentDto(Guid Id, string Title, string Description, DateTime CreatedAt);
