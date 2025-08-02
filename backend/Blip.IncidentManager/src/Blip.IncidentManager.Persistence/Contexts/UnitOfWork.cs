using Blip.IncidentManager.Application.Interfaces;
using Blip.IncidentManager.Domain.Entities;
using Blip.IncidentManager.Persistence.Repositories;

namespace Blip.IncidentManager.Persistence.Contexts;

public class UnitOfWork : IUnitOfWork
{
    private readonly IncidentDbContext _context;
    private readonly IRepository<Incident> incidents;
    private readonly IRepository<User> users;

    public IRepository<Incident> GetIncidents()
    {
        return incidents;
    }

    public UnitOfWork(IncidentDbContext context)
    {
        _context = context;
        incidents = new IncidentRepository(_context);
        users = new UserRepository(_context);
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) =>
        await _context.SaveChangesAsync(cancellationToken);

    public void Dispose() => _context.Dispose();

    public IRepository<User> GetUsers()
    {
        return users;
    }
}
