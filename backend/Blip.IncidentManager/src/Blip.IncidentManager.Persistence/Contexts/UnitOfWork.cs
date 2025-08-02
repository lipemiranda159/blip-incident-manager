using Blip.IncidentManager.Application.Interfaces;
using Blip.IncidentManager.Domain.Entities;
using Blip.IncidentManager.Persistence.Repositories;

namespace Blip.IncidentManager.Persistence.Contexts;

public class UnitOfWork : IUnitOfWork
{
    private readonly IncidentDbContext _context;
    private readonly IRepository<Incident> incidents;
    private readonly IUserRepository users;
    private readonly IRepository<Comment> comments;

    public UnitOfWork(IncidentDbContext context)
    {
        _context = context;
        incidents = new IncidentRepository(_context);
        users = new UserRepository(_context);
        comments = new CommentRepository(_context); 
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) =>
        await _context.SaveChangesAsync(cancellationToken);

    public void Dispose() => _context.Dispose();
    public IRepository<Incident> GetIncidents()
    {
        return incidents;
    }
    public IUserRepository GetUsers()
    {
        return users;
    }

    public IRepository<Comment> GetComments()
    {
        return comments;
    }
}
