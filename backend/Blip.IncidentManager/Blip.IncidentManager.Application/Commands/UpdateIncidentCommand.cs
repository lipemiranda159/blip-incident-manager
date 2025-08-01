using Blip.IncidentManager.Application.DTOs;
using MediatR;

namespace Blip.IncidentManager.Application.Commands;

public record UpdateIncidentCommand(Guid Id, string Title, string Description, Guid AssignedUserId) : IRequest<IncidentDto>;
