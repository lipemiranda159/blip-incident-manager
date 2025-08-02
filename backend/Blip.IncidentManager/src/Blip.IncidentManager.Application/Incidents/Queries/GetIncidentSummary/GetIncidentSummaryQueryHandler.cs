
using Blip.IncidentManager.Application.Exceptions;
using Blip.IncidentManager.Application.Interfaces;
using Blip.IncidentManager.Domain.Entities;
using MediatR;

namespace Blip.IncidentManager.Application.Incidents.Queries.GetIncidentSummary
{
    public class GetIncidentSummaryQueryHandler : IRequestHandler<GetIncidentSummaryQuery, IncidentSummaryDto>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IIncidentSummaryAiService _summaryService;

        public GetIncidentSummaryQueryHandler(IUnitOfWork unitOfWork, IIncidentSummaryAiService summaryService)
        {
            _unitOfWork = unitOfWork;
            _summaryService = summaryService;
        }

        public async Task<IncidentSummaryDto> Handle(GetIncidentSummaryQuery request, CancellationToken cancellationToken)
        {
            var incident = await _unitOfWork.GetIncidents().GetByIdAsync(request.Id, "Comments");

            if (incident == null)
                throw new IncidentNotFound($"Incident with ID {request.Id} not found.");

            var commentsText = incident.Comments.Select(c => c.Content).ToList();
            var summary = await _summaryService.GenerateSummaryAsync(incident.Title, incident.Description, commentsText, cancellationToken);

            return new IncidentSummaryDto
            {
                Id = incident.Id,
                Title = incident.Title,
                Summary = summary
            };
        }
    }
}
