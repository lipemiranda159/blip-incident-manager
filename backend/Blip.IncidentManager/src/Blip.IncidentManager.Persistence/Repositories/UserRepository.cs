using Blip.IncidentManager.Application.Interfaces;
using Blip.IncidentManager.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Blip.IncidentManager.Persistence.Repositories
{
    public class UserRepository : RepositoryBase<User>, IUserRepository
    {
        public UserRepository(DbContext context) : base(context)
        {
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Set<User>().FirstOrDefaultAsync(u => u.Email == email);
        }

    }
}
