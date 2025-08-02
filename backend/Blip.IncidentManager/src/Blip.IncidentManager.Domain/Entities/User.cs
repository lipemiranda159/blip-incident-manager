namespace Blip.IncidentManager.Domain.Entities;
public class User
{
    public Guid Id { get; set; }

    public string Name { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string Type { get; set; } = default!; // 'solicitante' | 'atendente'
    public string? Avatar { get; set; }

    public string PasswordHash { get; set; } = default!;

    //// Relacionamentos
    public ICollection<Incident> CreatedIncidents { get; set; } = new List<Incident>();
    public ICollection<Incident> AssignedIncidents { get; set; } = new List<Incident>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}

