using Blip.IncidentManager.Application.Auth;

namespace Blip.IncidentManager.Application.Comments
{
    public class CommentDto
    {
        public CommentDto(Guid id, Guid authorId,Guid incidentId, string content)
        {
            Id = id;
            AuthorId = authorId;
            Content = content;
            IncidentId = incidentId;
        }

        public Guid Id { get; set; }

        public string Content { get; set; } = default!;
        public DateTime CreatedAt { get; set; }

        // Foreign key
        public Guid AuthorId { get; set; }
        public UserDto Author { get; set; } = default!;

        public Guid IncidentId { get; set; }

    }
}
