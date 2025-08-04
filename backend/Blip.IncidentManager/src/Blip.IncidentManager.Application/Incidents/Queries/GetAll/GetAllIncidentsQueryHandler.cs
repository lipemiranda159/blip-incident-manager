using Blip.IncidentManager.Application.Auth;
using Blip.IncidentManager.Application.DTOs;
using Blip.IncidentManager.Application.Interfaces;
using MediatR;

namespace Blip.IncidentManager.Application.Incidents.Queries.GetAll
{
    public class GetAllIncidentsQueryHandler : IRequestHandler<GetAllIncidentsQuery, PagedResult<IncidentDto>>
    {
        private readonly IUnitOfWork _unitOfWork;
        public GetAllIncidentsQueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<PagedResult<IncidentDto>> Handle(GetAllIncidentsQuery request, CancellationToken cancellationToken)
        {
            var incidents = await _unitOfWork.GetIncidents().GetAllProjectedAsync(
                i => new IncidentDto 
                {
                    Id = i.Id,
                    Title = i.Title,
                    Description = i.Description,
                    Status = i.Status,
                    Priority = i.Priority,
                    CreatedAt = i.CreatedAt,
                    UpdatedAt = i.UpdatedAt,
                    CreatedBy = new UserDto
                    {
                        Id = i.CreatedBy.Id,
                        Name = i.CreatedBy.Name,
                        Email = i.CreatedBy.Email,
                        Type = i.CreatedBy.Type,
                    },
                    AssignedTo = i.AssignedTo != null ? new UserDto
                    {
                        Id = i.AssignedTo.Id,
                        Name = i.AssignedTo.Name,
                        Email = i.AssignedTo.Email,
                        Type = i.AssignedTo.Type,
                    } : null
                },
                request.PageNumber, request.PageSize, "CreatedBy", "AssignedTo");

            var count = await _unitOfWork.GetIncidents().CountAsync();
            return new PagedResult<IncidentDto>()
            {
                CurrentPage = request.PageNumber,
                Items = incidents,
                TotalPages = (int)Math.Ceiling((double)count / request.PageSize),
                TotalCount = count
            };
        }
    }

}
