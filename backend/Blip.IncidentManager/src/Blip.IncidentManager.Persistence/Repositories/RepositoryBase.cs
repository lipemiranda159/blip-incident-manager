using Blip.IncidentManager.Application.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Blip.IncidentManager.Persistence.Repositories;

public abstract class RepositoryBase<T> : IRepository<T> where T : class
{
    protected readonly DbContext _context;
    protected readonly DbSet<T> _dbSet;

    protected RepositoryBase(DbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public virtual async Task<T?> GetByIdAsync(Guid id) =>
        await _dbSet.FindAsync(id);

    public virtual async Task<IEnumerable<T>> GetAllAsync() =>
        await _dbSet.ToListAsync();

    public virtual async Task<T> AddAsync(T entity)
    {
        var entry = await _dbSet.AddAsync(entity);
        return entry.Entity;
    }

    public virtual void Update(T entity) =>
        _dbSet.Update(entity);

    public virtual void Remove(T entity) =>
        _dbSet.Remove(entity);
}