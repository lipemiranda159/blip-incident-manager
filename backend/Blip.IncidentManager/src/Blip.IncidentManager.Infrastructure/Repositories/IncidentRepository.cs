using Blip.IncidentManager.Application.Common.Interfaces;
using Blip.IncidentManager.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Blip.IncidentManager.Infrastructure.Persistence.Repositories;

public class IncidentRepository : IRepository<Incident>
{
    private readonly IncidentDbContext _context;

    public IncidentRepository(IncidentDbContext context)
    {
        _context = context;
    }

    public async Task<Incident?> GetByIdAsync(Guid id) =>
        await _context.Incidents.FindAsync(id);

    public async Task<IEnumerable<Incident>> GetAllAsync() =>
        await _context.Incidents.ToListAsync();

    public async Task AddAsync(Incident entity) =>
        await _context.Incidents.AddAsync(entity);

    public void Update(Incident entity) =>
        _context.Incidents.Update(entity);

    public void Remove(Incident entity) =>
        _context.Incidents.Remove(entity);
}
