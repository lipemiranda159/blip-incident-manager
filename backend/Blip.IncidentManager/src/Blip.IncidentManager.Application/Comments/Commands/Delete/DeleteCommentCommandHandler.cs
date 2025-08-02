using Blip.IncidentManager.Application.Exceptions;
using Blip.IncidentManager.Application.Interfaces;
using MediatR;

namespace Blip.IncidentManager.Application.Incidents.Commands.Delete
{
    public class DeleteCommentCommandHandler : IRequestHandler<DeleteCommentCommand, Unit>
    {
        private readonly IUnitOfWork _unitOfWork;
        public DeleteCommentCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task<Unit> Handle(DeleteCommentCommand request, CancellationToken cancellationToken)
        {
            var comment = await _unitOfWork.GetComments().GetByIdAsync(request.Id);
            if (comment == null)
            {
                throw new IncidentNotFound($"Comment with ID {request.Id} not found.");
            }
            _unitOfWork.GetComments().Remove(comment);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return Unit.Value;
        }
    }
}
