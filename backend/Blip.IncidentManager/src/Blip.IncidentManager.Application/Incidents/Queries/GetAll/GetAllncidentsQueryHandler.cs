using Blip.IncidentManager.Application.Auth;
using Blip.IncidentManager.Application.DTOs;
using Blip.IncidentManager.Application.Interfaces;
using Blip.IncidentManager.Domain.Entities;
using MediatR;

namespace Blip.IncidentManager.Application.Incidents.Queries.GetAll
{
    public class GetAllncidentsQueryHandler : IRequestHandler<GetAllIncidentsQuery, PagedResult<IncidentDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public GetAllncidentsQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<PagedResult<IncidentDto>> Handle(GetAllIncidentsQuery request, CancellationToken cancellationToken)
        {
            var incidents = await _unitOfWork.GetIncidents().GetAllAsync(request.PageNumber, request.PageSize, "CreatedBy");

            var incidentDtos = incidents.Select(incident => new IncidentDto
            {
                Id = incident.Id,
                Title = incident.Title,
                Description = incident.Description,
                Status = incident.Status,
                Priority = incident.Priority,
                CreatedAt = incident.CreatedAt,
                UpdatedAt = incident.UpdatedAt,
                CreatedBy = new UserDto
                {
                    Id = incident.CreatedBy.Id,
                    Name = incident.CreatedBy.Name,
                    Email = incident.CreatedBy.Email,
                    Type = incident.CreatedBy.Type,
                }
            });

            var count = await _unitOfWork.GetIncidents().CountAsync();
            return new PagedResult<IncidentDto>()
            {
                CurrentPage = request.PageNumber,
                Items = incidentDtos,
                TotalPages = (int)Math.Ceiling((double)count / request.PageSize),
            };
        }
    }

}
