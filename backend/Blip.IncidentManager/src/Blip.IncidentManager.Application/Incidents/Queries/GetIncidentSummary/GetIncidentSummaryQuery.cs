using MediatR;

namespace Blip.IncidentManager.Application.Incidents.Queries.GetIncidentSummary;
public record GetIncidentSummaryQuery(Guid Id) : IRequest<IncidentSummaryDto>;