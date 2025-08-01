namespace Blip.IncidentManager.Domain.Entities;

public class Incident
{
    public Guid Id { get; set; }

    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;

    public string Status { get; set; } = default!;   // 'Aberto' | 'Em andamento' | etc.
    public string Priority { get; set; } = default!; // 'Baixa', 'Média', etc.

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public string Category { get; set; } = default!;

    // Foreign keys
    public Guid CreatedById { get; set; }
    public User CreatedBy { get; set; } = default!;

    public Guid? AssignedToId { get; set; }
    public User? AssignedTo { get; set; }

    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
