using Blip.IncidentManager.Application.Incidents;
using MediatR;

namespace Blip.IncidentManager.Application.Incidents.Queries;

public record GetIncidentByIdQuery(Guid Id) : IRequest<IncidentDto>;
