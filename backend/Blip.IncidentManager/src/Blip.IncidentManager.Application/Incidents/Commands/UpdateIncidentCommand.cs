using MediatR;

namespace Blip.IncidentManager.Application.Incidents.Commands;

public record UpdateIncidentCommand(Guid Id, string Title, string Description, Guid AssignedUserId) : IRequest<IncidentDto>;
