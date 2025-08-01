namespace Blip.IncidentManager.Api.ServiceContracts.V1.Request;

public record UpdateIncidentRequest(Guid Id, string Title, string Description, Guid AssignedUserId);