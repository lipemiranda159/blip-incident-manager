using Blip.IncidentManager.Application.Common.Interfaces;
using Blip.IncidentManager.Domain.Entities;
using Blip.IncidentManager.Persistence.Repositories;

namespace Blip.IncidentManager.Persistence.Contexts;

public class UnitOfWork : IUnitOfWork
{
    private readonly IncidentDbContext _context;
    public IRepository<Incident> Incidents { get; }

    public UnitOfWork(IncidentDbContext context)
    {
        _context = context;
        Incidents = new IncidentRepository(_context);
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) =>
        await _context.SaveChangesAsync(cancellationToken);

    public void Dispose() => _context.Dispose();
}
