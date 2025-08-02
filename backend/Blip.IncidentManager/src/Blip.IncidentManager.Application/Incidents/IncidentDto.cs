namespace Blip.IncidentManager.Application.Incidents;

public record IncidentDto(Guid Id, string Title, string Description, DateTime CreatedAt);
