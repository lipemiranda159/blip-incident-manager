using Blip.IncidentManager.Domain.Interfaces;
using Blip.IncidentManager.Infrastructure.ExternalServices;
using Microsoft.Extensions.DependencyInjection;

namespace Blip.IncidentManager.Infrastructure.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddIncidentManagerInfrastructure(this IServiceCollection services)
        {
            services.AddScoped<IPasswordHasher, IdentityPasswordHasher>();
            return services;
        }
    }
}
