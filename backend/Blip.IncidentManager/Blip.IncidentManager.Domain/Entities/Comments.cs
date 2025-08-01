namespace Blip.IncidentManager.Domain.Entities;

public class Comment
{
    public Guid Id { get; set; }

    public string Content { get; set; } = default!;
    public DateTime CreatedAt { get; set; }

    // Foreign key
    public Guid AuthorId { get; set; }
    public User Author { get; set; } = default!;

    public Guid IncidentId { get; set; }
    public Incident Incident { get; set; } = default!;
}

