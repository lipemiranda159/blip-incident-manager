using Blip.IncidentManager.Domain.Entities;

namespace Blip.IncidentManager.Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IRepository<Incident> GetIncidents();
    IRepository<Comment> GetComments();
    IUserRepository GetUsers();
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
