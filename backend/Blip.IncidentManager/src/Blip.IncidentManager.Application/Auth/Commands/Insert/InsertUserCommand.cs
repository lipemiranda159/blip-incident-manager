using MediatR;

namespace Blip.IncidentManager.Application.Auth.Commands.Insert;

public record InsertUserCommand(string Name, string Email, string Type, string Avatar, string Password) : IRequest<UserDto>;
