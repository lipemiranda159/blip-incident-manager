using Blip.IncidentManager.Domain.Entities;

namespace Blip.IncidentManager.Application.Interfaces
{
    public interface IUserRepository : IRepository<User>
    {
        Task<User?> GetUserByEmailAsync(string email);
    }
}
