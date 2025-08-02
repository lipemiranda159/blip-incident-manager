using MediatR;
using Blip.IncidentManager.Domain.Entities;
using Blip.IncidentManager.Application.Interfaces;
using Blip.IncidentManager.Application.Auth;

namespace Blip.IncidentManager.Application.Incidents.Commands.Insert;

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
            Description = request.Description,
            CreatedById = request.CreatedBy,
            Status = "Aberto",
            Priority = request.Priority,
            Category = request.Category,
        };

        var newIncident = await _unitOfWork.GetIncidents().AddAsync(incident);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var user = await _unitOfWork.GetUsers().GetByIdAsync(request.CreatedBy);
        var userDto = new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email
        };

        return new IncidentDto(newIncident.Id, newIncident.Title, newIncident.Description, newIncident.CreatedAt, userDto);
    }
}
