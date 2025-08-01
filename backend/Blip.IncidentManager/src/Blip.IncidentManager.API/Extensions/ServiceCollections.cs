using Blip.IncidenteManager.ServiceConfigurations.Extensions;
using Blip.IncidentManager.Infrastructure.Extensions;
using Blip.IncidentManager.Persistence.Extensions;

namespace Blip.IncidentManager.API.Extensions
{
    public static class ServiceCollections
    {
        public static IServiceCollection AddIncidentManagerApiService(this IServiceCollection services, IConfiguration configuration)
        {
            var config = services.AddServiceConfigurations(configuration);
            services.AddIncidentDbContext(config);
            services.AddIncidentManagerRepositories();
            return services;
        }
    }
}
