using MediatR;

namespace Blip.IncidentManager.Application.Incident.Commands.Insert;

public record CreateIncidentCommand(string Title, string Description) : IRequest<IncidentDto>;
