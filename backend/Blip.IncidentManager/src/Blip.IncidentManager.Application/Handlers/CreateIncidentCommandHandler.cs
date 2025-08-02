using MediatR;
using Blip.IncidentManager.Application.Commands;
using Blip.IncidentManager.Application.DTOs;
using Blip.IncidentManager.Domain.Entities;
using Blip.IncidentManager.Application.Common.Interfaces;

namespace Blip.IncidentManager.Application.Handlers;

public class CreateIncidentCommandHandler : IRequestHandler<CreateIncidentCommand, IncidentDto>
{
    private readonly IUnitOfWork _unitOfWork;

    public CreateIncidentCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<IncidentDto> Handle(CreateIncidentCommand request, CancellationToken cancellationToken)
    {
        var incident = new Incident
        {
            Title = request.Title,
            Description = request.Description
        };

        var newIncident = await _unitOfWork.Incidents.AddAsync(incident);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new IncidentDto(newIncident.Id, newIncident.Title, newIncident.Description, newIncident.CreatedAt);
    }
}
