using MediatR;
using Blip.IncidentManager.Application.DTOs;

namespace Blip.IncidentManager.Application.Commands;

public record CreateIncidentCommand(string Title, string Description) : IRequest<IncidentDto>;
