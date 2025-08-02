using MediatR;

namespace Blip.IncidentManager.Application.Incident.Queries;

public record GetIncidentByIdQuery(Guid Id) : IRequest<IncidentDto>;
