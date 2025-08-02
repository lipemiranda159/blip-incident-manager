using Blip.IncidentManager.Application.Exceptions;
using Blip.IncidentManager.Application.Interfaces;
using MediatR;

namespace Blip.IncidentManager.Application.Incidents.Commands.Delete
{
    public class DeleteIncidentCommandHandler : IRequestHandler<DeleteIncidentCommand, Unit>
    {
        private readonly IUnitOfWork _unitOfWork;
        public DeleteIncidentCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<Unit> Handle(DeleteIncidentCommand request, CancellationToken cancellationToken)
        {
            var incident = await _unitOfWork.GetIncidents().GetByIdAsync(request.Id);
            if (incident == null)
            {
                throw new IncidentNotFound($"Incident with ID {request.Id} not found.");
            }
            _unitOfWork.GetIncidents().Remove(incident);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }
    }
}
