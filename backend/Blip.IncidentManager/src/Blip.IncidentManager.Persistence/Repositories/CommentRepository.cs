using Blip.IncidentManager.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Blip.IncidentManager.Persistence.Repositories
{
    public class CommentRepository : RepositoryBase<Comment>
    {
        public CommentRepository(DbContext context) : base(context)
        {
        }

        public override Task<Comment> AddAsync(Comment entity)
        {
            entity.CreatedAt = DateTime.SpecifyKind(entity.CreatedAt, DateTimeKind.Utc);
            return base.AddAsync(entity);
        }
    }
}
