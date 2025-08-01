using Blip.IncidentManager.Application.DTOs;
using MediatR;

namespace Blip.IncidentManager.Application.Queries;

public record GetIncidentByIdQuery(Guid Id) : IRequest<IncidentDto>;
