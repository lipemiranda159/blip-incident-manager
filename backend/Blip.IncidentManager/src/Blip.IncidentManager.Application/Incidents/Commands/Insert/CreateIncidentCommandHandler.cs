using MediatR;
using Blip.IncidentManager.Domain.Entities;
using Blip.IncidentManager.Application.Interfaces;
using Blip.IncidentManager.Application.Auth;
using AutoMapper;

namespace Blip.IncidentManager.Application.Incidents.Commands.Insert;

public class CreateIncidentCommandHandler : IRequestHandler<CreateIncidentCommand, IncidentDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    public CreateIncidentCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
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
        newIncident.CreatedBy = user!;

        return _mapper.Map<IncidentDto>(newIncident);
    }
}
