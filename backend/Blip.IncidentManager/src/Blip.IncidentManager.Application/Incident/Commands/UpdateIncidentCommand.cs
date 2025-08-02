using MediatR;

namespace Blip.IncidentManager.Application.Incident.Commands;

public record UpdateIncidentCommand(Guid Id, string Title, string Description, Guid AssignedUserId) : IRequest<IncidentDto>;
