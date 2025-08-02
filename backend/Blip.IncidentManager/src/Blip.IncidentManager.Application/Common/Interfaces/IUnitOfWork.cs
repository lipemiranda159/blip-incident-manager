using Blip.IncidentManager.Domain.Entities;

namespace Blip.IncidentManager.Application.Common.Interfaces;

public interface IUnitOfWork : IDisposable
{
    IRepository<Incident> Incidents { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
