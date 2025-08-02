using Blip.IncidentManager.Domain.Entities;

namespace Blip.IncidentManager.Application.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IRepository<Incident> GetIncidents();

    IRepository<User> GetUsers();
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
