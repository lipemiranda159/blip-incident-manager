using MediatR;

namespace Blip.IncidentManager.Application.Incidents.Queries.GetById;

public record GetIncidentByIdQuery(Guid Id) : IRequest<IncidentDto>;
