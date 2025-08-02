using Blip.IncidentManager.Domain.Entities;
using Blip.IncidentManager.Persistence.Contexts;

namespace Blip.IncidentManager.Persistence.Repositories;

public class IncidentRepository : RepositoryBase<Incident>
{
    public IncidentRepository(IncidentDbContext context) : base(context) { }

    public override async Task<Incident> AddAsync(Incident entity)
    {
        entity.CreatedAt = DateTime.UtcNow;
        return await base.AddAsync(entity);
    }

    public override void Update(Incident entity)
    {
        entity.CreatedAt = DateTime.SpecifyKind(entity.CreatedAt, DateTimeKind.Utc);
        entity.UpdatedAt = DateTime.UtcNow;
        base.Update(entity);
    }
}
