using System.Linq.Expressions;
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

    public virtual async Task<IEnumerable<T>> GetAllAsync(
        int pageNumber,
        int pageSize,
        params string[] includes)
    {
        IQueryable<T> query = _dbSet;

        if (includes != null)
        {
            foreach (var include in includes)
            {
                query = query.Include(include);
            }
        }

        return await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<List<TResult>> GetAllProjectedAsync<TResult>(
        Expression<Func<T, TResult>> selector,
        int pageNumber,
        int pageSize,
        params string[] includes)
    {
        IQueryable<T> query = _context.Set<T>();

        foreach (var include in includes)
            query = query.Include(include);

        return await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .Select(selector)
            .ToListAsync();
    }

    public virtual async Task<T> AddAsync(T entity)
    {
        var entry = await _dbSet.AddAsync(entity);
        return entry.Entity;
    }

    public virtual void Update(T entity) =>
        _dbSet.Update(entity);

    public virtual void Remove(T entity) =>
        _dbSet.Remove(entity);

    public async Task<int> CountAsync()
    {
        return await _dbSet.CountAsync();
    }
}