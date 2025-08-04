﻿using MediatR;

namespace Blip.IncidentManager.Application.Auth.Commands.Login;

public class LoginCommand : IRequest<string>
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
