namespace Blip.IncidentManager.Api.ServiceContracts.V1.Request;

public record CreateIncidentRequest(
    string Title,
    string Description,
    string Priority,
    string? Category);