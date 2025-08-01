using Microsoft.EntityFrameworkCore;
using Blip.IncidentManager.Domain.Entities;

namespace Blip.IncidentManager.Persistence.Contexts;

public class IncidentDbContext : DbContext
{
    public IncidentDbContext(DbContextOptions<IncidentDbContext> options) : base(options) { }

    public DbSet<Incident> Incidents => Set<Incident>();
}
