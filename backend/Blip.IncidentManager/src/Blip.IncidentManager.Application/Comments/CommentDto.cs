using Blip.IncidentManager.Application.Auth;
using Blip.IncidentManager.Application.Incidents;

namespace Blip.IncidentManager.Application.Comments
{
    public class CommentDto
    {
        public Guid Id { get; set; }

        public string Content { get; set; } = default!;
        public DateTime CreatedAt { get; set; }

        // Foreign key
        public Guid AuthorId { get; set; }
        public UserDto Author { get; set; } = default!;

        public Guid IncidentId { get; set; }
        public IncidentDto Incident { get; set; } = default!;
    }
}
