using Blip.IncidentManager.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Blip.IncidentManager.Persistence.Repositories
{
    public class UserRepository : RepositoryBase<User>
    {
        public UserRepository(DbContext context) : base(context)
        {
        }
    }
}
