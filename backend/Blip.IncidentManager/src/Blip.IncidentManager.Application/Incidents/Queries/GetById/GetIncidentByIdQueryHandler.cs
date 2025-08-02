using AutoMapper;
using Blip.IncidentManager.Application.Exceptions;
using Blip.IncidentManager.Application.Interfaces;
using MediatR;

namespace Blip.IncidentManager.Application.Incidents.Queries.GetById
{
    public class GetIncidentByIdQueryHandler : IRequestHandler<GetIncidentByIdQuery, IncidentDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public GetIncidentByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<IncidentDto> Handle(GetIncidentByIdQuery request, CancellationToken cancellationToken)
        {
            var incident = await _unitOfWork.GetIncidents().GetByIdAsync(request.Id);

            if (incident == null)
            {
                throw new IncidentNotFound($"Incident with Id {request.Id} not found.");
            }

            return _mapper.Map<IncidentDto>(incident);
        }
    }
}
