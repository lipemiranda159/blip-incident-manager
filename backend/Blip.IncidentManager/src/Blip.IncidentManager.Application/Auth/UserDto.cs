namespace Blip.IncidentManager.Application.Auth;

public class UserDto
{
    public UserDto()
    {
        
    }

    public UserDto(Guid id, string name, string email, string type, string avatar)
    {
        Id = id;
        Name = name;
        Email = email;
        Type = type;
        Avatar = avatar;
    }

    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string Type { get; set; } = default!;
    public string Avatar { get; set; } = default!;

}

