using MediatR;

namespace Blip.IncidentManager.Application.Incidents.Commands.Delete;

public record DeleteCommentCommand(Guid Id, Guid userId) : IRequest<Unit>;