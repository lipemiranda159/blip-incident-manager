namespace Blip.IncidentManager.Api.ServiceContracts.V1.Request;

public record RegisterUserRequest(string Name, string Email, string Type, string? Avatar, string Password);
