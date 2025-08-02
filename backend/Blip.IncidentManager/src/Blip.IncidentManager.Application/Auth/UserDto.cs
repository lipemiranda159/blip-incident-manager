namespace Blip.IncidentManager.Application.Auth;

public record UserDto(Guid Id, string Name, string Email, string Type, string Avatar);
