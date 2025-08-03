using Blip.IncidentManager.Application.Exceptions;
using Blip.IncidentManager.Application.Interfaces;
using MediatR;

namespace Blip.IncidentManager.Application.Incidents.Commands.Update
{
    public class UpdateIncidentCommandHandler : IRequestHandler<UpdateIncidentCommand, Unit>
    {
        private readonly IUnitOfWork _unitOfWork;
        public UpdateIncidentCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        private string SetIfNotNullOrWhiteSpace(string target, string? value)
        {
            return !string.IsNullOrWhiteSpace(value) ? value : target;
        }

        public async Task<Unit> Handle(UpdateIncidentCommand request, CancellationToken cancellationToken)
        {
            var incident = await _unitOfWork.GetIncidents().GetByIdAsync(request.Id);
            if (incident == null)
            {
                throw new IncidentNotFound($"Incident with ID {request.Id} not found.");
            }

            incident.Title = SetIfNotNullOrWhiteSpace(incident.Title, request.Title);
            incident.Description = SetIfNotNullOrWhiteSpace(incident.Description, request.Description);
            incident.Status = SetIfNotNullOrWhiteSpace(incident.Status, request.Status);
            incident.Priority = SetIfNotNullOrWhiteSpace(incident.Priority, request.Priority);
            
            if (request.AssignedUserId.HasValue || incident.AssignedToId.HasValue)
            {
                incident.AssignedToId = request.AssignedUserId ?? null;
            }

            _unitOfWork.GetIncidents().Update(incident);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }

}
