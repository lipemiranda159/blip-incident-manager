using MediatR;

namespace Blip.IncidentManager.Application.Comments.Commands.Insert;

public class CreateCommentCommand : IRequest<CommentDto>
{
    public string Content { get; set; } = string.Empty;
    public Guid AuthorId { get; set; }
    public Guid IncidentId { get; set; }


}

