using Blip.IncidentManager.Application.Interfaces;
using Blip.IncidentManager.Domain.Entities;
using MediatR;

namespace Blip.IncidentManager.Application.Comments.Commands
{
    public class CreateCommentCommandHandler : IRequestHandler<CreateCommentCommand, CommentDto>
    {
        private readonly IUnitOfWork _unitOfWork;

        public CreateCommentCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<CommentDto> Handle(CreateCommentCommand request, CancellationToken cancellationToken)
        {
            var comment = new Comment()
            {
                Content = request.Content,
                AuthorId = request.AuthorId,
                IncidentId = request.IncidentId,
            };

            var newComment = await _unitOfWork.GetComments().AddAsync(comment);
            await _unitOfWork.SaveChangesAsync();

            return new CommentDto(newComment.Id, newComment.AuthorId,newComment.IncidentId, newComment.Content);
        }
    }
}
