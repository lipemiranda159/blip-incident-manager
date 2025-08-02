using Blip.IncidentManager.Application.DTOs;
using MediatR;

namespace Blip.IncidentManager.Application.Incidents.Queries.GetAll;

public record GetAllIncidentsQuery(int PageNumber = 1, int PageSize = 10) : IRequest<PagedResult<IncidentDto>>;
