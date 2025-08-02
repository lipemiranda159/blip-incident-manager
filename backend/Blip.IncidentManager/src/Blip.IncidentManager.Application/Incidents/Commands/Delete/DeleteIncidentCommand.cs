using MediatR;

namespace Blip.IncidentManager.Application.Incidents.Commands.Delete;

public record DeleteIncidentCommand(Guid Id) : IRequest<Unit>;