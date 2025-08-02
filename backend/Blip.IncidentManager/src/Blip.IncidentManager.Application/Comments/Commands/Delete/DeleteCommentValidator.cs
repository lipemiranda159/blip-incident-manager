using Blip.IncidentManager.Application.Incidents.Commands.Delete;
using Blip.IncidentManager.Application.Interfaces;
using FluentValidation;

namespace Blip.IncidentManager.Application.Comments.Commands.Delete
{
    public class DeleteCommentValidator : AbstractValidator<DeleteCommentCommand>
    {

        public DeleteCommentValidator(IUnitOfWork unitOfWork)
        {
            RuleFor(x => x.Id).NotEmpty().WithMessage("Comment ID is required.");
            RuleFor(x => x.Id)
            .MustAsync(async (command, commentId, cancellationToken) =>
            {
                var comment = await unitOfWork.GetComments().GetByIdAsync(commentId);
                return comment != null && comment.AuthorId == command.userId;
            })
            .WithMessage("You do not have permission to delete this comment.");
        }
    }
}
