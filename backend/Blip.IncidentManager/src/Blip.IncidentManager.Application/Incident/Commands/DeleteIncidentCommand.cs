using MediatR;

namespace Blip.IncidentManager.Application.Incident.Commands;

public record DeleteIncidentCommand(Guid Id) : IRequest<bool>;