using MediatR;

namespace Blip.IncidentManager.Application.Incidents.Commands;

public record DeleteIncidentCommand(Guid Id) : IRequest<bool>;