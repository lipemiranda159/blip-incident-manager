using Blip.IncidentManager.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Blip.IncidentManager.Persistence.Contexts;

public class IncidentDbContext : DbContext
{
    public IncidentDbContext(DbContextOptions<IncidentDbContext> options)
        : base(options)
    {
    }

    public DbSet<Incident> Incidents => Set<Incident>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Comment> Comments => Set<Comment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.ToTable("users");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.Type).HasColumnName("type");
            entity.Property(e => e.Avatar).HasColumnName("avatar");
            entity.Property(e => e.PasswordHash).HasColumnName("password_hash");

            entity.HasMany(e => e.CreatedIncidents)
                  .WithOne(i => i.CreatedBy)  
                  .HasForeignKey(i => i.CreatedById)
                  .HasConstraintName("incidents_created_by_fkey")
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.AssignedIncidents)
                  .WithOne(i => i.AssignedTo)
                  .HasForeignKey(i => i.AssignedToId)
                  .HasConstraintName("incidents_assigned_to_fkey")
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Incident>(entity =>
        {
            entity.ToTable("incidents");

            entity.HasKey(e => e.Id);

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Title).HasColumnName("title");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.Priority).HasColumnName("priority");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
            entity.Property(e => e.Category).HasColumnName("category");

            entity.Property(e => e.CreatedById).HasColumnName("created_by_id");
            entity.Property(e => e.AssignedToId).HasColumnName("assigned_to_id");

            entity.HasOne(e => e.CreatedBy)
                  .WithMany(u => u.CreatedIncidents)  
                  .HasForeignKey(e => e.CreatedById)
                  .HasConstraintName("incidents_created_by_fkey")
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.AssignedTo)
                  .WithMany(u => u.AssignedIncidents)
                  .HasForeignKey(e => e.AssignedToId)
                  .HasConstraintName("incidents_assigned_to_fkey")
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<Comment>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasOne(e => e.Author)
                  .WithMany()
                  .HasForeignKey(e => e.AuthorId);
        });


        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            entity.SetTableName(entity.GetTableName().ToLowerInvariant());

            foreach (var property in entity.GetProperties())
            {
                property.SetColumnName(property.GetColumnName().ToLowerInvariant());
            }

            foreach (var key in entity.GetKeys())
            {
                key.SetName(key.GetName().ToLowerInvariant());
            }

            foreach (var foreignKey in entity.GetForeignKeys())
            {
                foreignKey.SetConstraintName(foreignKey.GetConstraintName().ToLowerInvariant());
            }

            foreach (var index in entity.GetIndexes())
            {
                index.SetDatabaseName(index.GetDatabaseName().ToLowerInvariant());
            }
        }
    }
}
