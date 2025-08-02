using Blip.IncidentManager.Domain.Entities;

namespace Blip.IncidentManager.Application.Interfaces
{
    public interface IJwtTokenGeneratorService
    {
        string GenerateToken(User user);
    }
}
