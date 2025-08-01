using Blip.IncidenteManager.ServiceConfigurations.Extensions;

namespace Blip.IncidentManager.API.Extensions
{
    public static class ServiceCollections
    {
        public static IServiceCollection AddIncidentManagerApiService(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddServiceConfigurations(configuration);

            return services;
        }
    }
}
