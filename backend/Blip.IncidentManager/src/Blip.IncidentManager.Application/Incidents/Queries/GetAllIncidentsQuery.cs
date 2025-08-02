using Blip.IncidentManager.Application.DTOs;
using Blip.IncidentManager.Application.Incidents;
using MediatR;

namespace Blip.IncidentManager.Application.Incidents.Queries;

public record GetAllIncidentsQuery(int PageNumber = 1, int PageSize = 10) : IRequest<PagedResult<IncidentDto>>;
