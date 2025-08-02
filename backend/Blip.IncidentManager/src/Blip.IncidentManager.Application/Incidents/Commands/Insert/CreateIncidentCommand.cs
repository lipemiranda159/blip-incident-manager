using MediatR;

namespace Blip.IncidentManager.Application.Incidents.Commands.Insert;

public class CreateIncidentCommand : IRequest<IncidentDto>
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string? Category { get; set; } = null;
    public Guid CreatedBy { get; set; } = Guid.Empty;
}
