using MediatR;

namespace Blip.IncidentManager.Application.Auth.Commands.Login;

public record LoginCommand(string Email, string Password) : IRequest<string>;
