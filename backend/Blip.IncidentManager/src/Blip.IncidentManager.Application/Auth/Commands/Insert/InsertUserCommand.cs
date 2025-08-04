﻿using MediatR;

namespace Blip.IncidentManager.Application.Auth.Commands.Insert;

public class InsertUserCommand() : IRequest<UserDto>
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Avatar { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
