using MediatR;

namespace Blip.IncidentManager.Application.Incidents.Commands.Update;

public record UpdateIncidentCommand : IRequest<Unit>
{
    public Guid Id { get; init; }
    public string? Title { get; init; }
    public string? Description { get; init; }
    public string? Status { get; init; }
    public string? Priority { get; init; }
    public Guid? AssignedUserId { get; init; }
}
