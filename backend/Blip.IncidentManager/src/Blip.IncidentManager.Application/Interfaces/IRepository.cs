using System.Linq.Expressions;

namespace Blip.IncidentManager.Application.Interfaces;

public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(Guid id, params string[] includes);
    Task<IEnumerable<T>> GetAllAsync(int pageNumber, int pageSize, params string[] includes);
    Task<List<TResult>> GetAllProjectedAsync<TResult>(
    Expression<Func<T, TResult>> selector,
    int pageNumber,
    int pageSize,
    params string[] includes);
    Task<int> CountAsync();
    Task<T> AddAsync(T entity);
    void Update(T entity);
    void Remove(T entity);
}
