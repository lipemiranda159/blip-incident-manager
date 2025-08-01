using MediatR;

namespace Blip.IncidentManager.Application.Commands;

public record DeleteIncidentCommand(Guid Id) : IRequest<bool>;