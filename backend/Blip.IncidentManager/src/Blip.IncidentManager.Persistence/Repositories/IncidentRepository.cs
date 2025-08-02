using Blip.IncidentManager.Application.Common.Interfaces;
using Blip.IncidentManager.Domain.Entities;
using Blip.IncidentManager.Persistence.Contexts;
using Microsoft.EntityFrameworkCore;

namespace Blip.IncidentManager.Persistence.Repositories;

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

    public async Task<Incident> AddAsync(Incident entity)
    {
        entity.CreatedAt = DateTime.UtcNow;
        var incident = await _context.Incidents.AddAsync(entity);
        return incident.Entity;
    }
    public void Update(Incident entity) =>
        _context.Incidents.Update(entity);

    public void Remove(Incident entity) =>
        _context.Incidents.Remove(entity);
}
