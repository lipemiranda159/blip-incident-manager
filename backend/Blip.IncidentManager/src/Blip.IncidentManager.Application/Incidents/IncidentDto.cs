using Blip.IncidentManager.Application.Auth;

namespace Blip.IncidentManager.Application.Incidents;

public class IncidentDto
{
    public IncidentDto()
    {
        
    }

    public IncidentDto(Guid id, string title, string description, DateTime createdAt)
    {
        Id = id;
        Title = title;
        Description = description;
        CreatedAt = createdAt;
    }

    public Guid Id { get; set; }
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string Status { get; set; } = default!;
    public string Priority { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public UserDto CreatedBy { get; set; } = default!;
}
