namespace Blip.IncidentManager.Application.Incident;

public record IncidentDto(Guid Id, string Title, string Description, DateTime CreatedAt);
