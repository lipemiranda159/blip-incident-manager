using MediatR;

namespace Blip.IncidentManager.Application.Incidents.Commands.Insert;

public record CreateIncidentCommand(
    string Title,
    string Description,
    string Priority,
    string? Category,
    Guid CreatedBy) : IRequest<IncidentDto>;
