using MediatR;
using Blip.IncidentManager.Application.Commands;
using Blip.IncidentManager.Application.DTOs;
using Blip.IncidentManager.Domain.Entities;

namespace Blip.IncidentManager.Application.Handlers;

public class CreateIncidentCommandHandler : IRequestHandler<CreateIncidentCommand, IncidentDto>
{
    public async Task<IncidentDto> Handle(CreateIncidentCommand request, CancellationToken cancellationToken)
    {
        var incident = new Incident
        {
            Title = request.Title,
            Description = request.Description
        };

        return new IncidentDto(incident.Id, incident.Title, incident.Description, incident.CreatedAt);
    }
}
