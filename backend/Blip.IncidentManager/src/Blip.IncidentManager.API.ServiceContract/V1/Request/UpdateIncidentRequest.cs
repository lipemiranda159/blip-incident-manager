namespace Blip.IncidentManager.Api.ServiceContracts.V1.Request;

public record UpdateIncidentRequest(
    string? Title,
    string? Description,
    string? Status,
    string? Priority,
    Guid? AssignedUserId);